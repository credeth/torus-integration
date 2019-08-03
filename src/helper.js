import Web3 from 'web3'
const contractAddress = '0x91609aD30EBa869C1F412E5656DeaD7bCaACaA5f';
const contractABI = [{"constant":true,"inputs":[{"name":"x","type":"uint256"}],"name":"log_2","outputs":[{"name":"y","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[],"name":"daoAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"DAO_CAP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_REP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"signal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_vouchee","type":"address"}],"name":"vouche","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllMembers","outputs":[{"name":"","type":"address[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_reputation","type":"uint256"}],"name":"issueReputation","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_of","type":"address"}],"name":"getReputation","outputs":[{"name":"reputation","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_rep","type":"uint256"}],"name":"daoDistribution","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"distributedByLockdrop","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"distributedByDao","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"LOCKDROP_CAP","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PER_DAY_VOUCHE_COUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_daoAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_vouchee","type":"address"},{"indexed":true,"name":"_voucher","type":"address"},{"indexed":false,"name":"_vouchedAmount","type":"uint256"}],"name":"Vouched","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_reputation","type":"uint256"}],"name":"DaoDistribution","type":"event"},{"anonymous":false,"inputs":[],"name":"Signaled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_reputation","type":"uint256"}],"name":"IssueReputation","type":"event"}];
const web3Obj = {
  web3: new Web3(),
  setweb3: function() {
    const web3Inst = new Web3(window.web3.currentProvider || 'ws://localhost:8546', null, {})
    web3Obj.web3 = web3Inst
    web3Obj.contract = new web3Obj.web3.eth.Contract(contractABI, contractAddress, {
      gasPrice: '5000000000' // default gas price in wei, 5 gwei in this case
    })
    sessionStorage.setItem('pageUsingTorus', 'true')
  },
  vouch: function(address) {
    web3Obj.contract.methods.vouche(address).send()
      .then(function(receipt) {
        console.log(receipt);
        return receipt;
      });
  },
  getReputationHistory: async function(address) {
    let data = [];
    let promises = [];
    web3Obj.contract.getPastEvents("Vouched", {
        filter: {
          _vouchee: address
        }
      })
    .then(function(events) {
      events.forEach(event => {
        let vouched = {};
        vouched["value"] = event.returnValues._vouchedAmount;
        vouched["from"] = event.returnValues._vouchee;
        vouched["to"] = event.returnValues._voucher;
        vouched["time"] = 0;
        data.push(vouched);
        promises.push(
          new Promise(
            web3Obj.web3.eth.getBlock(event.blockNumber)
          )
        )
      });
    });
    web3Obj.contract.getPastEvents("Vouched", {
      filter: {
        _voucher: address
      }
    })
    .then(function(events) {
      events.forEach(event => {
        let vouched = {};
        vouched["value"] = event.returnValues._vouchedAmount;
        vouched["from"] = event.returnValues._vouchee;
        vouched["to"] = event.returnValues._voucher;
        vouched["time"] = 0;
        data.push(vouched);
        promises.push(
          new Promise(
            web3Obj.web3.eth.getBlock(event.blockNumber)
          )
        )
      });
      Promise.all(promises)
      .then(() => {
        for(let i = 0; i < promises.length; i++) {
          data[i]["time"] = promises[i].timestamp;
        }
        data.sort(function(a, b) {
          return ((a.time > b.time) ? -1 : 1);
        });
        return data;
      })
    });
  },
  getLeaderboard: function() {
    web3Obj.contract.methods.getAllMembers().call()
    .then(function(data) {
      let list = [];
      for (let j = 0; j < data[0].length; j++)
        list.push({'address': data[0][j], 'reputation': data[1][j]});

      list.sort(function(a, b) {
        return ((a.reputation < b.reputation) ? -1 : 1);
      });
      return list;
    });
  }
}

export default web3Obj;
