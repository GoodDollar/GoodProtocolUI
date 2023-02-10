import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";

export const useNativeBalance = () => {
  const { account } = useEthers();
  const nativeBalance = useEtherBalance(account);

  if (nativeBalance) {
    return formatEther(nativeBalance);
  }
};
