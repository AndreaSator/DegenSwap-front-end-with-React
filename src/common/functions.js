import { BNB_USDT, ETH_USDT, inchUrl, PANCAKE_FACTORY, PANCAKE_ROUTER, SUSHISWAP_FACTORY, SUSHISWAP_ROUTER, TEST_WBNB, TEST_WETH, UNISWAP_FACTORY, UNISWAP_ROUTER } from "./constant";
import factoryAbi from '../abi/factory.json';
import Web3 from 'web3';
import uniswapAbi from '../abi/uniswap.json';
import pairAbi from '../abi/pairAbi.json';
import ERC20 from '../abi/erc20_abi.json';
import { getDecimal } from "../service/degen_function";
import { getDecimal as findDecimals } from "../common/new";
import fromExponential from "from-exponential";
import {get_web3_instance} from '../service/degen_function';

export const ethConnectionUrl = "https://mainnet.infura.io/v3/e3706a59ed38418095f619d56df648e0";
export const bnbConnectionUrl = "https://bsc-dataseed.binance.org";

export const getPair = async (from, to, factoryContract = UNISWAP_FACTORY) => {
    try{

        const wallet = localStorage.getItem('account');
        const web3 = await get_web3_instance()
        const factory = new web3.eth.Contract(factoryAbi, factoryContract);
        const pair = await factory.methods.getPair(from, to).call({ from: wallet });
        return pair;
    }catch(e){
        return '0x0000000000000000000000000000000000000000';
    };
};

export const getReservesRatio = async (from, pairAddress) => {
    try{
        const wallet = localStorage.getItem('account');
        const web3 = await get_web3_instance()
        const tokenPair = new web3.eth.Contract(pairAbi, pairAddress);
        const token0 = await tokenPair.methods.token0().call({ from: wallet });
        const reserve = await tokenPair.methods.getReserves().call({ from: wallet });
        return String(token0).toLowerCase() === String(from).toLowerCase() ?  reserve._reserve0 / reserve._reserve1 : reserve._reserve1 / reserve._reserve0;
    }catch(e){
        return 0;
    };
};


export const getImpact = async (from, to, fromAmt, toAmt, factory) => {
    if(!fromAmt || !toAmt) return 0;
    let reserveRatio;
    const web3 = await get_web3_instance()
    fromAmt = web3.utils.toWei(String(fromAmt));
    toAmt = web3.utils.toWei(String(toAmt));
    const swapFee = factory === PANCAKE_FACTORY ? 0.25 : 0.3;
    const pairAddress = await getPair(from, to, factory);
    const r = await getReservesRatio(from, pairAddress);
    if(pairAddress !== '0x0000000000000000000000000000000000000000') reserveRatio = (await getReservesRatio(from, pairAddress));
    else{
        const mediator = factory === PANCAKE_FACTORY ? TEST_WBNB : TEST_WETH ;
        const pairAB = (await getPair(from, mediator, factory));
        const pairBC = (await getPair(mediator, to, factory));
        const ratioAB = (await getReservesRatio(from, pairAB));
        const ratioBC = (await getReservesRatio(mediator, pairBC));
        reserveRatio = ratioAB * ratioBC;
    };
    const amtRatio = fromAmt / toAmt;
    const impact = (1 - (reserveRatio / amtRatio)) * 100 - swapFee;
    return impact < 0 ?  0.00001 : impact;
};

export const toBig = async(num) => {
    const web3 = await get_web3_instance();
    const newNum = web3.utils.toBN((num))
   return newNum;
};



export const getAmountOut = ({
    fromToken, toToken, amount, router = UNISWAP_ROUTER, 
    abi = uniswapAbi, factoryContract = UNISWAP_FACTORY,
    isBsc = false, web3Instance = null,
}) => new Promise(async(resolve, reject) => {
    const web3 = await get_web3_instance();

    const userwalletaddresss = localStorage.getItem('account');
    let factories = web3Instance ? new web3Instance.Contract(factoryAbi, factoryContract) : new web3.eth.Contract(factoryAbi,factoryContract);
    let path;
    let  swaping = web3Instance ? new web3Instance.Contract(abi, router) : new web3.eth.Contract(abi,router);
    factories.methods.getPair(fromToken,toToken).call({from:userwalletaddresss})
    .then((pairaddress)=>
    {
        if(pairaddress == '0x0000000000000000000000000000000000000000' && [fromToken, toToken].includes(isBsc ? TEST_WBNB : TEST_WETH)){
            resolve(['0', '0', false, true]);
        };
        if(pairaddress == '0x0000000000000000000000000000000000000000')
        { 
        
            let path = [fromToken,isBsc ? TEST_WBNB : TEST_WETH];
            let bal = web3Instance ? new web3Instance.Contract(ERC20, path[0]) : new web3.eth.Contract(ERC20,path[0]);
            bal.methods.decimals().call({from:userwalletaddresss}).then(async(number)=>
            {
                const multipied = String(fromExponential(amount * Math.pow(10, number)))
                let amountIn = await toBig(multipied.split('.')[0]);
                swaping.methods.getAmountsOut(amountIn, path).call({from:userwalletaddresss})
                .then((res) => {
                let balance = web3Instance ? new web3Instance.Contract(ERC20, path[1]) : new web3.eth.Contract(ERC20,path[1]);
                balance.methods.decimals().call({from:userwalletaddresss}).then((numb)=>
                {
                    let amounts = (parseFloat(res[1])/(10**numb));
                    let path = [isBsc ? TEST_WBNB : TEST_WETH,toToken];
                    let bal = web3Instance ? new web3Instance.Contract(ERC20, path[0]) : new web3.eth.Contract(ERC20,path[0]);
                    bal.methods.decimals().call({from:userwalletaddresss}).then(async(number)=>
                    {
                        let amountIn =await toBig(fromExponential((amounts) * Math.pow(10,number)));
                        swaping.methods.getAmountsOut(amountIn, path).call({from:userwalletaddresss})
                        .then((res) => {
                        let balance = web3Instance ? new web3Instance.Contract(ERC20, path[1]) : new web3.eth.Contract(ERC20,path[1]);
                        balance.methods.decimals().call({from:userwalletaddresss}).then((numb)=>
                        {
                            let amount = (parseFloat(res[1])/(10**numb));
                            resolve([amount, res[1], true]);
                        }).catch(e => {
                            if(e) reject(['0', '0']);
                        })
                        
                        }).catch(e => {
                            if(e) reject(['0', '0']);
                        })
                        .catch(e => {
                            if(e) reject(['0', '0']);
                        })
                    }).catch(e => {
                        if(e) reject(['0', '0']);
                    })
                }).catch()
                
                }).catch(e => {
                    if(e){
                        reject(['0', '0']);
                    }
                })
            }).catch(err => {
                reject(['0', '0']);
            });
        }else{
            let path = [fromToken, toToken];

            let bal = web3Instance ? new web3Instance.Contract(ERC20, path[0]) : new web3.eth.Contract(ERC20,path[0]);
            bal.methods.decimals().call({from:userwalletaddresss}).then(async(number)=>
            {
                const multipied = String(fromExponential(amount * Math.pow(10, number)))
                let amountIn = await toBig(multipied.split('.')[0]);
                    swaping.methods.getAmountsOut(amountIn, path).call({from:userwalletaddresss})
                    .then((res) => {
                    let balance = web3Instance ? new web3Instance.Contract(ERC20, path[1]) : new web3.eth.Contract(ERC20,path[1]);
                    balance.methods.decimals().call({from:userwalletaddresss}).then((numb)=>
                    {
                        let amount = (parseFloat(res[1])/(10**numb));
                        resolve([amount, res[1]]);
                    }).catch(e => {console.log(e); 
                        reject(['0', '0'])})
                    
                    })
                    .catch(e => {console.log(e); 
                        reject(['0', '0'])})
            }).catch(e => {console.log(e); 
                reject(['0', '0'])})
        }
    }).catch(err => {
        console.log(err);
        reject(['0', '0'])
    });


})

export const getAmountOutUni = async ({
    fromToken, toToken, amount, web3Instance
}) => {
    const amountOut = await getAmountOut({
        fromToken, toToken, amount, web3Instance
    });
    return amountOut;
}

export const getAmountOutSushi = async ({
    fromToken, toToken, amount, web3Instance
}) => {
    const amountOut = await getAmountOut({
        fromToken, toToken, amount,
        router: SUSHISWAP_ROUTER,
        factoryContract: SUSHISWAP_FACTORY,
        web3Instance
    })
    return amountOut;
};

const getAmountOutInch = async ({
    fromToken, toToken, amount
}) => {
    try{
        const ethUrl = 'https://mainnet.infura.io/v3/e3706a59ed38418095f619d56df648e0';
        const ethWeb3Instance = new Web3(new Web3.providers.HttpProvider(ethUrl)).eth;
        const decimals = await findDecimals(ethWeb3Instance, fromToken);
        amount = fromExponential(amount * Math.pow(10, decimals));
        amount = amount.split('.')[0];
        const url = inchUrl({ fromToken, toToken, amount });
        const response = await fetch(url);
        const data = await response.json();
        return [data.toTokenAmount / Math.pow(10, data.toToken.decimals), data.toTokenAmount];
    }catch(e){
        return [0, 0];
    };
};

export const getInchAtAllCosts = async ({
    fromToken, toToken, amount
}) => {
    try{
        const value = await getAmountOutInch({ fromToken, toToken, amount });
        if(value[0] || [fromToken, toToken].includes(TEST_WETH)) return value;
        else {
            const valueAB = await getAmountOutInch({ fromToken, toToken: TEST_WETH, amount });
            const valueBC = await getAmountOutInch({ fromToken: TEST_WETH, toToken, amount: valueAB[0] });
            return valueBC;
        }
    }catch(e){
        return [0, 0];
    };
};

export const getAmountOutPan = async ({
    fromToken, toToken, amount, web3Instance
}) => {
    
    const amountOut = await getAmountOut({
        fromToken, toToken, amount,
        router: PANCAKE_ROUTER, 
        factoryContract: PANCAKE_FACTORY,
        isBsc: true, web3Instance
    });
    return amountOut;
}

export const panUsdtAmount = async ({
    otherToken, usdtSide = 'from', amount, shoudldCreateInstance = false,
}) => {
    if(otherToken.toLowerCase() === BNB_USDT.toLowerCase()) return [amount, amount];
    let web3Instance = null;
    if(shoudldCreateInstance) {
        const account = localStorage.getItem('account');
        web3Instance = new Web3(new Web3.providers.HttpProvider(bnbConnectionUrl)).eth;
        
    };
    return (await getAmountOutPan({
        fromToken: usdtSide === 'from' ? BNB_USDT : otherToken,
        toToken: usdtSide === 'to' ? BNB_USDT : otherToken,
        amount, web3Instance
    }));
};

export const uniUsdtAmount = async ({
    otherToken, usdtSide = 'from', amount, shoudldCreateInstance = false,
}) => {
    if(otherToken.toLowerCase() === ETH_USDT.toLowerCase()) return [amount, amount];
    let web3Instance = null;
    if(shoudldCreateInstance) {
        web3Instance = new Web3(new Web3.providers.HttpProvider(ethConnectionUrl)).eth;
    };
    return (await getAmountOutUni({
        fromToken: usdtSide === 'from' ? ETH_USDT : otherToken,
        toToken: usdtSide === 'to' ? ETH_USDT : otherToken,
        amount, web3Instance
    }));
};

export const sushiUsdtAmount = async ({
    otherToken, usdtSide = 'from', amount, shoudldCreateInstance = false,
}) => {
    if(otherToken.toLowerCase() === ETH_USDT.toLowerCase()) return [amount, amount];
    let web3Instance = null;
    if(shoudldCreateInstance) {
        web3Instance = new Web3(new Web3.providers.HttpProvider(ethConnectionUrl)).eth;
    };
    return (await getAmountOutSushi({
        fromToken: usdtSide === 'from' ? ETH_USDT : otherToken,
        toToken: usdtSide === 'to' ? ETH_USDT : otherToken,
        amount, web3Instance
    }));
};

export const inchUsdtAmount = async ({
    otherToken, usdtSide = 'from', amount
}) => {
    if(otherToken.toLowerCase() === ETH_USDT.toLowerCase()) return [amount, amount];
    return (await getInchAtAllCosts({
        fromToken: usdtSide === 'from' ? ETH_USDT : otherToken,
        toToken: usdtSide === 'to' ? ETH_USDT : otherToken,
        amount
    }));
};

export const ethUsdtValue = async amt => {
    try{
        const web3 = await get_web3_instance();
        const decimals = await getDecimal(TEST_WETH);
        const wallet = localStorage.getItem('account');
        const bigAmt = await toBig(fromExponential(amt * Math.pow(10, decimals)));
        const swaping = new web3.eth.Contract(uniswapAbi, UNISWAP_ROUTER);
        const path = [TEST_WETH, ETH_USDT];
        const res = await swaping.methods.getAmountsOut(bigAmt, path).call({ from: wallet });
        return res[1];
    }catch(e){
        return 1;
    }
};

export const getChainShort = name => {
    if(['ethereum', 'Ethereum', 'eth', 'ETH', 'ETHEREUM'].includes(name)) return 'eth';
    else return 'bsc';
};

export const createCustomInstance = (chain = 'bsc') => {
    const url = chain === 'bsc' ? bnbConnectionUrl : ethConnectionUrl;
    const web3Instance = new Web3(new Web3.providers.HttpProvider(url)).eth;
    console.log(url, web3Instance);
    return web3Instance;
};


export const inchSwapUrl = async ({
    fromToken, toToken, amount, slippage
}) => {
    const wallet = localStorage.getItem('account');
    const decimals = await getDecimal(fromToken);
    amount *= Math.pow(10, decimals);
    return `https://api.1inch.exchange/v3.0/1/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}&fromAddress=${wallet}&slippage=${slippage}`;
};

export const bigAdd = (A, B) => {
    A = String(A);
    B = String(B);
    if(A.includes('e')) A = fromExponential(A);
    if(B.includes('e')) B = fromExponential(B);
    if(A.includes('.')) A = A.split('.')[0];
    if(B.includes('.')) B = B.split('.')[0];
    const AL = A.length
    const BL = B.length
    const ML = Math.max(AL, BL)
  
    let carry = 0, sum = ''
  
    for (let i = 1; i <= ML; i++) {
        let a = +A.charAt(AL - i)
        let b = +B.charAt(BL - i)
    
        let t = carry + a + b
        carry = t/10 |0
        t %= 10
    
        sum = (i === ML && carry)
            ? carry*10 + t + sum
            : t + sum
    }
  
    return sum
}
  