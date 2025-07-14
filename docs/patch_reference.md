# Patch References

## @sushiswap/sdk@5.0.0-canary.7

-   Adds CELO chain support.

## react-native-animatable@^1.4.0

-   `createAnimatableComponent.js` > `createAnimatableComponent.jsx`.

## @web3-onboard/core (applied from ^2.20.2)

-   Add CSS `part` pseudo-element for targeted mobile styling.

## @uniswap/widgets (applied from ^2.53.0)

-   Various UI fixes:
    -   Fix height for warning modal.
    -   Fix double hover selector in tokenlist.
    -   Fix for modal on Safari.
-   Don't enforce permit2 when using minipay

## @uniswap/widgets@npm:2.59.0

-   Fix price impact calculation crashes:
    -   Add defensive checks for NaN, Infinity, and division by zero in `usePriceImpact` function
    -   Add defensive checks for invalid price impact values in `getPriceImpactWarning` function
    -   Prevents "something went wrong" errors on high price impact trades (100%+)
    -   Shows clear warnings instead of crashes
