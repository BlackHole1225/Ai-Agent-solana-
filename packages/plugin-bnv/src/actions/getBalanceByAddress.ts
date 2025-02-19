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

import { getWalletBalanceAddressExample } from "../examples";
import { balanceTemplate } from "../templates";


const BalanceSchema = z.object({
  tokenAddress: z.string(),
  walletAddress: z.string(),
  tokenSymbol: z.string(),
});
export interface GetBalance extends Content {
  tokenSymbol: string;
  walletAddress: string;
  tokenAddress: string;
}

export default {
  name: "GET_BALANCE",
  similes: ["GET_BALANCE","CHECK_BALANCE"],
  description: "Get balance by wallet address",
  examples: getWalletBalanceAddressExample,
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
     elizaLogger.log("Starting thirdweb GET_BALANCE handler...");
 
     // Initialize or update state
     if (!state) {
       state = (await runtime.composeState(message)) as State;
     } else {
       state = await runtime.updateRecentMessageState(state);
     }
 
     // Compose balance context
     const balanceContext = composeContext({
       state,
       template: balanceTemplate,
     });
 
     const content = (
       await generateObject({
         runtime,
         context: balanceContext,
         modelClass: ModelClass.SMALL,
         schema: BalanceSchema,
       })
     ).object as unknown as GetBalance;
 
     console.log("content", content);
     callback({
       text: "get balance",
       content: content
     });
     return true;
   }
 } as Action;