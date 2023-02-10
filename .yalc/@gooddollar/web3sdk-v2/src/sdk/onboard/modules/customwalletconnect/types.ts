export interface WcConnectOptions {
  customLabelFor: string
  bridge?: string
  qrcodeModalOptions?: {
      desktopLinks: string[]
      mobileLinks: string[]
  }
  connectFirstChainId?: boolean
}

export enum CustomLabels {
  zengo = 'ZenGo',
  gooddollar = 'GoodDollar Wallet',
}
