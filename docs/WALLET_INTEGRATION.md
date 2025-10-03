# Wallet Integration with Reown AppKit

## Overview

This document describes the wallet integration implementation using Reown AppKit, replacing the legacy Web3 React hooks.

## Architecture

### Core Components

1. **useConnectionInfo Hook**: Centralized hook that provides wallet connection state
2. **WalletErrorBoundary**: Error boundary for wallet-related errors
3. **Wallet Configuration**: Centralized configuration for supported chains and wallets

### Supported Wallets

#### WalletConnect
- **GoodWallet**: Primary wallet for GoodDollar ecosystem
- **Valora**: Celo ecosystem wallet

#### Social Login
- **Google**: Social authentication

#### Injected Wallets
- **MetaMask**: Browser extension wallet
- **MiniPay**: Opera browser wallet

### Supported Networks

- **Celo (42220)**: Primary network (default)
- **Fuse (122)**: Secondary network
- **Ethereum (1)**: Mainnet support

## Implementation Details

### useConnectionInfo Hook

```typescript
interface ConnectionInfo {
    address?: string
    chainId: number
    walletInfo?: WalletInfo
    isConnected: boolean
    isSupportedChain: boolean
    connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
}
```

### Error Handling

The `WalletErrorBoundary` component catches and handles wallet-related errors gracefully, providing user-friendly error messages and recovery options.

### Security Features

1. **Chain Validation**: Only supported chains are allowed
2. **Connection Timeout**: 30-second timeout for wallet connections
3. **Error Logging**: Comprehensive error logging for debugging

## Testing

### Manual Testing Checklist

#### MiniPay
- [ ] Connect wallet
- [ ] Sign transactions
- [ ] Switch networks
- [ ] Disconnect wallet

#### GoodWallet (WalletConnect)
- [ ] Deep link from mobile
- [ ] QR code on desktop
- [ ] Transaction signing
- [ ] Network switching

#### Valora
- [ ] Connect via WalletConnect
- [ ] Transaction signing
- [ ] Network switching

#### MetaMask
- [ ] Connect via injected provider
- [ ] Switch to Celo network
- [ ] Transaction signing
- [ ] Explorer link navigation

### Automated Testing

Run the test suite:

```bash
yarn test useConnectionInfo
```

## Migration Guide

### Replacing Legacy Hooks

**Before:**
```typescript
import { useActiveWeb3React } from '@web3-react/core'
import { useActiveOnboard } from '@web3-onboard/react'

const { account, chainId } = useActiveWeb3React()
const { wallet } = useActiveOnboard()
```

**After:**
```typescript
import { useConnectionInfo } from 'hooks/useConnectionInfo'

const { address, chainId, walletInfo, isConnected } = useConnectionInfo()
```

### Error Handling

**Before:**
```typescript
// Manual error handling
if (!account) {
    // Handle disconnected state
}
```

**After:**
```typescript
// Automatic error handling with status
if (connectionStatus === 'error') {
    // Error boundary handles this
}
```

## Troubleshooting

### Common Issues

1. **WalletConnect not loading on localhost**
   - Ensure `projectId` is set in environment variables
   - Add localhost to allowed origins in WalletConnect project settings

2. **Unsupported chain errors**
   - Check if chain ID is in `SUPPORTED_CHAINS` array
   - Verify network configuration

3. **Connection timeout**
   - Check network connectivity
   - Verify wallet is properly installed
   - Check for browser popup blockers

### Debug Mode

Enable debug logging by setting:
```typescript
localStorage.setItem('wallet-debug', 'true')
```

## Performance Considerations

1. **Memoization**: `useConnectionInfo` uses `useMemo` to prevent unnecessary re-renders
2. **Error Boundaries**: Isolate wallet errors to prevent app crashes
3. **Connection Pooling**: Reuse connections where possible

## Security Best Practices

1. **Always validate chain IDs** before processing transactions
2. **Use error boundaries** to handle connection failures gracefully
3. **Log errors** for debugging without exposing sensitive information
4. **Implement connection timeouts** to prevent hanging connections
5. **Validate wallet authenticity** before processing sensitive operations

## Future Enhancements

1. **Multi-wallet support**: Allow users to connect multiple wallets
2. **Wallet analytics**: Track wallet usage patterns
3. **Enhanced error recovery**: Automatic retry mechanisms
4. **Connection persistence**: Remember wallet preferences across sessions
