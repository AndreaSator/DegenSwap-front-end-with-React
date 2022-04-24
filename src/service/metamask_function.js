import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

export const metamask_connection = async(account,target) => {
  let web3;
  const provider = await detectEthereumProvider();
  if(provider)
  {
    if((account == '' || account == null ) && target == 'UseEffect')
    {
        return;
    }
    else
    {
       
        // if (provider) {
        //   web3 = new Web3(provider);
        // } else {
        //   web3 = new Web3.providers.HttpProvider('http://localhost:3000');
        // }
        // web3 = new Web3(provider);
        window.ethereum.enable().then(account => {
          localStorage.setItem('account',account);
        });
        window.ethereum.on('chainChanged', (chainId) => {
          localStorage.setItem('chainId',chainId)
          window.location.reload();
        });
        window.ethereum.on('accountsChanged', async (accounts) => {
          console.log(accounts, 'accounts have changed now ________________________');
          if(accounts == '')
          {
            localStorage.removeItem('account');
          }
          else
          {
            localStorage.setItem('account',accounts);
          }
          window.location.reload();
        });

        window.ethereum.on('disconnect', async (error) => {
        });
    }
  }
  else
  {
    // alert('Please install Metamask first');
  }
     
};

export const getAccountaddress = async() => {
  return localStorage.getItem('account');
}

export const checkMetasmask =  async() => {
  let web3;
  const provider = await detectEthereumProvider();
  if(provider)
  {
    web3 = new Web3(provider);
      web3.eth.getAccounts(function(err, accounts){
        if (accounts.length == 0)
        {
          localStorage.removeItem('account');
        }
    });
  }
}
