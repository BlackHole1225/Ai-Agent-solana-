import {
  type ActionExample,
  composeContext,
  type Content,
  elizaLogger,
  generateObject,
  type HandlerCallback,
  type IAgentRuntime,
  type Memory,
  ModelClass,
  type State,
  type Action
} from "@elizaos/core";
import { z } from "zod";
import { verifyEmailExample } from "../examples";
import { verifyEmailTemplate } from "../templates";

const verifySchema = z.object({
  email: z.string(),
  verificationCode: z.string(),
});

export interface VerifyContext extends Content {
  email: string;
  verificationCode: string;
}

export default {
  name: "VERIFY_EMAIL",
  similes: [
    "VERIFY_EMAIL"
  ],
  description: "verify email by verification code",
  examples: verifyEmailExample,
  validate: async () => {
    return true;
  },
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    _options: { [key: string]: unknown },
    callback?: HandlerCallback
  ): Promise<boolean> => {
    elizaLogger.log("Starting thirdweb VERIFY_EMAIL handler...");

    // Initialize or update state
    if (!state) {
      state = (await runtime.composeState(message)) as State;
    } else {
      state = await runtime.updateRecentMessageState(state);
    }

    // Compose transfer context
    const verifyContext = composeContext({
      state,
      template: verifyEmailTemplate,
    });

    const content = (
      await generateObject({
        runtime,
        context: verifyContext,
        modelClass: ModelClass.SMALL,
        schema: verifySchema,
      })
    ).object as unknown as VerifyContext;

    console.log("content", content);
    callback({
      text: "verify email",
      content: content
    });
    return true;
  }
} as Action;