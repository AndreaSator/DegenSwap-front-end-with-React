import Web3 from 'web3';
import { API_URL, reimbursement_contract_address_bsc, reimbursement_contract_address_eth } from '../common/constant';
import detectEthereumProvider from '@metamask/detect-provider';
import { coin_array } from "../service/dummy_data";
import { GetTokenListEth } from "../service/token_list";
import { ethers } from 'ethers';
const degen_abi = require('../abi/degen_abi.json');
const reimbursement_abi = require('../abi/reimbursement_abi.json');
const erc20_abi = require('../abi/erc20_abi.json');
const eth_abi = require('../abi/degen_abi.json');
const token_abi = require('../abi/token_abi.json');
const bsc_abi = require('../abi/bsc_abi.json');
// var BigNumber = require('big-number');
var Loader = require('react-loader');
// const BigNumber = require('bignumber.js');

let api_data;
export const reimbursement_contract_address_BSC = reimbursement_contract_address_bsc;
export const reimbursement_contract_address_ETH = reimbursement_contract_address_eth;


// License part start 

export const getVaultAddress = async (receipt) => {
    const iface = new ethers.utils.Interface(reimbursement_abi)

    if (receipt.status === 1 || receipt.status === true) {
        for (var i = 0; i < receipt.logs.length; i++) {
            if (receipt.logs[i].topics[0] === "0x897c133dfbfe1f6239e98b4ffd7e4f6c86a62350a131a7a37790419f58af02f9") {
                return iface.decodeEventLog("VaultCreated", receipt.logs[i].data, receipt.logs[i].topics).vault;
            }
        }
    }
}

export const newVault = async (newVaultData, txCb, receiptCb, errorCb) => {

    console.log(newVaultData)
    let address = newVaultData.reimbursementAddress;

    // let web3,contractInstance,new_value,response,CurrentgasPrice;
    let web3, contractInstance, CurrentgasPrice, gasPrice, response;
    const provider = await detectEthereumProvider();
    web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(reimbursement_abi, address);
    // new_value = web3.utils.toBN(parseInt((value)*Math.pow(10,18)));

    let token = newVaultData.token;                         // reimbursement token
    let isMintable = newVaultData.isMintable;               // token can be minted by this contract (`false` for Licensee)
    let period = newVaultData.period;                       // staking period in seconds (365 days)
    let reimbursementRatio = newVaultData.reimbursementRatio;   // the ratio of deposited amount to reimbursement amount (with 2 decimals). 
    let swapPair = newVaultData.swapPair;                    // uniswap compatible pair for token and native coin (ETH, BNB)
    let licenseeFee = newVaultData.licenseeFee;             // percentage of Licensee fee (with 2 decimals). I.e. 30 means 0.3%
    let projectContract = newVaultData.projectContract;

    let userAddress = localStorage.getItem('account');

    await web3.eth.getGasPrice()
        .then((res) => {
            CurrentgasPrice = res;
        })
    const ss = gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice;

    await web3.eth.sendTransaction({
        from: userAddress,
        to: address,
        gas: 0x94ED0,
        gasPrice: CurrentgasPrice,
        data: contractInstance.methods.newVault(
            token,
            isMintable,
            period,
            reimbursementRatio,
            swapPair,
            licenseeFee,
            projectContract
        ).encodeABI()
    })
        .then(async (result) => {
            // console.log(result)
            // //;
            // response = res;
            await txCb(result.hash);
            // await result.wait().then(async (receipt) => {
            receiptCb(result);
            // });
        })
        .catch(error => {
            console.log(error);
            errorCb(error);
            // alert(err.message);
            // response = err;
            // setTimeout(() => {
            //     window.location.reload()
            // }, 4000);
        });
    // return response;
}

export const depositTokens = async (transferTokenData, txCb, receiptCb, errorCb) => {
    console.log(transferTokenData)
    let to = transferTokenData.to;                         // reimbursement token
    let amount = transferTokenData.amount;
    let token_address = transferTokenData.tokenAddress;

    let userAddress = localStorage.getItem('account');
    const provider = await detectEthereumProvider();
    let web3, contractInstance, CurrentgasPrice, gasPrice, response;
    web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(token_abi, token_address);

    await web3.eth.getGasPrice()
        .then((res) => {
            CurrentgasPrice = res;
        })
    const ss = gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice;

    await web3.eth.sendTransaction({
        from: userAddress,
        to: token_address,
        gas: 0xDBBA0,
        gasPrice: CurrentgasPrice,
        data: contractInstance.methods.transfer(
            to,
            web3.utils.toWei(amount)
        ).encodeABI()
    })
        .then(async (result) => {
            await txCb(result.hash);
            receiptCb(result);
        })
        .catch(error => {
            console.log(error);
            errorCb(error);
        });

}

export const withdrawTokens = async (withdrawTokensData, txCb, receiptCb, errorCb) => {
    let vault = withdrawTokensData.vault;                         // reimbursement token
    let amount = withdrawTokensData.amount;
    let reimbursement_address = withdrawTokensData.reimbursementAddress;

    console.log(withdrawTokensData)

    let userAddress = localStorage.getItem('account');
    const provider = await detectEthereumProvider();
    let web3, contractInstance, CurrentgasPrice, gasPrice, response;
    web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(reimbursement_abi, reimbursement_address);

    await web3.eth.getGasPrice()
        .then((res) => {
            CurrentgasPrice = res;
        })
    const ss = gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice;


    await web3.eth.sendTransaction({
        from: userAddress,
        to: reimbursement_address,
        gas: 0xDBBA0,
        gasPrice: CurrentgasPrice,
        data: contractInstance.methods.withdrawTokens(
            vault,
            web3.utils.toWei(amount)
        ).encodeABI()
    })
        .then(async (result) => {
            await txCb(result.hash);
            receiptCb(result);
        })
        .catch(error => {
            console.log(error);
            errorCb(error);
        });

}

export const setLicenseeFee = async (setLicenseeFeeData, txCb, receiptCb, errorCb) => {
    let vault = setLicenseeFeeData.vault;
    let projectContract = setLicenseeFeeData.projectContract;
    let fee = setLicenseeFeeData.fee;             // percentage of Licensee fee (with 2 decimals). I.e. 30 means 0.3%
    let reimbursement_address = setLicenseeFeeData.reimbursementAddress;

    console.log(vault, projectContract, fee)

    let userAddress = localStorage.getItem('account');
    const provider = await detectEthereumProvider();

    let web3, contractInstance, CurrentgasPrice, gasPrice, response;
    web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(reimbursement_abi, reimbursement_address);

    await web3.eth.getGasPrice()
        .then((res) => {
            CurrentgasPrice = res;
        })
    const ss = gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice;


    await web3.eth.sendTransaction({
        from: userAddress,
        to: reimbursement_address,
        gas: 0xDBBA0,
        gasPrice: CurrentgasPrice,
        data: contractInstance.methods.setLicenseeFee(
            vault,
            projectContract,
            fee
        ).encodeABI()
    })
        .then(async (result) => {
            await txCb(result.hash);
            receiptCb(result);
        })
        .catch(error => {
            console.log(error);
            errorCb(error);
        });
}


// License part end





export const get_Best_Quote = async (address, amount_value, orderType, fromChain, toChain) => {
    let url = '';
    const provider = await detectEthereumProvider();
    let web3 = new Web3(provider);
    // let new_amount = web3.utils.toBN(parseFloat(amount) * Math.pow(10,18));
    //   const tempAmount = new BigNumber(amount_value * Math.pow(10,18)) ;
    //   console.log(tempAmount+ ' temp amount');
    const newTemp = web3.utils.toBN(parseInt(amount_value * Math.pow(10, 18)));
    //   console.log(newTemp);
    //   debugger;
    console.log(newTemp, ' new temp');
    //   console.log(tempAmount + 'temp amount');
    //   console.log(newTemp + 'new temp amount');
    const amount = newTemp;
    console.log(amount);
    const userWallet = localStorage.getItem('account');
    if (fromChain == 'eth' && toChain == 'bsc') {
        //   url = `${API_URL}api/DEGEN/getCrossChainIndividualExpectedValue?fromToken=${address.from}&toToken=${address.to}&amount=${amount}&orderType=${orderType}&userAddress=${userWallet}`
        url = `${API_URL}api/DEGEN/getETHCrossChainExpectedAmount?fromToken=${address.from}&toToken=${address.to}&amount=${amount}&orderType=${orderType}&userAddress=${userWallet}`
    } else if (fromChain == 'eth' && toChain == 'eth') {
        url = `${API_URL}api/DEGEN/getETHExpectedAmount?fromToken=${address.from}&toToken=${address.to}&amount=${amount}&orderType=${orderType}&userAddress=${userWallet}`
    } else if (fromChain == 'bsc' && toChain == 'eth') {
        url = `${API_URL}api/DEGEN/getBSCCrossChainExpectedAmount?fromToken=${address.from}&toToken=${address.to}&amount=${amount}&orderType=${orderType}&userAddress=${userWallet}`
    } else if (fromChain == 'bsc' && toChain == 'bsc') {
        url = `${API_URL}api/DEGEN/getBSCExpectedAmount?fromToken=${address.from}&toToken=${address.to}&amount=${amount}&orderType=${orderType}&userAddress=${userWallet}`
    } else {
        return;
    }
    const response = await fetch(url);
    const Api_Response = await response.json();
    // console.log(Api_Response);
    return Api_Response
    /*   old-code   */

    // let web3 = new Web3(window.web3.currentProvider);
    // let new_amount = web3.utils.toBN(parseFloat(amount) * Math.pow(10,18));
    // const contractInstance = get_contract_instance();
    // console.log(address,new_amount,orderType);
    // let bestQoute = 0;
    // if(contractInstance)
    // {
    //     await contractInstance.methods.getBestQuote(address,new_amount,orderType).call().then((value) => {
    //         bestQoute = value;  
    //     });
    // }
    // return bestQoute;
}

export const get_web3_instance = async() => {
    const provider = await detectEthereumProvider();
    if (provider) {
        return new Web3(provider);
    }

}

// export const get_contract_instance = () => {
//     let address = localStorage.getItem('account')
//     if (window.web3 && window.web3.currentProvider && address) {
//         const web3Instance = get_web3_instance();
//         return new web3Instance.eth.Contract(degen_abi, degen_contract_address);
//     } else {
//         return null;
//     }
// }

export const sendTransaction = async (address, value, status, gasPrice, fromChain, toChain, minVal, orderType, tokenSymbol, tokenPairImg, dexData) => {

    let txnHash, web3, contractInstance, newNumber, fromName, CurrentgasPrice;
    const provider = await detectEthereumProvider();
    if (provider) {
        const contractDetails = await getContractAdd(fromChain, toChain);
        console.log(contractDetails);
        // ;
        let provider = getProvider(fromChain, toChain);
        let fnData;

        web3 = new Web3(provider)//new Web3(provider);
        contractInstance = new web3.eth.Contract(contractDetails.abi, contractDetails.contract);
        console.log(contractInstance);
        //;
        // fromName = api_data.find(x => x.address == address[0]).name;
        // console.log('value: ',value);
        newNumber = web3.utils.toBN(parseInt((value) * Math.pow(10, 18)));
        // console.log('minVal:',minVal)
        // debugger;
        let minValue = web3.utils.toBN(parseInt(Math.ceil((minVal) * Math.pow(10, 18)))); // need to be change

        // if(this.ethBalance<this.buyForm.value.from){
        // alert('Your ETH balance is low');
        // }else{
        // alert('Please don\'t refresh, transaction is processing.');

        const balance = fromChain != 'eth' ? '0x0' : newNumber;
        const WeiNumber = web3.utils.toWei(value, 'ether');
        let userAddress = localStorage.getItem('account');

        //console.log(userAddress,degen_contract_address,balance,status,address,newNumber);
        await web3.eth.getGasPrice()
            .then((res) => {
                console.log(res)
                    ;
                CurrentgasPrice = res;
            })
            .catch((err) => {
                console.log(err);
            })

        console.log(CurrentgasPrice);
        console.log(dexData);
        //;

        const proFees = await getProcessingFees(fromChain, toChain);
        let fees = 0, combinedFees = proFees;
        console.log(combinedFees);
        const feesObject = await getFees(fromChain, address[0], newNumber, (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000');
        if (feesObject?.status === 'true') {
            fees += feesObject.companyFee + feesObject.licenseFee;
            combinedFees += fees;
        };

        console.log(fees, combinedFees);
        combinedFees = web3.utils.toBN(parseInt(combinedFees));
        fees = web3.utils.toBN(parseInt(fees));
        fnData = await getDataForSendTransaction(contractInstance, status, address, newNumber, fromChain, toChain, minValue, orderType, dexData, fees);
        await web3.eth.sendTransaction({
            from: userAddress,
            to: contractDetails.contract,
            gas: 0xF1B30, //0x64190,
            gasPrice: gasPrice != '0' ? gasPrice * Math.pow(10, 9) : web3.utils.toBN(parseInt(CurrentgasPrice)),
            // value: (+this.buyForm.value.from + 0.000001) * 1000000000000000000,
            value: web3.utils.toHex(combinedFees), //'0x3B9ACA00', //'0x3B9ACA00',//'0x0',//fromChain != 'eth' ? '0x0' : WeiNumber,
            //value: BigNumber(parseFloat(value) * Math.pow(10,18)),
            data: fnData
        })
            // this.spinner.show()
            .then((res) => {
                console.log(res, 'then');
                saveTrxInDB(res, value, tokenSymbol, fromChain, tokenPairImg);
                txnHash = res['transactionHash'];
            })
            .catch(err => {
                console.log(err, 'catch');
                // saveTrxInDB(err);

                // alert(err.message);
                // setTimeout(() => {
                //     window.location.reload()
                // }, 4000);
            });
        console.log(txnHash);
        //;
        return txnHash;
    }
    // let contractInstance = new this.web3.eth.Contract(this.tokenAbi);
    //let contractAddress = get_contract_instance();

}



export const approveToken = async (address, value, gasPrice, fromChain, toChain) => {

    const contractDetails = await getContractAdd(fromChain, toChain);
    let web3, contractInstance, new_value, response, CurrentgasPrice;
    const provider = await detectEthereumProvider();
    web3 = new Web3(provider);
    contractInstance = new web3.eth.Contract(erc20_abi, address[0]);
    new_value = web3.utils.toBN(parseInt((value) * Math.pow(10, 18)));

    let userAddress = localStorage.getItem('account');

    await web3.eth.getGasPrice()
        .then((res) => {
            CurrentgasPrice = res;
        })
    const ss = gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice;
    await web3.eth.sendTransaction({
        from: userAddress,
        to: address[0],
        gas: 0x64190,
        gasPrice: gasPrice != '0' ? gasPrice * Math.pow(10, 9) : CurrentgasPrice,
        data: contractInstance.methods.approve(contractDetails.contract, new_value).encodeABI()
    })
        .then((res) => {
            console.log(res)
            // //;
            response = res;
        })
        .catch(err => {
            // alert(err.message);
            response = err;
            // setTimeout(() => {
            //     window.location.reload()
            // }, 4000);
        });
    return response;
}


export const getProvider = (fromChain, toChain) => {
    let provider;
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
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin&vs_currencies=usd');
        const data = await response.json();
        return data;
    } catch (e) {
        return {};
    }
}

const getFees = async (from, toToken, amount, lisenceVault) => {
    let url = '';
    if (from === 'eth') {
        url = `http://52.70.198.55:5000/api/DEGEN/calculateETHFee?licenseeVault=${lisenceVault}&token=${toToken}&amount=${amount}`;
    } else {
        url = `http://52.70.198.55:5000/api/DEGEN/calculateBSCFee?licenseeVault=${lisenceVault}&token=${toToken}&amount=${amount}`;
    };
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (e) {
        return { status: false };
    };
};

export const getProcessingFees = async (from, to) => {
    try {
        const provider = await detectEthereumProvider();
        const web3 = new Web3(provider);
        const gas = await web3.eth.getGasPrice();
        let converted = await web3.utils.toBN(parseInt(gas));
        converted *= 200000;
        const prices = await getPrices();
        const ethPrice = prices?.ethereum?.usd || 1;
        const bscPrice = prices?.binancecoin?.usd || 1;

        if (from === 'eth' && to === 'bsc') {
            return converted * (bscPrice / ethPrice);
        } else if (from === 'bsc' && to === 'eth') {
            return converted * (ethPrice / bscPrice)
        } else return 0;
    } catch (e) {
        return 0;
    }
};

export const getDataForSendTransaction = async (contractInstance, status, address, newNumber, fromChain, toChain, minValue, orderType, [dexId, distribution, dexIdDestination], fees) => {
    let data;
    const price = [0, minValue, minValue];
    const ot = orderType.orderType;
    const cot = orderType.crossOrderType;
    const licenseVault = (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000'
    if (fromChain == 'eth' && toChain == 'bsc') {
        if (!dexId) {
            dexId = 1; // uniswap
        }
    }

    if (fromChain == 'bsc' && toChain == 'eth') {
        if (!dexId) {
            dexId = 0; // pancackswap
        }
    }

    // console.log('address: ', newNumber, minValue, 'dexId : ' + dexId );
    console.log('new num: ', newNumber);
    console.log('min val: ', minValue);
    //;
    const deadline = 0
    if (fromChain == 'eth' && toChain == 'eth') {
        data = contractInstance.methods.executeSwap(ot, address, newNumber, fees, minValue, licenseVault, dexId, distribution, deadline).encodeABI();
    } else if (fromChain == 'eth' && toChain == 'bsc') {
        data = contractInstance.methods.executeCrossExchange(address, ot, cot, newNumber, fees, minValue, licenseVault, [dexId, dexIdDestination, deadline], distribution).encodeABI();
        // data = contractInstance.methods.executeCrossExchange(address, ot, cot, newNumber, fees, minValue, licenseVault).encodeABI();
    } else if (fromChain == 'bsc' && toChain == 'bsc') {
        data = contractInstance.methods.executeSwap(ot, address, newNumber, fees, minValue, licenseVault, dexId, distribution, deadline).encodeABI();
    } else if (fromChain == 'bsc' && toChain == 'eth') {
        data = contractInstance.methods.executeCrossExchange(address, ot, cot, newNumber, fees, minValue, licenseVault, [dexId, dexIdDestination, deadline], distribution).encodeABI();
    }
    return data;

}

export const getDecimal = async (tokenAddress) => {
    let decimal;
    if (!tokenAddress) return decimal;
    const web3 = await get_web3_instance();
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let userwalletaddresss = accounts[0];
        let bal = new web3.eth.Contract(erc20_abi, tokenAddress);
        decimal = await bal.methods.decimals().call({ from: userwalletaddresss });
        decimal = +decimal;
    } catch (e) {
        decimal = 18;
    };
    return decimal;
}

export const getContractAdd = async (fromChain, toChain) => {
    let contractDetails = {
        contract: '',
        abi: null
    };
    if (fromChain == 'eth') {
        contractDetails.contract = reimbursement_contract_address_ETH;
        contractDetails.abi = reimbursement_abi;
    } else if (fromChain == 'bsc') {
        contractDetails.contract = reimbursement_contract_address_BSC;
        contractDetails.abi = reimbursement_abi;
    }
    return contractDetails;
}



// export const updateLiquidityList = async (binary, stopLoad = p => console.log(p)) => {
//     // console.log(binary, (+binary).toString(2));
//     try {
//         let web3, contractInstance, response, CurrentgasPrice;
//         web3 = new Web3(window.web3.currentProvider);
//         contractInstance = new web3.eth.Contract(eth_abi, degen_contract_address1);

//         let userAddress = localStorage.getItem('account');

//         await web3.eth.getGasPrice()
//             .then((res) => {
//                 CurrentgasPrice = res;
//             })
//         await web3.eth.sendTransaction({
//             from: userAddress,
//             to: degen_contract_address1,
//             gas: 0x64190,
//             gasPrice: CurrentgasPrice,
//             value: '0x0',
//             data: contractInstance.methods.setDisabledDEX(binary).encodeABI()
//         })
//             .then((res) => {
//                 response = res;
//                 // window.location.reload();
//             })
//         // .catch(err => {
//         //     alert(err.message);
//         // });
//         stopLoad('Transaction successfully confirmed!!');
//         return response;
//     } catch (error) {
//         stopLoad(error.message);
//         return '000';
//     }
// }



const saveTrxInDB = async (data, amount, tokenSymbol, chain, tokenPairImg) => {
    const url = `${API_URL}api/DEGEN/insertTrx?token=${tokenSymbol}&amount=${amount}&walletAddress=${data.from}&trxHash=${data.transactionHash}&status=${data.status ? 'Success' : 'pending'}&timestamp=${new Date().toISOString()}&chain=${chain}&token_image=${tokenPairImg.baseImg}`
    // const body = {
    //         token: data.to,
    //         amount: Number(amount),
    //         userAddress: data.from,
    //         transactionHash: data.transactionHash,
    //         transactionStatus: data.status ? 'Success': 'pending',
    //         time : new Date().getTime(),
    // };
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    const Api_Response = await response.json();
    // console.log(Api_Response)
    // window.location.reload();
}