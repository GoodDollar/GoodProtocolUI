import { chains } from './EthChains'

export const UxEventCategory = {
  ETH_WRONG_CHAIN: 'ethWrongChain'
}

class UxEvents {

  uiApp

  setUiApp (appInstance) {
    this.uiApp = appInstance
  }

  getModalProvider () {
    return this.uiApp.$refs.uxModal
  }

  raise (eventCategory, payload) {
    switch (eventCategory) {

      case UxEventCategory.ETH_WRONG_CHAIN: {
        // compose error message
        let content = [
          'Please connect to the appropriate Ethereum network. Allowed networks:'
        ]
        // populate with allowed networks for reference
        content = content.concat(chains.reduce((list, chain) => {
          if (chain.allowed) {
            list.push('<span><b>' + chain.chainId + '</b>&nbsp;' + chain.label + '</span>')
          }
          return list
        }, []))
        // if wrong network id provided - show it too
        if (payload) {
          content.push('Trying to connect: <b class="has-text-danger">' + payload + '</b>')
        }
        // run the modal
        let options = {
          title: 'Wrong network',
          titleClass: 'has-text-danger',
          content: content.join('<br/>')
        }
        this.getModalProvider().setupModal(options).show()
        break
      }
      default:
        break
    }
  }

}

export default new UxEvents()
