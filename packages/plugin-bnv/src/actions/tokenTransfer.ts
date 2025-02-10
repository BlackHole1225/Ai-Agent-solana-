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
import { tokenTranferExample } from "../examples";
import { transferTemplate } from "../templates";

const TransferSchema = z.object({
  tokenAddress: z.string(),
  tokenSymbol: z.string(),
  recipient: z.string(),
  amount: z.string(),
});

export interface TransferContent extends Content {
  tokenSymbol: string;
  tokenAddress: string;
  recipient: string;
  amount: string | number;
}

export default {
  name: "TRANSFER_TOKEN",
  similes: [
    "SEND_TOKEN"
  ],
  description: "Send token to wallet address",
  examples: tokenTranferExample,
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
    elizaLogger.log("Starting thirdweb SEND_TOKEN handler...");

    // Initialize or update state
    if (!state) {
      state = (await runtime.composeState(message)) as State;
    } else {
      state = await runtime.updateRecentMessageState(state);
    }

    // Compose transfer context
    const transferContext = composeContext({
      state,
      template: transferTemplate,
    });

    const content = (
      await generateObject({
        runtime,
        context: transferContext,
        modelClass: ModelClass.SMALL,
        schema: TransferSchema,
      })
    ).object as unknown as TransferContent;

    console.log("content", content);
    callback({
      text: "Transfer Token",
      content: content
    });
    return true;
  }
} as Action;