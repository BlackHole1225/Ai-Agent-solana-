import type { ActionExample } from "@elizaos/core";

export const getWalletBalaceAddressExample: ActionExample[][] = [
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
        text: "In what city?",
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
        text: "In what city?",
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