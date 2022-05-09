<template>
  <div>
    <h1>MODAL</h1>
    <div v-if="currAddr">
        <h3>{{ currAddr }}</h3>
        <h3>chain: {{ chainId }}</h3>
        <h3>balance: {{ balance }}</h3>

        <input type="text" placeholder="from" v-model="transaction.from">
        <input type="text" placeholder="to" v-model="transaction.to">
        <input type="text" placeholder="val" v-model="transaction.val">
        <br>
        <button @click="sendTransaction">send transatcion</button>
        <br>
    </div>
    
    <button @click="connectWallet">connect wallet via modal</button>
    <button @click="getChainId">log chainId</button>
    <button @click="getAccounts">accs</button>
    <br>
    <button @click="switchChain">switchChain</button>
  </div>
</template>

<script>
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
// import Fortmatic from 'fortmatic';

const providerOptions = {
  injected: {
    display: {
      name: "Маска",
      description: "Дай мне все бабло со свеой метамаски ",
    },
    package: null,
  },
  walletconnect: {
    display: {
      name: "TrustWallet",
      description: "Хуй знает как но дай бабки",
    },
    package: WalletConnectProvider,
    options: {
      rpc: {
        56: "https://bsc-dataseed1.binance.org",
      },
      chainId: 56,
      network: "binance",
    },
  },
};

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions,
  disableInjectedProvider: false,
});

// const provider =  web3Modal.connect();
// const web3 = new Web3(provider);
var provider = null;
var web3 = null;

export default {
  name: "Web3Modal",
  created() {},
  data() {
    return {
      currAddr: null,
      chainId: null,
      balance: null,
      transaction: {
          from: "",
          to: "",
          val: ""
      }
    };
  },
  methods: {
    connectWallet: async function () {
      provider = await web3Modal.connect();
      web3 = new Web3(provider);
      await web3.eth.getAccounts().then((r) => {
        this.currAddr = r[0];
      });
      await web3.eth.getChainId().then((r) => {
        this.chainId = r;
      });
      await web3.eth.getBalance(this.currAddr).then((r) => {
        this.balance = web3.utils.fromWei(r, "ether");
      });

      provider.on("chainChanged", (chainId) => {
        console.log("chain changed", chainId);
        this.chainId = chainId;
      });

      provider.on("disconnect", (error) => {
        console.log(error);
      });
    },
    getChainId: async function () {
      await web3.eth.getChainId().then((r) => {
        console.log(r);
      });
    },
    providerDisconnect: async function () {
      await provider.disconnect();
    },
    getAccounts: async function () {
      await web3.eth.getAccounts().then((r) => {
        console.log(r);
      });
    },
    sendTransaction: async function () {
      await web3.eth
        .sendTransaction({
          from: this.transaction.from,
          to: this.transaction.to, //trust test eth
          value: web3.utils.toWei(this.transaction.val, "ether"),
        })
        .then((hash) => {
          console.log(hash);
        });
    },
    switchChain: async function () {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x61",
                  chainName: "Smart Chain - Testnet",
                  rpcUrls: [
                    "https://data-seed-prebsc-1-s1.binance.org:8545/",
                  ] /* ... */,
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                  },
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    },
  },
};

// const providerOptions = {
//   injected: {
//     display: {
//       name: "Injected хуй",
//       description: "Connect with the provider in your Browser хуй "
//     },
//     package: null
//   },
//   // Example with WalletConnect provider
//   walletconnect: {
//     display: {
//       logo: "data:image/gif;base64,INSERT_BASE64_STRING",
//       name: "Mobile",
//       description: "Scan qrcode with your mobile wallet"
//     },
//     package: WalletConnectProvider,
//     options: {
//       infuraId: "INFURA_ID" // required
//     }
//   }
// };

//вот так рабоатет ебать
// const provider = new WalletConnectProvider({
//     rpc: {
//         56: "https://bsc-dataseed1.binance.org",
//     },
//     chainId: 56,
//     network: "binance",
//     // qrcode: true,
//     // qrcodeModalOptions: {
//     //     mobileLinks: [
//     //       "metamask",
//     //       "trust",
//     //     ]
//     // }
// });
</script>

<style>
</style>

