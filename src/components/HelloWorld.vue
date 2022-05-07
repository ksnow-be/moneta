<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <!-- <input placeholder="введи цифру" v-model="inputNum" /> -->
    <button @click="sendTransaction">send transaction MASK</button>
    <button @click="sendTransactionTrustWallet">send transaction TRUST</button>

    <br />
    <button @click="getChainMask">getChainMask()</button>
    <button @click="getChainTrust">chainIdTRUST()</button>

    <h3 v-if="testAddr1">
      0x1A739A381622f634DF785CBA7BB869b41Af2F45a
      <span style="color:red">
        <br />
        {{ this.testAddr1 }}
      </span>
    </h3>
    <Skeletor v-else width="200" height="50" style="margin-left:40%; margin-top:2%" pill />

    <!-- <br />
    <h3 v-if="testAddr2">
      0xAafBB749F9F26a764B3d969Ff73Bb2Aa5c0762fE
      <span style="color:red"><br>{{ this.testAddr2 }}</span>
    </h3>-->
    <button>EMPTY</button>

    <button @click="connectToTrust()">conect TrustWallet</button>
       <br />
    <button>EMPTY</button>

    <button @click="diconnectTrust()">disconnect TRUST</button>
    <br />
    <button>EMPTY</button>

    <button @click="signTrust()">sign TrustWallet</button>

  </div>
</template>

<script>
import Web3 from "web3";
import { Skeletor } from "vue-skeletor";
import "vue-skeletor/dist/vue-skeletor.css";
import WalletConnectProvider from "@walletconnect/web3-provider";

const provider = new WalletConnectProvider({
    infuraId: "62f3555371db4581aba56bbe1a7b063d",

  // rpc: {
  //   97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
  // },
  // uri: "wc:8a5e5bdc-a0e4-47...TJRNmhWJmoxdFo6UDk2WlhaOyQ5N0U=",
  // // // bridge: "https://bridge.myhostedserver.com",
  // qrcodeModalOptions: {
  //   mobileLinks: ["metamask", "trust"]
  // }
});
const web4 = new Web3(provider);

provider.on("connect", async () => {
  const accounts = await web4.eth.getAccounts();
  alert(accounts);
});

provider.on("disconnect", async () => {
  alert("wallet diconnected");
});

export default {
  name: "HelloWorld",
  components: {
    Skeletor
  },
  props: {
    msg: String
  },
  created() {
    if (typeof window.ethereum !== "undefined") {
      console.log("Mask installed");
      this.web3 = new Web3(window.ethereum);
      this.setBalances();
    } else {
      console.log("Mask not installed");
    }
  },
  data() {
    return {
      web3: null,
      testAddr1: null,
      testAddr2: null
    };
  },
  methods: {
    setBalances: async function() {
      await this.web3.eth
        .getBalance("0x1A739A381622f634DF785CBA7BB869b41Af2F45a")
        .then(r => {
          this.testAddr1 = this.web3.utils.fromWei(r, "ether");
        })
        .catch(err => {
          console.log(err);
        });
      await this.web3.eth
        .getBalance("0xAafBB749F9F26a764B3d969Ff73Bb2Aa5c0762fE")
        .then(r => {
          this.testAddr2 = this.web3.utils.fromWei(r, "ether");
        });
    },
    async sendTransaction() {
      await this.web3.eth
        .sendTransaction({
          from: "0x1A739A381622f634DF785CBA7BB869b41Af2F45a",
          to: "0x0b8F6613225FDE96396249554E451F73C9cB756D",
          value: this.web3.utils.toWei("0.1", "ether")
          // value: '0x00001'
        })
        .then(hash => {
          console.log(hash);
        });
    },
    sendTransactionTrustWallet: async function() {
      console.log('fdfdf')
      await web4.eth
        .sendTransaction({
          from: "0x84Be48d6BAB2478cc4132d893eB3155328415d0a", //orig trust wallet hash
          to: "0x1A739A381622f634DF785CBA7BB869b41Af2F45a",
          value: this.web3.utils.toWei("0.1", "ether")
          // value: '0x00001'
        })
        .then(hash => {
          console.log(hash);
        });
    },
    getChainMask() {
      this.web3.eth.getChainId().then(r => {
        console.log(r);
      });
    },
    getChainTrust: async function() {
      const chain = await web4.eth.getChainId();
      console.log(chain);
    },
    connectToTrust: async function() {
      await provider.enable();
    },
    diconnectTrust: async function(){
      await provider.disconnect();
    },
    signTrust: async function() {
      await web4.eth
        .sign("0x84Be48d6BAB2478cc4132d893eB3155328415d0a", "0x84Be48d6BAB2478cc4132d893eB3155328415d0a")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style>
button {
  margin-top: 10px;
  height: 30px;
  background-color: azure;
  border: 1px solid black;
}
</style>

