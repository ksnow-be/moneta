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
}

export default service;