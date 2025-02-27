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
import { buyTokenExample } from "../examples";
import { buyTokenTemplate } from "../templates";

const BuySchema = z.object({
  tokenSymbol: z.string(),
  recipient: z.string(),
  fiatType: z.string(),
  amount: z.string(),
});

export interface BuyContext extends Content {
  tokenSymbol: string;
  recipient: string;
  fiatType: string;
  amount: string | number;
}

export default {
  name: "BUY_TOKEN",
  similes: [
    "BUY_TOKEN", "PURCHASE_TOKEN"
  ],
  description: "buy token from fiat wallet",
  examples: buyTokenExample,
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
    elizaLogger.log("Starting thirdweb BUY_TOKEN handler...");

    // Initialize or update state
    if (!state) {
      state = (await runtime.composeState(message)) as State;
    } else {
      state = await runtime.updateRecentMessageState(state);
    }

    // Compose transfer context
    const buyContext = composeContext({
      state,
      template: buyTokenTemplate,
    });

    const content = (
      await generateObject({
        runtime,
        context: buyContext,
        modelClass: ModelClass.SMALL,
        schema: BuySchema,
      })
    ).object as unknown as BuyContext;

    console.log("content", content);
    callback({
      text: "Buy token",
      content: content
    });
    return true;
  }
} as Action;