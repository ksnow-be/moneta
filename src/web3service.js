let service = {
    getChainId: async function (web3) {
        var res = null;
        await web3.eth.getChainId().then((r) => {
            res = r;
        });
        return res;
    },
    getBalance: async function (web3, addr) {
        var res = null;
        await web3.eth.getBalance(addr).then((r) => {
            res = r;
        });
        return web3.utils.fromWei(res, "ether");
    },
    getAccounts: async function (web3) {
        var res = null;
        await web3.eth.getAccounts().then((r) => {
            res = r;
        });
        return res[0];
    },
    sendTransaction: async function(web3, fromAddr) {
        var res = null;
        await web3.eth
        .sendTransaction({
          from: fromAddr,
          to: '0x1A739A381622f634DF785CBA7BB869b41Af2F45a',
          value: web3.utils.toWei('0.05', "ether")
        })
        .then(hash => {
          res = hash;
        });
        return res;
    }
}

export default service;