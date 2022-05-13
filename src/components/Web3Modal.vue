<template>
  <div class="mainDiv">
        <img alt="BNB icon" :src=BNBlogo height="150" />
    <div>
      <h3>{{ introMess }}</h3>
      <div v-if="currAddr">
        <h3>{{ currAddrMini }}</h3>
        <h3>chain: {{ chainId }}</h3>
        <h3>balance: {{ balance }}</h3>

        <!-- <input type="text" placeholder="from" v-model="transaction.from" /> -->
        <input type="text" placeholder="to" v-model="transaction.to" />
        <!-- <input type="text" placeholder="val" v-model="transaction.val" /> -->
        <br />
        <button @click="sendTransaction">send transatcion</button>
        <br />
      </div>

      <loading
        :active="isLoading"
        :can-cancel="true"
        :on-cancel="onCancel"
        :is-full-page="fullPage"
        loader="spinner"
        blur="4px"
        :height="100"
        :width="100"
        color="#EC760E"
        background-color="#3E3E3E"
      />
      <button @click="isLoading = true">modal demo</button>

      <button @click="connectWallet">connect wallet via modal</button>
      <button @click="logChainId">log chainId</button>
      <button @click="logAccounts">accs</button>
      <br />
      <button @click="switchChain">switchChain</button>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import Web3Modal from "web3modal";
import service from "@/web3service";
import providerOptions from "@/providerOptions";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const web3Modal = new Web3Modal({
  cacheProvider: false,
  providerOptions,
  disableInjectedProvider: false,
  theme: "dark"
});

var provider = null;
var web3 = null;

export default {
  name: "Web3Modal",
  created() {
    if (typeof window.ethereum !== "undefined") {
      this.introMess = "Metamask установлен. Выбор из TrustWallet / Metamask.";
    } else {
      this.introMess = "Metamask не установлен. Только TrustWallet.";
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      currAddr: null,
      currAddrMini: null,
      chainId: null,
      balance: null,
      transaction: {
        from: "",
        to: "",
        val: ""
      },
      // модальное окно
      isLoading: false,
      fullPage: true,
      // вступительное сообщение
      introMess: "",
      // иконка
      BNBlogo: require('@/assets/binance-coin-bnb.png')
    };
  },
  methods: {
    onCancel() {
      console.log("cancel");
      this.isLoading = !this.isLoading;
    },
    connectWallet: async function() {
      provider = await web3Modal.connect();
      web3 = new Web3(provider);

      await this.switchChain();
      this.currAddr = await service.getAccounts(web3);
      this.currAddrMini = this.currAddr.slice(0,4) + '...' + this.currAddr.slice(this.currAddr.length - 5, this.currAddr.length) 
      this.chainId = await service.getChainId(web3);
      this.balance = await service.getBalance(web3, this.currAddr);

      provider.on("chainChanged", chainId => {
        console.log("chain changed", chainId);
        this.chainId = chainId;
      });
      provider.on("disconnect", error => {
        console.log(error);
      });
    },
    logChainId: async function() {
      console.log(await service.getChainId(web3));
    },
    logAccounts: async function() {
      console.log(await service.getAccounts(web3));
    },
    providerDisconnect: async function() {
      await provider.disconnect();
    },
    sendTransaction: async function() {
      await web3.eth
        .sendTransaction({
          from: this.transaction.from,
          to: this.transaction.to, //trust test eth
          value: web3.utils.toWei(this.transaction.val, "ether")
        })
        .then(hash => {
          console.log(hash);
        });
    },
    switchChain: async function() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }]
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
                    "https://data-seed-prebsc-1-s1.binance.org:8545/"
                  ] /* .›.. */,
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18
                  }
                }
              ]
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }
    }
  }
};
</script>

<style>
body {
  background-image: url("https://24wallpapers.com/app-gateway/wallpaper-uploads/wallpapers/legacyUploads/wi5237cbe2eef-1ae3-40ee-9627-87a488a3643318.jpg");
}
.mainDiv {
  margin-top: 10%;
}

h3 {
  color: honeydew;
}
</style>

