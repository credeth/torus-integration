import Web3 from 'web3'
const contractAddress = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe';
const contractABI = [];
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
    web3Obj.contract.methods.vouch(address).send()
      .then(function(receipt) {
        console.log(receipt);
        return receipt;
      });
  },
  getReputationHistory: async function(address) {
    web3Obj.contract.getPastEvents("Vouched", {
        filter: {
          _vouchee: address
        }
      })
    .then(function(events) {
      let data = [];
      let promises = [];
      events.forEach(event => {
        let vouched = {};
        vouched["value"] = event.returnValues._vouchedAmount;
        promises.push(
          new Promise(
            web3Obj.web3.eth.getBlock(event.blockNumber)
            .then(function(block) {
              vouched["time"] = block.timestamp;
              data.push(vouched);
            })
          )
        )
      });
      Promise.all(promises)
      .then(() => {
        return data;
      })
    });
  },
  getLeaderboard: function() {
    web3Obj.contract.methods.getAllReputations().call()
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
