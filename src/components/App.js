import { useState, useEffect } from "react";
import daiLogo from "../Dai_Logo.png";
import Web3 from "web3";
import MyWallet from "../abis/MyWallet.json";
import Navbar from './Navbar'

export default function App() {
  const [state, setState] = useState({
    account: "",
    myWallet: {},
    web3: {},
    balance: "",
    transactions: [],
  });

  const [addressTo, setAddressTo] = useState("");
  const [amount, setAmount] = useState(0.01);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        // Enable metamask
        await window.ethereum.enable;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert("Please install Metamask");
      }
    };

    const loadDataContracts = async () => {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      const acc = accounts[0];
      const netId = await web3.eth.getChainId();
      const abiAddress = MyWallet.networks[netId];

      // contracts

      const myWallet = new web3.eth.Contract(MyWallet.abi, abiAddress.address);

      //BalanceOf

      const bal = await myWallet.methods.balanceOf(acc).call();

      const balance = web3.utils.fromWei(bal.toString());

      const transactions = await myWallet.getPastEvents("Transfer", {
        fromBlock: 0,
        toBlock: "latest",
        filter: { from: acc },
      });

    let arrayTx = []; 

    const countTx = transactions.length-1;
    
     for(var i=countTx; i>=0 ; i--){
         console.log(i, transactions[i])
        arrayTx.push(transactions[i])
     }


      //console.log(transactions)

      setState({
        account: acc,
        myWallet,
        web3,
        balance,
        transactions: arrayTx,
      });
    };

    loadWeb3();
    loadDataContracts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state.myWallet) {
      try {
        const amountConverted = state.web3.utils.toWei(
          amount.toString(),
          "ether"
        );
        const result = await state.myWallet.methods
          .transfer(addressTo, amountConverted)
          .send({ from: state.account });

        window.alert("Success");
        window.location.reload()
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
    <Navbar />
    <div className="container py-4">
      <div className="col-md-5 col-xs-12 text-center mx-auto">
        <h2 className="card-text">Welcome to mDai Wallet</h2>
        <div className="card">
          <img
            className="card-img-top"
            height="70"
            width="30"
            src={daiLogo}
            alt=""
          />
          <div className="card-body">
            <p className="card-text">
              <i>{state.account}</i>{" "}
            </p>
            <p className="card-text">
              My Balance: <i>{state.balance}</i>
              {""}
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  placeholder="Address to"
                  type="text"
                  id="adddress"
                  onChange={(e) => {
                    setAddressTo(e.target.value);
                  }}
                  value={addressTo}
                />
              </div>
              <div className="form-group my-2">
                <input
                  className="form-control"
                  id="amount"
                  placeholder="Amount..."
                  type="number"
                  min="0.01"
                  step="0.01"
                  onChange={(e) => {
                    setAmount(e.target.value);
                  }}
                  value={amount}
                />
              </div>
              <button className="btn btn-primary">Transfer</button>
            </form>
            <div className="py-2 table-responsive">
              <table className="table">
                <thead >
                  <tr>
                    <th scope="col">Address To</th>
                    <th scope="col">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.map((tx, index) => {
                    return (
                      <tr key={index}>
                        <td style={{fontSize:'11px'}}> {tx.returnValues.to}</td>
                        <td style={{fontSize:'12px'}}>{window.web3.utils.fromWei(tx.returnValues.value.toString(),'ether')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
