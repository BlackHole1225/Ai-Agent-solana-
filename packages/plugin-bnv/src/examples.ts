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
export const buyTokenExample: ActionExample[][]=[
  [
    {
      user: "{{user1}}",
      content: {
        text: "I want to buy 1 eth to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2 using my kado account",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will buy token using  fiat account",
        action: "BUY_TOKEN"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I want to purchase 0.01 eth to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2 using  kado account",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will buy token using  fiat account",
        action: "BUY_TOKEN"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "send 0.01 eth to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2 using  kado account",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will buy token using  fiat account",
        action: "BUY_TOKEN"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "I want to purchase 0.01 eth to 0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2 by kado account",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will buy token using  fiat account",
        action: "BUY_TOKEN"
      },
    }
  ],
]
export const verifyEmailExample : ActionExample[][]=[
  [
    {
      user: "{{user1}}",
      content: {
        text: "plz verify testuser@gmail.com by number 467389.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will verify email using verification code",
        action: "VERIFY_EMAIL"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "The verification code of testuser@gmail.com is 467389.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will verify email using verification code",
        action: "VERIFY_EMAIL"
      },
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "verify testuser@gmail.com by 467389.",
      },
    },
    {
      user: "{{agent}}",
      content: {
        text: "Will verify email using verification code",
        action: "VERIFY_EMAIL"
      },
    }
  ]
  
]