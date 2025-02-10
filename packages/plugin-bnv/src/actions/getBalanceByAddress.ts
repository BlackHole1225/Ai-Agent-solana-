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
import { getWalletBalaceAddressExample } from "../examples";

export default {
  name: "GET_BALANCE_ADDRESS",
  similes: [],
  description: "Get balance by wallet address",
  examples: getWalletBalaceAddressExample,
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
    elizaLogger.log("Starting CoinGecko GET_TRENDING handler...");
    callback({
      text: "OKAY",
      content: "okaysdfasjdlfajsldf"
    })
    return true;
  }
} as Action;