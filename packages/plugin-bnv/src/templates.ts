export const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Here are several frequently used addresses. Use these for the corresponding tokens:
- ETH/eth: 0xcA11bde05977b3631167028862bE2a173976CA11
- USDC/usdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

Example response:
\`\`\`json
{
    "tokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "tokenSymbol": "USDC"
    "recipient": "0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62",
    "amount": "1000"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token transfer:
- Token contract address
- Token symbol
- Recipient wallet address
- Amount to transfer

Respond with a JSON markdown block containing only the extracted values.`;

export const balanceTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Here are several frequently used addresses. Use these for the corresponding tokens:
- ETH/eth: 0xcA11bde05977b3631167028862bE2a173976CA11
- USDC/usdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

Example response:
\`\`\`json
{
    "walletAddress": "0xCCa8009f5e09F8C5dB63cb0031052F9CB635Af62",
    "tokenAddress": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "tokenSymbol": "USDC",
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token balance:
- Wallet address
- Token contract address
- Token symbol

Respond with a JSON markdown block containing only the extracted values.`; 

export const preWalletTemplete = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "email": "user@example.com"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token balance:

- Email address

Respond with a JSON markdown block containing only the extracted values.`; 

export const buyTokenTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
Example response:
\`\`\`json
{
    "tokenSymbol": "ETH",
    "recipient": "0x1e9F3bD30C9ACA6e32B92CE2cD56ceB4DD456Bb2",
    "fiatType":"KADO"
    "amount": "1"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested token purchase:
- Token symbol
- Recipient wallet address
- fiat wallet Type
- Amount to purchase

Respond with a JSON markdown block containing only the extracted values.`; 

export const verifyEmailTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.
Example response:
\`\`\`json
{
    "email": "testuser@gmailcom",
    "verificationCode": "123567",
   
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested email verification:
- email address
- verification code


Respond with a JSON markdown block containing only the extracted values.`; 
