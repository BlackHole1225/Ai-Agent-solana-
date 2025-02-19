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

import { createPreWalletExample } from "../examples";
import { preWalletTemplete } from "../templates";


const PreWalletSchema = z.object({
  emailAddress: z.string(),
 
});
export interface CreatePreWallet extends Content {
  emailAddress: string;
}

export default {
  name: "CREATE_PREWALLET",
  similes: ["CREATE_PREWALLET","MAKE_PREWALLET"],
  description: "Create pregenerate wallet",
  examples: createPreWalletExample,
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
     elizaLogger.log("Starting thirdweb CREATE_PREWALLET handler...");
 
     // Initialize or update state
     if (!state) {
       state = (await runtime.composeState(message)) as State;
     } else {
       state = await runtime.updateRecentMessageState(state);
     }
 
     // Compose balance context
     const preWalletContext = composeContext({
       state,
       template: preWalletTemplete,
     });
 
     const content = (
       await generateObject({
         runtime,
         context: preWalletContext,
         modelClass: ModelClass.SMALL,
         schema: PreWalletSchema,
       })
     ).object as unknown as CreatePreWallet;
 
     console.log("content", content);
     callback({
       text: "create pregenrated wallet",
       content: content
     });
     return true;
   }
 } as Action;