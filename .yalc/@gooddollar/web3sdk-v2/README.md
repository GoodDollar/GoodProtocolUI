# GoodUI Web3Context

A Wrapper around usedapp, providing a context for using web3. 
All of usedapp is available, plus usefull utilities for:
- multicall specific chain
- request top app for network switch
- emit TXs events

## How to use

### Web3Context
Supply `usedapp` config as usuall.
```
import { Web3Provider, Fuse } from "../contexts/Web3Context";
import { useMulticallAtChain, CallsResult } from './useMulticallAtChain'
import { Mainnet, Call } from "@usedapp/core";
...

<Web3Provider config={{ multicallVersion: 1, networks: [Fuse, Mainnet], readOnlyUrls: { 122: 'https://rpc.fuse.io' } }}>
  <YourAPP />
</Web3Provider>
```

### emit TX
Notify listeners about TX your compoent has done
Listen to TXs by other components
```
import { Web3Context, TxDetails } from "../contexts/Web3Context";

const { txEmitter } = useContext(Web3Context)

txEmitter.emit({title: 'test tx',txhash:'0x0', from:'0x1', to:'0x2'}: TxDetails)
txEmitter.on((tx:TxDetails) = > console.log(tx))
```
## Hooks

### useNetworkSwitch
If you are using GoodUI components, they need to be able to request a network switch.
You can supply that function by calling `setSwitchNetwork(() => (chainId) => Promise<Boolean | undefined>` with your function.
Your app needs to implement the logic for network switching once your funciton is being called.
your function should return false if switch did not complete or true if switch was completed.

```
import { useSwitchNetowrk } from "@gooddollar/web3context";
...
const { switchNetwork, setSwitchNetwork } = useSwitchNetowrk()
const switchit = useCallback(async (id: number) => {
        console.log("setting network:", id)
        return true
},[])
setSwitchNetwork(() => switchit) //this is required, you need to pass a function that returns your functions
```

If you are building a component, then the component can signal the enclosing app it needs network switch by calling `switchNetwork(chainId):Promise<Boolean | undefined>`
### useMultiCallAtChain
Performs multicall to a specific chain using the rpc defined for that chain in usedapp config `readOnlyUrls`

```
import { ERC20Interface } from "@usedapp/core";
import { Contract } from "ethers"
import { useMulticallAtChain, CallsResult } from './useMulticallAtChain'

...
const callMulti = useMulticallAtChain(122)
const [results, setResults] = useState<CallsResult>()
const calls: Call[] = [
  {
      contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
      method: 'balanceOf',
      args: ['0x66582D24FEaD72555adaC681Cc621caCbB208324']
  },
  {
      contract: new Contract("0x495d133B938596C9984d462F007B676bDc57eCEC", ERC20Interface),
      method: 'totalSupply',
      args: []
  }]

const results = await callMulti(calls)
```