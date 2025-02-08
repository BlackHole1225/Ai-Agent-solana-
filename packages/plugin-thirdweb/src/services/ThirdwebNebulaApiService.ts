const API_URL = "https://nebula-api.thirdweb.com";

export function ThirdwebNubulaService() {
  let sessionId = null;
  async function initializeThirdwebNebulaApiService(): Promise<string> {
    const API_URL = "https://nebula-api.thirdweb.com";
    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    if (!secretKey) {
      throw new Error("THIRDWEB_SECRET_KEY environment variable is required");
    }

    try {
      const response = await fetch(`${API_URL}/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-secret-key": secretKey,
        },
        body: "{}",
      });

      if (!response.ok) {
        throw new Error(`Failed to initialize session: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Initialized thirdweb nebula api service with session:", data.result.id);
      sessionId = data.result.id;
      return data.result.id;
    } catch (error) {
      console.error("Failed to initialize thirdweb nebula api service:", error);
      throw error;
    }
  }

  async function processThirdwebNebulaChat(message: string): Promise<string> {
    if (!sessionId) {
      await initializeThirdwebNebulaApiService();
    }

    const secretKey = process.env.THIRDWEB_SECRET_KEY || "";

    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify({
        message,
        user_id: "default-user",
        stream: false,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Nebula response:", data);
    return data?.message;
  }
  return { initializeThirdwebNebulaApiService, processThirdwebNebulaChat }
}