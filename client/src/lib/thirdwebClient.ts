import { createThirdwebClient, getContract } from "thirdweb";
import { mainnet, sepolia } from "thirdweb/chains";

console.log(import.meta.env.VITE_THIRDWEB_CLIENT_ID)

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID!,
});

export const getErc20Contract = (address: string) => {
  return getContract({
    client,
    address,
    chain: mainnet
  });
}
export const getDevErc20Contract = (address: string) => {
  return getContract({
    client,
    address,
    chain: sepolia
  });
}