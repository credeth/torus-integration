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
  }
}

export default web3Obj;
