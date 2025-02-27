import type { Plugin } from "@elizaos/core";
import getBalanceByAddress from "./actions/getBalanceByAddress.ts";
import tokenTransfer from "./actions/tokenTransfer.ts";
import createPregenerateWallet from "./actions/createPregenerateWallet.ts";
import buyToken from "./actions/buyToken.ts";

export const bnvPlugin: Plugin = {
    name: "bnv",
    description: "Agent for users in optimizm",
    actions: [  buyToken, tokenTransfer, getBalanceByAddress, createPregenerateWallet,],
    evaluators: [],
    providers: [],
};
