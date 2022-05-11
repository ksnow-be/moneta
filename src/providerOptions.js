import WalletConnectProvider from "@walletconnect/web3-provider";


const providerOptions = {
    injected: {
      display: {
        name: "Маска",
        description: "С ней все стабильно"
      },
      package: null
    },
    walletconnect: {
      display: {
        name: "TrustWallet",
        description: "Не работает без https"
      },
      package: WalletConnectProvider,
      options: {
        rpc: {
          56: "https://bsc-dataseed1.binance.org"
        },
        chainId: 56,
        network: "binance"
      }
    }
  };

  export default providerOptions;