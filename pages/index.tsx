import Web3 from 'web3'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';


export default function Home() {
  const web3 = new Web3(Web3.givenProvider);
  const tokenInterface = require('../abi/erc20.json');

  const [amount, setAmount] = useState<string | null>(null)
  const [token, setToken] = useState<string>("cREAL")

  const toWei = (amount: string) => {
    return Web3.utils.toWei(amount, 'ether');
  }

  const transfer = async () => {
    if (amount === null) return;

    let tokenAddress: any;
    const utils = ethers.utils;
    const Wallet = ethers.Wallet;
    const BigNumber = ethers.BigNumber;
    const providers = ethers.providers;
    let provider = await new providers.JsonRpcProvider("https://celo-alfajores.infura.io/v3/ccdabf1a8fb04538880f3865b7120dd3");


    // todo: get user address and private key
    const from = "0x42Fe5DA4e1a08e8644AEc36Ddcc08677A7b17e1B";
    const privateKey = "1c50d7752518f63bb38ad228482697a688cc1c2a116b1744e7d6d71525d39ab8";
    // todo: change for Lovecrypto cold wallet
    const to = "0xE7AE37EEe6b95852768dB502FB3BB160De1D952a";

    if (token === "cREAL") {
      tokenAddress = "0xE4D517785D091D3c54818832dB6094bcc2744545";
    } else if (token === "cEUR") {
      tokenAddress = "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F";
    } else if (token === "cUSD") {
      tokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";
    } else {
      console.error('token address missing');
      return;
    }

    let wallet = new Wallet(privateKey);
    let walletSigner = wallet.connect(provider);

    provider.getGasPrice()
      .then((currentGasPrice) => {
        let contract = new ethers.Contract(
          tokenAddress,
          tokenInterface,
          walletSigner
        )

        let _amount = utils.parseUnits(amount, 18);

        contract.transfer(to, _amount).then((transferResult: any) => {
          console.dir(transferResult)
          alert("sent token")
        })
      })
  }

  /* useEffect(() => {
    (async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({
            method: "eth_requestAccounts"
          });
        }
      } catch (err) {
        console.error(err)
      }
    })();
  }, []) */

  return (
    <>
      <main className={styles.main} style={{ fontFamily: "sans-serif" }}>
        <h2>Token Transfers on Alfajores Testnet</h2>
        <div><b>TO (test wallet):</b> 0xE7AE37EEe6b95852768dB502FB3BB160De1D952a</div>
        <select placeholder='select token' onChange={(e) => setToken(e.target.value)}>
          <option value="cREAL">cREAL</option>
          <option value="cUSD">cUSD</option>
          <option value="cEUR">cEUR</option>
        </select>
        <input type="number" placeholder="amount" onChange={(e) => setAmount(e.target.value)} />
        {/* <input type="text" placeholder="token address" onChange={(e) => setTokenAddress(e.target.value)} /> */}
        {/* <input type="text" placeholder="to" onChange={(e) => setTo(e.target.value)} /> */}
        <button onClick={transfer}>TRANSFER</button>
      </main>
    </>
  )
}
