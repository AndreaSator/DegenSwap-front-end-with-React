// import Web3 from 'web3';
// import detectEthereumProvider from '@metamask/detect-provider';

// export const metamaskConnection = async (account, target) => {
//     let web3;
//     const provider = await detectEthereumProvider();
//     if(provider){
//         if(!account && target === 'UseEffect') return;
//         else {
//             if(window.web3) web3 = new Web3(window.web3.currentProvider);
//             else 
//         }
//     }
// };

// async connectWallet(param = '') {
//     // this.disconnectAllWallet('init', param);
//     ///////////////new code ////////////
//   // console.log([MYLChains[environment.network]],environment.bscRpc,environment.walletConnectChainId)
//     this.provider = new WalletConnectProvider({
//       rpc: {
//         // 56 : 'https://data-seed-prebsc-1-s1.binance.org:8545/',
//         [MYLChains[environment.network]] : environment.bscRpc,
//       },
//       qrcodeModalOptions: {
//         // mobileLinks: [
//         //   "metamask",
//         //   "trust",
//         // ],
//       },
//       chainId: environment.walletConnectChainId,
//     });
//     //   if(param == 'trust'){
//     //   setTimeout(() => {
//     //     document.getElementsByClassName('walletconnect-modal__header')[0].children[1]['innerText'] = 'TrustWallet';
//     //   }, 300);
//     // }
//     await this.provider.enable();
//     window.connector = this.provider
//     this.web3 = new Web3(this.provider);
//     const accounts = await this.web3.eth.getAccounts();
//     if (accounts[0]) {
//       // this.metaMaskConnected = true;
//       // this.accountAddress = accounts[0];
//       sessionStorage.setItem('account', accounts[0]);
//       sessionStorage.setItem('walletName', 'walletconnect');
//       //this.connectStatus = true;
//       if (!localStorage.getItem('walletConnected')) {
//         localStorage.setItem('walletConnected', 'success');
//         location.reload();
//       }
//     };

//     this.provider.on("disconnect", (code: number, reason: string) => {
//       console.log(code, reason);
//       sessionStorage.removeItem('account');
//       sessionStorage.removeItem('walletName');
//       if (code == 1000) {
//         // this.headerService.web3Instance.next(false);
//         // this.metaMaskConnected = false;
//         sessionStorage.removeItem('account');
//         localStorage.removeItem('walletConnected');
//         location.reload();
//         //this.connectStatus = false;
//       }
//     })

//     // this.headerService.web3Instance.next(true);
//     this.provider.on('accountsChanged', (accounts: string[]) => {
//       // this.accountAddress = accounts[0];
//       sessionStorage.setItem('account', accounts[0]);
//       localStorage.setItem('walletConnected', 'success');
//       //this.connectStatus = true;
//       location.reload();
//     });
//     // Subscribe to chainId change
//     this.provider.on("chainChanged", (chainId: number) => {
//       console.log(chainId);
//     });

//     this.provider.on('networkChanged', async (network: number) => {
//       sessionStorage.setItem('networkId', network.toString());
//       location.reload();
//       //this.connectStatus = true;
//     });

//   }