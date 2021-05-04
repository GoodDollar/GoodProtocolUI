export function compactAddress (address) {
  return address.substr(0, 6) + '…' + address.substr(-4)
}
