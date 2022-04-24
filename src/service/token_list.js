import { get_web3_instance } from "./degen_function";
import bnb from "../asstes/imgs/bnb-light.png";
import erc20Abi from '../abi/erc20_abi.json';

const sorter = (a, b) => {
  if(a.symbol[0] === '$') return 1;
  if(b.symbol[0] === '$') return -1;
  return a.symbol.toLowerCase() > b.symbol.toLowerCase() ? 1 : -1;
}

export const getEthTokens = async () => {
  try{
    const res = [];
    const response = await fetch('https://api.1inch.exchange/v3.0/1/tokens');
    const data = await response.json();
    for(const [key, value] of Object.entries(data.tokens)){
      res.push({ chain: 'eth', ...value, image: value.logoURI });
    };
    
    return res.sort(sorter);
  }catch(e){
    return [];
  }
};

export const getBscTokens = async () => {
  try{
    const res = [{ symbol: 'BNB', chain: 'bsc', address: '0xxxxxxxxxx', image: bnb }];
    const response = await fetch('https://tokens.pancakeswap.finance/pancakeswap-extended.json');
    const data = await response.json();
    for(const value of data.tokens){
      res.push({ chain: 'bsc', ...value, image: value.logoURI });
    };
    return res.sort(sorter);
  }catch(e){
    return [];
  }
};

export const GetEthTokenList = async() =>  {
  let Api_Response;
  try {
    const url = 'https://api.1inch.exchange/v3.0/1/tokens';
  const response = await fetch(url);
  Api_Response = response.json();
  } catch (error) {
    
  }
  // Api_Response.then(response => {
  // const response_data = response.tokens;
  // const keys = Object.keys(response_data);
  // keys.forEach(key => {
  //   data.push(
  //     {
  //       address: response_data[key].address,
  //       name: response_data[key].name,
  //       symbol: response_data[key].symbol,
  //       image: response_data[key].logoURI,
  //       decimals: response_data[key].decimals,
  //       chain: 'eth'
  //     }
  //    );
  // });
  // const bscTokens = await GetBSCTokenList();
  // return [...bscTokens, ...data];
  // });
  //console.log(Api_Response);
  return Api_Response;
}

export const ETHTokenResponse = () => {
let data = []
GetEthTokenList().then(response => {
  const response_data = response.tokens;
  const keys = Object.keys(response_data);
  keys.forEach((key) => {
    data.push(
      {
        address: response_data[key].address,
        name: response_data[key].name,
        symbol: response_data[key].symbol,
        image: response_data[key].logoURI,
        decimals: response_data[key].decimals,
        chain: 'eth',
        balance: 0
      }
     );
  });
  // const bscTokens = await GetBSCTokenList();
  // return [...bscTokens, ...data];
  //console.log(data)
  });
//   data.forEach(t => {
//   t.balance = getTokenBalance(t.address);
// });
  return data
}

export const GetBSCTokenList = async() =>  {
let Api_Response;
const url = 'https://api.1inch.exchange/v3.0/56/tokens';
const response = await fetch(url);
Api_Response = response.json();
//   Api_Response.then(response => {
//   const response_data = response.tokens;
//   const keys = Object.keys(response_data);
//   keys.forEach(key => {
//     data.push(
//       {
//         address: response_data[key].address,
//         name: response_data[key].name,
//         symbol: response_data[key].symbol,
//         image: response_data[key].logoURI,
//         decimals: response_data[key].decimals,
//         chain: 'bsc'
//       }
//      );
//   });
// });
//console.log(Api_Response);
return Api_Response;
}

export const BSCTokenResponse = () => {
let data = [];
GetBSCTokenList().then(response => {
  const response_data = response.tokens;
  const keys = Object.keys(response_data);
  keys.forEach(key => {
    data.push(
      {
        address: response_data[key].address,
        name: response_data[key].name,
        symbol: response_data[key].symbol,
        image: response_data[key].logoURI,
        decimals: response_data[key].decimals,
        chain: 'bsc',
        balance: 0

      }
     );
  });
});
//console.log(data);
// data.forEach(t => {
//   t.balance = getTokenBalance(t.address);
// });
return data
}
// console.log("hiii");



export const GetTokenListEth = async() => {
const ethTokens =  ETHTokenResponse();
// console.log(ethTokens);
// ethTokens.forEach(async(t) => {
//   t.balance = await getTokenBalance(t.address);
// });
return ethTokens

}

export const GetTokenListBsc = async() => {
const bscTokens =  BSCTokenResponse();
// bscTokens.forEach(async(t) => {
//   t.balance = await getTokenBalance(t.address);
// });
return bscTokens
}

const getTokenBalance = async(address) =>{
  let walletAddress = localStorage.getItem('account')
  if (!walletAddress) {
    return 0;
  }
  let web3 = await get_web3_instance();
  let bal = 0;
  if(address) {
    let contract = new web3.eth.Contract(erc20Abi,address);
  bal = await contract.methods.balanceOf(walletAddress).call()
}
 return bal * Math.pow(10, -18);
}
