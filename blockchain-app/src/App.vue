<template>
  <div id="app">
    <h1>Aplicación Blockchain</h1>

    <div v-if="!connected">
      <button @click="connectWallet">Conectar Billetera</button>
    </div>

    <div v-else>
      <p>Dirección de la billetera: {{ walletAddress }}</p>

      <h2>Enviar Criptomonedas</h2>
      <form @submit.prevent="sendTransaction">
        <label for="toAddress">Dirección de destino:</label>
        <input type="text" v-model="toAddress" required />
        <label for="amount">Cantidad (ETH):</label>
        <input type="number" v-model="amount" required />
        <button type="submit">Enviar</button>
      </form>

      <h2>Transacciones recientes</h2>
      <ul>
        <li v-for="tx in transactions" :key="tx.hash">
          {{ tx.hash }}: {{ tx.from }} -> {{ tx.to }} ({{ tx.value }} ETH)
        </li>
      </ul>

      <div v-if="transactionStatus">
        <p>{{ transactionStatus }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';
import WalletConnect from '@walletconnect/client';
import QRCodeModal from '@walletconnect/qrcode-modal';

export default {
  name: 'App',
  data() {
    return {
      connected: false,
      provider: null,
      signer: null,
      walletAddress: null,
      toAddress: '',
      amount: 0,
      transactions: [],
      transactionStatus: ''
    };
  },
  mounted() {
    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org',
      qrcodeModal: QRCodeModal
    });

    this.connector.on('connect', async (error, payload) => {
      if (error) {
        console.error('Error connecting the wallet:', error);
        return;
      }

      const { accounts } = payload.params[0];
      console.log('Accounts:', accounts);

      this.provider = new ethers.providers.Web3Provider(this.connector.provider);
      this.signer = this.provider.getSigner();
      this.walletAddress = accounts[0];
      this.connected = true;
      console.log('Wallet connected:', this.walletAddress);
      this.updateBlockchainInfo();
    });

    this.connector.on('disconnect', (error) => {
      if (error) {
        console.error('Error disconnecting the wallet:', error);
        return;
      }

      this.provider = null;
      this.signer = null;
      this.walletAddress = null;
      this.connected = false;
      console.log('Wallet disconnected');
    });
  },
  methods: {
    connectWallet() {
      if (!this.connector.connected) {
        this.connector.createSession();
      } else {
        this.connector.killSession();
      }
    },
    async updateBlockchainInfo() {
      if (this.provider && this.walletAddress) {
        const history = await this.provider.getHistory(this.walletAddress);
        this.transactions = history.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.utils.formatEther(tx.value)
        }));
        console.log('Transactions:', this.transactions);
      }
    },
    async sendTransaction() {
      try {
        const tx = await this.signer.sendTransaction({
          to: this.toAddress,
          value: ethers.utils.parseEther(this.amount.toString())
        });
        await tx.wait();
        this.transactionStatus = 'Transacción exitosa: ' + tx.hash;
        this.updateBlockchainInfo();
      } catch (error) {
        this.transactionStatus = 'Error en la transacción: ' + error.message;
      }
    }
  }
};
</script>

<style>
/* Agrega tus estilos aquí */
</style>