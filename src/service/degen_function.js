import Web3 from 'web3';
import { API_URL, CHAINS, degen_contract_address, degen_contract_address1, TEST_WBNB, TEST_WETH, PANCAKE_FACTORY, SUSHISWAP_FACTORY, UNISWAP_FACTORY, ETH_USDT, BNB_USDT, ETH_BASES, BSC_BASES } from '../common/constant';
import factoryAbi from '../abi/factory.json';
import { GetTokenListEth } from "../service/token_list";
import { bigAdd, bnbConnectionUrl, ethConnectionUrl, toBig } from '../common/functions';
import fromExponential from 'from-exponential';
import math from 'mathjs';
import detectEthereumProvider from '@metamask/detect-provider';
const degen_abi = require('../abi/degen_abi.json');
const erc20_abi = require('../abi/erc20_abi.json');
const eth_abi = require('../abi/degen_abi.json');
const bsc_abi = require('../abi/bsc_abi.json');

let api_data;
const degen_contract_address_BSC = degen_contract_address;
const degen_contract_address_ETH = degen_contract_address1;

GetTokenListEth().then(value => {
    api_data = value;
});

export const getDecimal = async token => {
    try{
        const web3 = await get_web3_instance();
        const web3Instance = web3.eth;
        const instance = new web3Instance.Contract(erc20_abi, token);
        const decimals = await instance.methods.decimals().call();
        return decimals;
    }catch(e){
        return 18;
    }
};

export const getDefaultChain = async () => {
      
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (
      chainId == CHAINS.Ropsten ||
      chainId == CHAINS.Mainnet
    ) {
      return 'eth';
    } else if (
      chainId == CHAINS.BSCTESTNET ||
      chainId == CHAINS.BSCMAINNET
    ) {
      return 'bsc';
    }else return 'eth';
};

export const fillUpto = (bin, len) => {
    while(bin.length < len){
      bin = '0' + bin;
    };
    return bin;
}


export const get_Degen_Price = async() => {
    const contractInstance = await get_contract_instance();
    let degenPrice = 0;
    try {
        if(contractInstance)
        {
            await contractInstance.methods.degenPrice().call().then((dp) => {
                degenPrice = dp;  
            }); 
        }
    } catch (error) {}
    return degenPrice;
}

export const uptoTwo = (num, decimal = 2) => {
    try {
        return Math.trunc(num * 100) / 100;
    } catch (error) {
        return +num.toFixed(decimal);
    }
}

export const findStringFromBin = (bin = '000') => {
    const arr = [];
    if(bin[0] === '0') arr.push('1Inch');
    if(bin[1] === '0') arr.push('Sushiswap');
    if(bin[2] === '0') arr.push('Uniswap');
    return arr;
};

export const stringFlipAt = (arr = [], el = 0) => {
    // //
    const copy = arr.slice();
    const ind = copy.indexOf(el);
    if(ind === -1) copy.push(el)
    else copy.splice(ind, 1);
    return copy;
};


export const get_web3_instance = async() => {
    const provider = await detectEthereumProvider();
    if(provider)
    {
    return new Web3(provider);
    }

}

export const get_contract_instance = async() => {
    let address = localStorage.getItem('account')
    const provider = await detectEthereumProvider();
    if(provider && address)
    {
        const web3Instance = await get_web3_instance();
        return new web3Instance.eth.Contract(degen_abi, degen_contract_address);
    }else{
        return null;
    }
}

export const sendTransaction = async(address,value,status,gasPrice, fromChain, toChain, minVal, orderType, tokenSymbol,tokenPairImg, dexData, quotePrice, onSuccess = () => {}, inchTxnData) => {

    console.log(window?.lisenceData?.bsc);
    const base = tokenPairImg.baseImg || '';
    const quote = tokenPairImg.quoteImg || '';
    let txnHash,web3,contractInstance,newNumber,fromName,CurrentgasPrice;
    const provider = await detectEthereumProvider();
    if(provider)
    {

        const contractDetails= await getContractAdd(fromChain, toChain);
        // let provider = getProvider(fromChain, toChain);
        let fnData;

        web3 = new Web3(provider)//new Web3(provider);
        contractInstance = new web3.eth.Contract(contractDetails.abi, contractDetails.contract);
        
        const fromDecimals = await getDecimal(address[0]);
        const toDecimals = await getDecimal(address[address.length-1]);
        
        let enteredValue = fromExponential((value) * Math.pow(10,fromDecimals));
        newNumber = web3.utils.toBN(fromExponential((value) * Math.pow(10,fromDecimals)));
        
        let minValue = web3.utils.toBN(fromExponential(Math.ceil((minVal) * Math.pow(10, toDecimals)))); // need to be change
        
        const balance = fromChain != 'eth' ? '0x0' : newNumber;
        const WeiNumber = web3.utils.toWei(value, 'ether');
        let userAddress = localStorage.getItem('account');

        await web3.eth.getGasPrice()
        .then((res) => {
            
            CurrentgasPrice = parseInt(res * 1.1);
        })
        .catch((err) => {
        })

        const proFees = await getProcessingFees(fromChain, toChain);
        let fees = 0, combinedFees = proFees;
        
        const feesObject = await getFees(fromChain, address[0], newNumber, (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000');
        if(feesObject?.status === 'true'){
            fees += feesObject.companyFee + feesObject.licenseFee;
            fees /= 10;
            combinedFees += fees;
        };
        console.log(fees);

        if(address[0] == TEST_WETH || address[0] == TEST_WBNB){
            combinedFees =  fromExponential(bigAdd(combinedFees, enteredValue));
        }

        combinedFees = web3.utils.toBN(Math.ceil(combinedFees));
        
        fees = web3.utils.toBN(parseInt(fees));
       
        console.log(combinedFees.toString());
        if(!inchTxnData || true){
            fnData = await getDataForSendTransaction(contractInstance,status,address,newNumber, fromChain, toChain,minValue, orderType, dexData, fees);
        }else{
            // const ot = orderType.orderType;
            // const cot = orderType.crossOrderType;
            // const licenseVault = (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000';
            // if(fromChain !== 'bsc'){
            //     if(toChain !== 'bsc') fnData = await contractInstance.methods.executeSwap1Inch(address, ot, newNumber, fees, licenseVault, inchTxnData.to, inchTxnData.data).encodeABI();
            //     else fnData = await contractInstance.methods.executeCrossExchange1Inch().encodeABI(address, cot, newNumber, fees, licenseVault, inchTxnData.to, inchTxnData.data, dexData[2], 0).encodeABI();
            // }
            // else if(toChain !== 'bsc') fnData = await contractInstance.methods.executeCrossExchange1Inch(address, cot, newNumber, fees, licenseVault, inchTxnData.to, inchTxnData.data, 20, 0).encodeABI();
        }
        var block = await web3.eth.getBlock("latest");
        var gasLimit = (parseInt(block.gasLimit/block.transactions.length)+20000).toString();
        let gasLimit2 = await getEstimatedGas(contractInstance,status,address,newNumber, fromChain, toChain,minValue, orderType, dexData, fees);
        console.log(gasLimit2,'gas Limit before 30000');
        gasLimit2 = (parseInt(gasLimit2) + 30000).toString();
        console.log(gasLimit2,'gas Limit after 30000');
       await web3.eth.sendTransaction({
          from: userAddress,
          to: contractDetails.contract,
          gas: gasLimit2, //0x64190,
          gasPrice: gasPrice != '0' ? gasPrice*Math.pow(10,9) : web3.utils.toBN(parseInt(CurrentgasPrice)),
          value : web3.utils.toHex(combinedFees),
          data: fnData
        })
          .then(async (res) => {
              saveTrxInDB(res,value, tokenSymbol,fromChain,base);
              if(fromChain === toChain) saveRecievingTrxInDB(res, quotePrice, (tokenSymbol || '/'), toChain, quote);
            txnHash=res['transactionHash'];
            saveRewardTrx(res,fromChain);
            setTimeout(onSuccess, 3000);
        })
          .catch(err => {
          console.log(err);
          
        }); 
          return txnHash;
    }

    }

    

    export const approveToken = async(address,value,gasPrice, fromChain, toChain) => {

        const contractDetails= await getContractAdd(fromChain, toChain);
        let web3,contractInstance,new_value,response,CurrentgasPrice,gasLimit;
    const provider = await detectEthereumProvider();

        web3 = new Web3(provider);
        contractInstance = new web3.eth.Contract(erc20_abi, address[0]);
        const decimals = await getDecimal(address[0]);
        new_value = web3.utils.toBN(fromExponential((value)*Math.pow(10,decimals)));
    
        let userAddress = localStorage.getItem('account');
        gasLimit = await contractInstance.methods.approve(contractDetails.contract,new_value).estimateGas({from: userAddress});
    
        await web3.eth.getGasPrice()
            .then((res) => {
                CurrentgasPrice = res;
            })
            const ss = gasPrice != '0' ? gasPrice*Math.pow(10,9) : CurrentgasPrice;
            //const gasLimit = await contractInstance.methods.approve(contractDetails.contract,new_value).estimateGas({from: userAddress});
            await web3.eth.sendTransaction({
            from: userAddress,
            to: address[0],
            gas: (gasLimit+20000).toString(),
            gasPrice: gasPrice != '0' ? gasPrice*Math.pow(10,9) : CurrentgasPrice,
            data: contractInstance.methods.approve(contractDetails.contract,new_value).encodeABI()
            })
            .then((res) => {
                response = res;
            })
            .catch(err => {
                response = err;
            });
            return response;
    }
    

export const getProvider = (fromChain, toChain) =>{
    let provider ;
    if (fromChain == 'eth' && toChain == 'eth') {
        provider = 'https://ropsten.infura.io/v3/e3706a59ed38418095f619d56df648e0';
    } else if (fromChain == 'eth' && toChain == 'bsc') {
        provider = 'https://ropsten.infura.io/v3/e3706a59ed38418095f619d56df648e0';
    } else if (fromChain == 'bsc' && toChain == 'bsc') {
        provider = 'https://data-seed-prebsc-2-s3.binance.org:8545/';
    } else if (fromChain == 'bsc' && toChain == 'eth') {
        provider = 'https://data-seed-prebsc-2-s3.binance.org:8545/';
    }
    return provider;
};

export const getPrices = async () => {
    try{
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin&vs_currencies=usd');
        const data = await response.json();
        return data;
    }catch(e){
        return {};
    }
}

export const getFees = async (from, toToken, amount, lisenceVault) => {
    let url = '';
    if(from === 'eth'){
        url = `${API_URL}api/DEGEN/calculateETHFee?licenseeVault=${lisenceVault}&token=${toToken}&amount=${amount}`; 
    }else{
        url = `${API_URL}api/DEGEN/calculateBSCFee?licenseeVault=${lisenceVault}&token=${toToken}&amount=${amount}`; 
    };
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }catch(e){
        return { status: false };
    };
};

export const getProcessingFees = async (from, to) => {
    try{
        let web3;
        if(to === 'eth'){
            web3 = new Web3(new Web3.providers.HttpProvider(ethConnectionUrl));
        }else{
            web3 = new Web3(new Web3.providers.HttpProvider(bnbConnectionUrl));
        }
        // const web3 = new Web3(window.web3.currentProvider);
        const gas = await web3.eth.getGasPrice();
        let converted = await web3.utils.toBN(parseInt(gas));
        converted *= 300000;
        const prices = await getPrices();   
        const ethPrice = prices?.ethereum?.usd || 1;
        const bscPrice = prices?.binancecoin?.usd || 1;
        console.log({
            gas, converted: converted.toString(), ethPrice, bscPrice
        })
        if(from === 'eth' && to === 'bsc'){
            return converted * (bscPrice / ethPrice);
        }else if(from === 'bsc' && to === 'eth'){
            return converted * (ethPrice / bscPrice)
        }else return 0;
    }catch(e){
        return 0;
    }
};

export const getDataForSendTransaction = async (contractInstance,status,address,newNumber, fromChain, toChain,minValue, orderType, [dexId, distribution, dexIdDestination], fees) => {
    let data;
    const price = [0, minValue, minValue];
    const ot = orderType.orderType;
    const cot = orderType.crossOrderType;
    const licenseVault = (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000';
    
    console.log({ newNumber: newNumber.toString() });
    const deadline = 0
    let assetsAmount;
    if (fromChain == 'eth' && toChain == 'eth') {
    
        
            data = contractInstance.methods.executeSwap( ot,address,newNumber, fees, minValue, licenseVault, dexId , deadline).encodeABI();

    } else if (fromChain == 'eth' && toChain == 'bsc') {
        data = contractInstance.methods.executeCrossExchange(address,ot,cot, newNumber, fees,  minValue, licenseVault, [dexId, dexIdDestination, deadline]).encodeABI();
    } else if (fromChain == 'bsc' && toChain == 'bsc') {
        data = contractInstance.methods.executeSwap( ot, address,newNumber, fees, minValue, licenseVault, dexId , deadline).encodeABI();
    } else if (fromChain == 'bsc' && toChain == 'eth') {
        data = contractInstance.methods.executeCrossExchange( address, ot, cot, newNumber, fees, minValue, licenseVault, [dexId, dexIdDestination, deadline]).encodeABI();
    }
    return data;

}


export const getContractAdd = async (fromChain, toChain) =>{
    let contractDetails={
        contract:'',
        abi: null
    } ;
    if (fromChain == 'eth') {
        contractDetails.contract = degen_contract_address_ETH;
        contractDetails.abi = eth_abi;
    }  else if (fromChain == 'bsc' ) {
        contractDetails.contract = degen_contract_address_BSC;
        contractDetails.abi = bsc_abi;
    }
    return contractDetails;
} 



export const updateLiquidityList = async(binary, stopLoad = p => {}) => {
    try {
        let web3,contractInstance,response,CurrentgasPrice;
        const provider = await detectEthereumProvider();
        web3 = new Web3(provider);
        contractInstance = new web3.eth.Contract(eth_abi, degen_contract_address1);
    
        let userAddress = localStorage.getItem('account');
    
        await web3.eth.getGasPrice()
            .then((res) => {
                CurrentgasPrice = res;
            })
        await web3.eth.sendTransaction({
            from: userAddress,
            to: degen_contract_address1,
            gas: 0x64190,
            gasPrice: CurrentgasPrice,
            value:'0x0',
            data: contractInstance.methods.setDisabledDEX(binary).encodeABI()
            })
            .then((res) => {
                response = res;
                // window.location.reload();
            })
            // .catch(err => {
            //     alert(err.message);
            // });
            stopLoad('Transaction successfully confirmed!!');
            return response;
    } catch (error) {
        stopLoad(error.message);
        return '000';
    }
}

const saveTrxInDB = async(data, amount,tokenSymbol,chain,tokenPairImg) =>{
    console.log('save transaction called');
    const url = `${API_URL}api/DEGEN/insertTrx?token=${tokenSymbol}&amount=${amount}&walletAddress=${data.from}&trxHash=${data.transactionHash}&status=${data.status ? 'Success': 'pending'}&timestamp=${new Date().toISOString()}&chain=${chain}&token_image=${tokenPairImg}&crosschaintrx=${data.transactionHash}`
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    const Api_Response = await response.json();
}

const saveRecievingTrxInDB = async(data, amount,tokenSymbol,chain,tokenPairImg) =>{
    console.log('save receiving transaction called');
    const url = `${API_URL}api/DEGEN/insertRecievingTrx?token=${tokenSymbol}&amount=${amount}&walletAddress=${data.from}&trxHash=${data.transactionHash}&status=${data.status ? 'Success': 'pending'}&timestamp=${new Date().toISOString()}&chain=${chain}&token_image=${tokenPairImg}&crosschaintrx=${data.transactionHash}`
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    const Api_Response = await response.json();
}

const saveRewardTrx =  async(data,chain) => {
    console.log('save rewars transaction called');
    const url = `${API_URL}api/DEGEN/insertRewardTrx?walletAddress=${data.from}&trxHash=${data.transactionHash}&status=${data.status ? 'Success': 'pending'}&timestamp=${new Date().toISOString()}&chain=${chain}&crosschaintrx=${data.transactionHash}`
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    const Api_Response = await response.json();
}

export const getEstimatedGas = async (contractInstance,status,address,newNumber, fromChain, toChain,minValue, orderType, [dexId, distribution, dexIdDestination], fees) => {
    let gas;
    let userAddress = localStorage.getItem('account');
    const price = [0, minValue, minValue];
    const ot = orderType.orderType;
    const cot = orderType.crossOrderType;
    const licenseVault = (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000'
    minValue = '1';
    const deadline = 0
    let assetsAmount;
    const gasObject = { from: userAddress };
    if(fees.toString() === '0'){
        if([TEST_WBNB, TEST_WETH].includes(address[0])) gasObject.value = newNumber;
    }else{
        if([TEST_WBNB, TEST_WETH].includes(address[0])) gasObject.value =await toBig(fromExponential(+(newNumber.toString()) + +(fees.toString())));
        else gasObject.value = fees;
    }
    if (fromChain == 'eth' && toChain == 'eth') {
        try{
            gas = (await contractInstance.methods.executeSwap( ot,address,newNumber, fees, minValue, licenseVault, dexId , deadline).estimateGas(gasObject));
        }catch(e) { gas = 0; };
    } else if (fromChain == 'eth' && toChain == 'bsc') {
        try{
            gas = await (contractInstance.methods.executeCrossExchange(address,ot,cot, newNumber, fees,  minValue, licenseVault, [dexId, dexIdDestination, deadline]).estimateGas(gasObject));
        }catch(e) {
            console.log('the error is __________', e);
            gas = 0; 
        };
    } else if (fromChain == 'bsc' && toChain == 'bsc') {
        try{
            gas = await (contractInstance.methods.executeSwap( ot, address,newNumber, fees, minValue, licenseVault, dexId , deadline).estimateGas(gasObject));
        }catch(e) { 
            console.log('the error is ______', e);
            gas = 0; 
        };
    } else if (fromChain == 'bsc' && toChain == 'eth') {
        try{
            gas = await (contractInstance.methods.executeCrossExchange( address, ot, cot, newNumber, fees, minValue, licenseVault, [dexId, dexIdDestination, deadline]).estimateGas(gasObject));
        }catch(e){ gas = 0; };
    }
    return gas;

}

export const checkLiquidity = async ({
    fromToken, fromChain
}) => {
    const web3 = await get_web3_instance();
    try{
        const userwalletaddresss = localStorage.getItem('account');
        if(fromChain === 'eth'){
            let factoriesUni = new web3.eth.Contract(factoryAbi, UNISWAP_FACTORY);
            const pairaddressUni = await factoriesUni.methods.getPair(fromToken, ETH_USDT).call({ from: userwalletaddresss });

            let factoriesSushi = new web3.eth.Contract(factoryAbi, SUSHISWAP_FACTORY);
            const pairaddressSushi = await factoriesSushi.methods.getPair(fromToken, ETH_USDT).call({ from: userwalletaddresss });

            return pairaddressUni !== '0x0000000000000000000000000000000000000000' || pairaddressSushi !== '0x0000000000000000000000000000000000000000';
        }else{
            let factories = new web3.eth.Contract(factoryAbi, PANCAKE_FACTORY);
            const pairaddress = await factories.methods.getPair(fromToken, BNB_USDT).call({ from: userwalletaddresss });
            return pairaddress !== '0x0000000000000000000000000000000000000000';
        };
    }catch(e){
        return false;
    };
};


export const chooseBase = chain => chain === 'bsc' ? BSC_BASES : ETH_BASES;
