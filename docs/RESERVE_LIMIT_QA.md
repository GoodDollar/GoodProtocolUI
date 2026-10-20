# Reserve-limit QA simulation

This development-only path exercises the SDK Reserve-limit error classifier and the existing limit modal. It does not test real trading limits, approvals, mined receipts, or delegated-wallet execution.

## Prerequisites

- Node 24 and Yarn 3.6.1.
- A `GoodWeb3-Mono` checkout on `reserve-and-bridge-fixes` that includes the paired QA API: `Web3Provider` accepts `qa.forceTradeLimits`, and `useWeb3Context()` reports `qa.forceTradeLimits === true` only when the SDK simulation is active and blocks Reserve approval/submission before signer access.
- A connected test account, a valid Celo or XDC Reserve quote, and no token balance or allowance are required. Do not approve, sign, or send a transaction.
- The SDK and design packages must be built and installed locally with yalc; package publication is not required.

## Build and install the paired packages

From the `GoodWeb3-Mono` checkout, first update `reserve-and-bridge-fixes` to the commit that implements the QA API, then run:

```sh
yarn install --immutable
cd packages/sdk-v2
yarn build
yalc publish --push
cd ../good-design
yalc add -D @gooddollar/web3sdk-v2
yarn build
```

From the `GoodProtocolUI` checkout on `reserve-and-rpc-fixes`, run:

```sh
yarn install --immutable
yalc add @gooddollar/web3sdk-v2 @gooddollar/good-design
yarn install
```

If setting up the checkout for the first time, enable Corepack with `corepack enable` before using Yarn.

## Enable, run, and disable

In `GoodProtocolUI`, set this in the ignored `.env.local` file:

```dotenv
REACT_APP_QA_FORCE_TRADE_LIMITS=true
```

Start the Vite development server with `yarn start` and open `http://localhost:3000`. The app must be running in development mode; the setting is ignored by production builds. `REACT_APP_NETWORK` remains unchanged: it selects contract deployment configuration and is not the build-mode switch.

Connect a test account, select Celo or XDC, and enter an amount until a valid Reserve quote is shown. With the QA-capable SDK active, the app shows **QA simulation: Reserve limit** instead of the real Approve/Swap actions, even when the wallet has no balance or allowance. The confirmation is labelled **SIMULATE RESERVE LIMIT**. Confirming it exercises the SDK's injected error, which must happen before signer access. If the SDK is old or does not report the capability as active, the QA button and balance/allowance bypass remain unavailable.

Check that the confirmation closes and the existing Reserve-limit modal identifies the selected chain. Celo provides Uniswap and Ubeswap links; XDC provides XSwap. Close the modal and repeat to check it reopens without a stale error. Links are destinations to inspect only; do not connect or trade there.

For the separate layout check, use browser responsive mode at **375 × 812** on both chains. Confirm the text and links do not overflow, scrolling works, and the close control stays visible. This is an emulated layout check, not mobile transaction QA.

To disable the path, set `REACT_APP_QA_FORCE_TRADE_LIMITS=false` or remove the line, then stop and restart `yarn start`. With the flag off, ordinary balance and allowance restrictions apply.

Do not use `yarn build` or a production deployment to enable the simulation. This path verifies injected limit-error handling only; it does not verify genuine limit behavior, transaction receipts, or delegated-wallet execution.
