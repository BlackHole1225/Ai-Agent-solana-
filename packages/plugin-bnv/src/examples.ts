import type { ActionExample } from "@elizaos/core";

export const getWalletBalanceAddressExample: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Balance of 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "GET_BALANCE"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "What is the wallet balance of 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2?",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "GET_BALANCE"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I wanna check wallet balance of 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "GET_BALANCE"
      },
    }
  ]
];

export const tokenTranferExample: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "Send 10 USDC to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "TRANSFER_TOKEN"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Transfer 10 USDT to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "TRANSFER_TOKEN"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I wanna transfer 10 USDT to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will check transaction",
        action: "TRANSFER_TOKEN"
      },
    }
  ]
];
export const createPreWalletExample: ActionExample[][] = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "create wallet by user@example.com email",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will create pregenerated wallet",
        action: "CREATE_PREWALLET"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "generate pregenerated wallet by user@example.com email",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will create pregenerated wallet",
        action: "CREATE_PREWALLET"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "provide me new wallet using user@example.com email",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will create pregenerated wallet",
        action: "CREATE_PREWALLET"
      },
    }
  ],
];