import { Faucet } from "@gooddollar/goodprotocol/types";
import { QueryParams, useCalls, useEtherBalance, useEthers, useGasPrice, useNotifications } from "@usedapp/core";
import { BigNumber, ethers } from "ethers";
import { maxBy } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import useRefreshOrNever from "../../hooks/useRefreshOrNever";
import { useGetContract, useGetEnvChainId } from "../base/react";
import { Envs, SupportedChains } from "../constants";

//default wait roughly 1 minute
export const useFaucet = async (refresh: QueryParams["refresh"] = 12) => {
  let refreshOrNever = useRefreshOrNever(refresh);
  const { notifications } = useNotifications();
  const latest = useMemo(() => maxBy(notifications, "submittedAt"), [notifications]);
  const lastNotification = useRef(latest?.submittedAt || 0);

  // if we connected wallet or did a tx then force a refresh
  if (latest && latest.type !== "transactionStarted" && latest?.submittedAt > lastNotification.current) {
    lastNotification.current = latest?.submittedAt;
    refreshOrNever = 1;
  }

  const gasPrice = useGasPrice({ refresh: "never" }) || BigNumber.from("1000000000");
  const minBalance = BigNumber.from("110000").mul(gasPrice);
  const { account, chainId } = useEthers();
  const balance = useEtherBalance(account, { refresh: refreshOrNever }); // refresh roughly once in 10 minutes
  const { baseEnv } = useGetEnvChainId(); // get the env the user is connected to
  const faucet = useGetContract(chainId === SupportedChains.FUSE ? "FuseFaucet" : "Faucet", true, "base") as Faucet;

  const [result] = useCalls(
    [
      {
        contract: faucet,
        method: "canTop",
        args: [account || ethers.constants.AddressZero]
      }
    ].filter(_ => _.contract),
    { refresh: "never" }
  );

  useEffect(() => {
    if (result?.value && account && balance && balance.lt(minBalance)) {
      const devEnv = baseEnv === "fuse" ? "development" : baseEnv;
      const { backend } = Envs[devEnv];

      fetch(backend + "/verify/topWallet", {
        method: "POST",
        body: JSON.stringify({ chainId, account }),
        headers: { "content-type": "application/json" }
      }).catch(e => {
        console.error("topping wallet failed:", e.message, e);
      });
    }
  }, [result, account, balance, baseEnv]);
};
