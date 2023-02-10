import React, { useCallback, useContext, useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import { Web3Provider, useSwitchNetwork } from "./Web3Context";
import { Web3Context } from "./Web3Context";

const TestSwitch = () => {
  const [id, setNetwork] = useState(0);
  const { switchNetwork, setSwitchNetwork } = useSwitchNetwork();
  const switchit = useCallback(
    async (id: number) => {
      console.log("setting network:", id);
      setNetwork(id);
    },
    [setNetwork]
  );
  return (
    <div>
      <div onClick={() => setSwitchNetwork(switchit)} data-testid="setNetwork"></div>
      <div data-testid="displayNetwork">{"" + id}</div>
      <div data-testid="switch" onClick={() => switchNetwork && switchNetwork(1)}></div>
    </div>
  );
};

const TestEmitter = () => {
  const [title, setTitle] = useState<string>();
  const { txEmitter } = useContext(Web3Context);
  useEffect(() => {
    txEmitter.on(tx => {
      setTitle(tx.title);
    });
    txEmitter.emit({ title: "test", from: "", to: "", txhash: "0x0" });
  }, [txEmitter, setTitle]);
  return (
    <div>
      <div data-testid="displayTX">{title}</div>
    </div>
  );
};

describe("Web3Context", () => {
  test("renders the contextt", () => {
    render(
      <Web3Provider config={{}}>
        <div />
      </Web3Provider>
    );
  });

  test("set switch function and switches network", async () => {
    render(
      <Web3Provider config={{}}>
        <TestSwitch />
      </Web3Provider>
    );
    screen.getByTestId("setNetwork").click();
    screen.getByTestId("switch").click();
    expect(screen.getByTestId("displayNetwork").textContent).toEqual("1");
  });

  test("should emit/receive tx data using txEmitter", async () => {
    render(
      <Web3Provider config={{}}>
        <TestEmitter />
      </Web3Provider>
    );
    const el = await screen.findByText("test", undefined, { timeout: 2000 });
    expect(el.getAttribute("data-testid")).toEqual("displayTX");
  });
});
