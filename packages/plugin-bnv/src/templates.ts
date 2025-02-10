export const transferTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Here are several frequently used addresses. Use these for the corresponding tokens:
- ETH/eth: 0x000000000000000000000000000000000000800A
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