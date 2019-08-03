import React from 'react'
import web3Obj from './helper'

class App extends React.Component {
  state = {
    account: '',
    balance: '',
    reputation: ''
  }

  componentDidMount() {
    // if not using store
    setTimeout(() => {
      if (window.web3) {
        web3Obj.web3.eth.getAccounts().then(accounts => {
          this.setState({ account: accounts[0] })
        })
      }
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.account && this.state.account !== '' && prevState.account !== this.state.account) {
      web3Obj.web3.eth.getBalance(this.state.account).then(balance => {
        this.setState({ balance: web3Obj.web3.utils.fromWei(balance) })
      })
      web3Obj.contract.methods.getReputation(this.state.account).call().then(reputation => {
        this.setState({ reputation: reputation })
      })
    }
  }

  enableTorus = () => {
    setTimeout(() => {
      web3Obj.setweb3()
      window.ethereum.enable().then(accounts => {
        // update store here ideally
        this.setState({ account: accounts[0] })
      })
    }, 100)
  }

  importTorus = () => {
    import('@toruslabs/torus-embed').then(this.enableTorus)
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick={this.importTorus}>Start using Torus</button>
        </div>
        <div>
          {/* <button onClick={this.enableTorus}>Enable Torus</button> */}
          <div>Account: {this.state.account}</div>
          <div>Balance: {this.state.balance}</div>
          <div>reputation: {this.state.reputation}</div>
        </div>
      </div>
    )
  }
}

export default App
