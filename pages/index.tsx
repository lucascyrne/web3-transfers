import Web3 from 'web3'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'


export default function Home() {
  const web3 = new Web3(Web3.givenProvider);
  const tokenInterface = require('../abi/erc20.json');

  const [amount, setAmount] = useState<string | null>(null)
  const [tokenAddress, setTokenAddress] = useState<string | null>(null)
  const [to, setTo] = useState<string | null>(null)
  const [from, setFrom] = useState<string | null>(null)

  const toWei = (amount: string) => {
    return Web3.utils.toWei(amount, 'ether');
  }

  const transfer = async () => {
    if (amount === null || tokenAddress === null || to === null || from === null) return;
    console.log(amount, tokenAddress, to, from);

    try {
      let tokenContract = new web3.eth.Contract(
        tokenInterface,
        tokenAddress
      );

      let transaction = await tokenContract.methods
        .transfer(to, toWei(amount))
        .send({
          from: from
        });

    } catch (err) {
      console.error(err);
    }

    // * avoid re-trigger transfer without a change on amount
    setAmount(null);
  }

  useEffect(() => {
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

    (async () => {
      await web3.eth.getAccounts().then((addr: string[]) => {
        setFrom(addr[0]);
      });
    })();
  }, [])

  return (
    <>
      <main className={styles.main} style={{ fontFamily: "sans-serif" }}>
        <h2>Token Transfers on Alfajores Testnet</h2>
        <div><b>Token X:</b> 0xf4eABccF25B8dF0c7dEE29eDa4f75ff170b8016C</div>
        <div><b>Token Y:</b> 0x8E1929F7999A6497411137e84A7dE81b3ba3a446</div>
        <div><b>FROM (your current metamask wallet):</b> {from}</div>
        <div><b>TO (test wallet):</b> 0xE7AE37EEe6b95852768dB502FB3BB160De1D952a</div>
        <input type="number" placeholder="amount" onChange={(e) => setAmount(e.target.value)} />
        <input type="text" placeholder="token address" onChange={(e) => setTokenAddress(e.target.value)} />
        <input type="text" placeholder="to" onChange={(e) => setTo(e.target.value)} />
        <button onClick={() => transfer()}>TRANSFER</button>
      </main>
    </>
  )
}
