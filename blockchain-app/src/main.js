import { createApp } from 'vue';
import App from './App.vue';
import { Buffer } from 'buffer';
import Web3 from 'web3';
import global from 'global';
import crypto from 'crypto-browserify';

window.Buffer = Buffer;
window.global = global;
window.crypto = crypto;

let web3;
let accounts;

async function connectWallet() {
  if (window.ethereum) {
    const provider = window.ethereum;
    await provider.enable();
    web3 = new Web3(provider);
    accounts = await web3.eth.getAccounts();
    console.log("Connected accounts:", accounts);
  } else {
    console.error("No Ethereum provider found. Install MetaMask.");
  }
}

async function getTransaction(txHash) {
  if (web3) {
    const transaction = await web3.eth.getTransaction(txHash);
    console.log("Transaction:", transaction);
    return transaction;
  } else {
    console.error("Web3 is not initialized. Connect the wallet first.");
  }
}

async function getBlock(blockNumber) {
  if (web3) {
    const block = await web3.eth.getBlock(blockNumber);
    console.log("Block:", block);
    return block;
  } else {
    console.error("Web3 is not initialized. Connect the wallet first.");
  }
}

async function analyzeTransactions() {
  if (web3 && accounts) {
    const transactions = await web3.eth.getPastLogs({
      fromBlock: 'earliest',
      address: accounts[0]
    });
    console.log("Transactions related to the wallet:", transactions);
    return transactions;
  } else {
    console.error("Web3 is not initialized or accounts are not available. Connect the wallet first.");
  }
}

connectWallet();

createApp(App).mount('#app');

// Export functions for use in other components
export { getTransaction, getBlock, analyzeTransactions };