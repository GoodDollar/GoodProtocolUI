import React, { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import { Web3Provider, Fuse } from "../contexts/Web3Context";
import { CallsResult, useMulticallAtChain } from "./useMulticallAtChain";
import { Mainnet, Call, useCalls } from "@usedapp/core";
import { ERC20Interface } from "@usedapp/core";
import { Contract } from "@ethersproject/contracts";

const TestMultiCall = () => {
  const callMulti = useMulticallAtChain(122);
  const [results, setResults] = useState<CallsResult>();
  const calls: Call[] = [
    {
      contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
      method: "balanceOf",
      args: ["0x66582D24FEaD72555adaC681Cc621caCbB208324"]
    },
    {
      contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
      method: "totalSupply",
      args: []
    }
  ];

  useEffect(() => {
    const m = async () => {
      const r = await callMulti(calls);
      if (r) {
        // console.log("results:", { r })
        setResults(r);
      }
    };
    // if (isReady)
    m();
  }, []);
  return (
    <div data-testid="results">
      {results
        ?.filter(_ => _.decoded)
        .map(
          (_, i) =>
            _.decoded && (
              <div key={i} data-testid={`result` + i}>
                {" "}
                {_.decoded[0].toString()}
              </div>
            )
        )}
    </div>
  );
};

// const TestDefaultMultiCall = () => {
//   const [results, setResults] = useState<CallsResult[]>();
//   const calls: Call[] = [
//     {
//       contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
//       method: "balanceOf",
//       args: ["0x66582D24FEaD72555adaC681Cc621caCbB208324"]
//     },
//     {
//       contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
//       method: "balanceOf",
//       args: ["0x495d133B938596C9984d462F007B676bDc57eCEC"]
//     },
//     {
//       contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
//       method: "totalSupply",
//       args: []
//     }
//   ];

//   useEffect(() => {
//     const m = async () => {
//       const r = await useCalls(calls);
//       if (r) {
//         // console.log("results:", { r });
//         setResults(r);
//       }
//     };
//     // if (isReady)
//     m();
//   }, []);
//   return (
//     <div data-testid="results">
//       {results
//         ?.filter(_ => _.)
//         .map(
//           (_, i) =>
//             _.de && (
//               <div key={i} data-testid={`result` + i}>
//                 {" "}
//                 {_.decoded[0].toString()}
//               </div>
//             )
//         )}
//     </div>
//   );
// };

describe("Web3Context", () => {
  // beforeAll(() => {});
  // test("should be able to use multicall to query contract multiple times and query multiple chains", async () => {
  //   render(
  //     <Web3Provider
  //       web3Provider={undefined}
  //       config={{ multicallVersion: 1, networks: [Fuse, Mainnet], readOnlyUrls: { 122: "https://rpc.fuse.io" } }}
  //     >
  //       <TestDefaultMultiCall />
  //     </Web3Provider>
  //   );
  //   const result = await screen.findByTestId("result0", undefined, { timeout: 3000 });
  //   expect(parseInt(result.textContent || "")).toBeGreaterThan(0);
  //   expect(parseInt(screen.getByTestId("result1").textContent || "")).toBeGreaterThan(0);
  // });

  test("should set multicall addresses and dapp config correctly then perform multicall using the readonly rpc", async () => {
    render(
      <Web3Provider
        web3Provider={undefined}
        config={{ multicallVersion: 1, networks: [Fuse, Mainnet], readOnlyUrls: { 122: "https://rpc.fuse.io" } }}
      >
        <TestMultiCall />
      </Web3Provider>
    );
    const result = await screen.findByTestId("result0", undefined, { timeout: 3000 });
    expect(parseInt(result.textContent || "")).toBeGreaterThan(0);
    expect(parseInt(screen.getByTestId("result1").textContent || "")).toBeGreaterThan(0);
  });
});
