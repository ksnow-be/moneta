<template>
  <div class="mainDiv">
    <img alt="BNB icon" :src="BNBlogo" height="150" />
    <div>
      <h3>{{ introMess }}</h3>
      <div v-if="currAddr">
        <table class="container">
          <thead>
            <tr>
              <th>Адрес</th>
              <th>Баланс (BNB)</th>
              <th>Цепь</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ currAddrMini }}</td>
              <td>{{ balance }}</td>
              <td>{{ chainId }}</td>
            </tr>
          </tbody>
        </table>

        <button v-if="!transactionHash" class="button-1" id="sendButton" @click="sendTransaction">отправить 0.05 BNB Саньку</button>

        <h4 v-if="transactionHash" style="color:#fb667a">Транзакция прошла</h4>
        <h5 v-if="transactionHash" style="color:#fb667a">{{ transactionHash }}</h5>

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
      <button v-if="!currAddr" class="button-1" @click="connectWallet">Авторизация</button>
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
      //после перевода хэш
      transactionHash: null,
      // модальное окно
      isLoading: false,
      fullPage: true,
      // вступительное сообщение
      introMess: "",
      // иконка
      BNBlogo: require("@/assets/binance-coin-bnb.png")
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
      this.currAddrMini =
        this.currAddr.slice(0, 4) +
        "..." +
        this.currAddr.slice(this.currAddr.length - 5, this.currAddr.length);
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
      this.isLoading = true;
      var transactionHashResponse = await service.sendTransaction(web3, this.currAddr);
      this.transactionHash = transactionHashResponse.transactionHash;
      this.isLoading = false;
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
.button-1 {
  background-color: #ea4c89;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin: 0;
  outline: none;
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-1:hover,
.button-1:focus {
  background-color: #f082ac;
}

.container th h1 {
  font-weight: bold;
  font-size: 1em;
  text-align: left;
  color: #185875;
}

.container td {
  font-weight: normal;
  font-size: 1em;
  -webkit-box-shadow: 0 2px 2px -2px #0e1119;
  -moz-box-shadow: 0 2px 2px -2px #0e1119;
  box-shadow: 0 2px 2px -2px #0e1119;
}

.container {
  text-align: left;
  overflow: hidden;
  width: 40%;
  margin: 0 auto;
  display: table;
}

.container td,
.container th {
  padding-bottom: 2%;
  padding-top: 2%;
  padding-left: 2%;
  color: #185875;
}

/* Background-color of the odd rows */
.container tr:nth-child(odd) {
  background-color: #323c50;
}

/* Background-color of the even rows */
.container tr:nth-child(even) {
  background-color: #2c3446;
}

.container th {
  background-color: #1f2739;
}

.container td {
  color: #fb667a;
}


#sendButton{
  background-color: #fb667a;
  margin-top: 10px;
}
</style>