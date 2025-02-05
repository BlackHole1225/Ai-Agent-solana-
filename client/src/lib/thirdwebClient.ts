import { createThirdwebClient } from "thirdweb";
 
console.log(import.meta.env.VITE_THIRDWEB_CLIENT_ID)

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID!,
});

