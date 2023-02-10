export class UnsupportedChainId extends Error {
  constructor(chainId: number | string = 'UNKNOWN') {
    super(`Unsupported chain ${ chainId }`);
    Object.setPrototypeOf(this, UnsupportedChainId.prototype);
  }
}

export class InvalidChainId extends Error {
  constructor(expectedChainId: number | string) {
    super(`Invalid chain, expected ${ expectedChainId }`);
    Object.setPrototypeOf(this, InvalidChainId.prototype);
  }
}

export class UnsupportedToken extends Error {
  constructor(token = 'UNKNOWN') {
    super(`Unsupported token ${ token }`);
    Object.setPrototypeOf(this, UnsupportedToken.prototype);
  }
}

export class UnexpectedToken extends Error {
  constructor(token = 'UNKNOWN') {
    super(`Unexpected token ${ token }`);
    Object.setPrototypeOf(this, UnexpectedToken.prototype);
  }
}

export class InsufficientLiquidity extends Error {
  constructor() {
    super(`Insufficient liquidity for this trade`);
    Object.setPrototypeOf(this, InsufficientLiquidity.prototype);
  }
}
