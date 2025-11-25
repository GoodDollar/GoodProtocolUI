# GoodProtocolUI (gooddapp.org) Interface

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for GoodProtocol -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [gooddollar.org](https://gooddollar.org/)
- Docs: [docs.gooddollar.org/](https://docs.gooddollar.org/)
- Twitter: [@gooddollarorg](https://twitter.com/gooddollarorg?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor)
- Discord: [GoodDollar](https://discord.gg/94g9svgz)

## Accessing the GoodProtocol Interface

GoodDollar currently is not running its own frontend — making the system more decentralized and censorship-resistant.
Users thus have to use one of the frontends provided by our community, like this one for example:
https://cocky-dubinsky-430a6c.netlify.app/ 

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Yalc
For local-development and working with the @gooddollarorg library repo we use Yalc
Usages -->
  ```npm i yalc -g``` (yarn global is deprecated after v2)
  from library repository from root of the package you want to publish, not root of mono:
    1. ```yarn build```
    1. ```yalc publish``` (first time)
    2. ```yalc publish --push ``` (update send to all locally installed instances)
  from protocolUI:
    1. ```yalc link @gooddollarorg/<packageName>```

## Contributions
Everyone is welcome: Developers, designers, and entrepreneurs with a passion for decentralised technologies and a vision to build a new world that has equality, security, inclusivity, and innovation as its cornerstones.

To learn how to contribute, and the various open-source contributors opportunities, see our [contribution guidelines](https://github.com/GoodDollar/.github/blob/master/CONTRIBUTING.md)

For more information about the GoodDollar Protocol, please go to https://docs.gooddollar.org/
