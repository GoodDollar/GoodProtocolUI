export const chains = [
  {
    chainId: 0x01,
    label: 'Ethereum Mainnet',
    allowed: true,
  },
  {
    chainId: 122,
    label: 'Fuse Mainnet',
    allowed: true,
  }
]

export function isAllowedChain (chainId) {
  return !!(getChainById(chainId)?.allowed)
}

export function getChainById (chainId) {
  return chains.find((i) => i.chainId === chainId)
}
