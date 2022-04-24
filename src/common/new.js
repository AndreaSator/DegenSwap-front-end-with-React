import fromExponential from "from-exponential";
import factoryAbi from "../abi/factory.json";
import pairAbi from '../abi/pairAbi.json';
import ERC20 from '../abi/erc20_abi.json';
import uniswapAbi from "../abi/uniswap.json";
import Web3 from "web3";
import { BNB_USDT, ETH_USDT, PANCAKE_FACTORY, PANCAKE_ROUTER, TEST_WBNB, TEST_WETH, UNISWAP_FACTORY, UNISWAP_ROUTER, ZERO_ADDRESS } from "./constant";
import { get_web3_instance } from "../service/degen_function";

const url = 'https://bsc-dataseed.binance.org';
const ethUrl = 'https://mainnet.infura.io/v3/e3706a59ed38418095f619d56df648e0';

export const getValueForTesting = async ({ amount, fromToken, toToken, crossChain = false }) => {
    try{
        const factoryContract = PANCAKE_FACTORY;
        const web3Instance = new Web3(new Web3.providers.HttpProvider(url)).eth;
        const ethWeb3Instance = new Web3(new Web3.providers.HttpProvider(ethUrl)).eth;

        if(!crossChain){
            const factories = new web3Instance.Contract(factoryAbi, factoryContract);
            const pair = await factories.methods.getPair(fromToken, toToken).call();

            if(ZERO_ADDRESS !== pair){
                return (await getTokenValue(amount, fromToken, toToken, web3Instance));
            }else{
                const [_] = (await getTokenValue(amount, fromToken, TEST_WBNB, web3Instance));
                const amtBC = await getTokenValue(_, TEST_WBNB, toToken, web3Instance);
                return amtBC;
            };
        }else{
            const [_] = (await getTokenValue(amount, fromToken, BNB_USDT, web3Instance));
            const factories = new ethWeb3Instance.Contract(factoryAbi, UNISWAP_FACTORY);
            const pair = await factories.methods.getPair(ETH_USDT, toToken).call();
            if(pair !== ZERO_ADDRESS){
                return (await getTokenValue(_, ETH_USDT, toToken, ethWeb3Instance, UNISWAP_ROUTER));
            }else{
                const [__] = (await getTokenValue(_, ETH_USDT, TEST_WETH, ethWeb3Instance, UNISWAP_ROUTER));
                const BC = await getTokenValue(__, TEST_WETH, toToken, ethWeb3Instance, UNISWAP_ROUTER);
                return BC;
            };
        };
    }catch(e){
        return [0, 0];
    };
};

const getTokenValue = async (amount, fromToken, toToken, web3Instance, router = PANCAKE_ROUTER) => {
    try{
        const swaping = new web3Instance.Contract(uniswapAbi, router);
        const decimals = await getDecimal(web3Instance, fromToken);
        const realAmount = (fromExponential(amount * Math.pow(10, decimals)).split('.')[0]);
        const amountOut = await swaping.methods.getAmountsOut(realAmount, [fromToken, toToken]).call();
        const toDecimals = await getDecimal(web3Instance, toToken);
        console.log((parseFloat(amountOut[1]) / (10 ** toDecimals)));
        return [(parseFloat(amountOut[1]) / (10 ** toDecimals)), amountOut[1]];
    }catch(e){
        return 0;
    }
}

export const getPair = async (from, to) => {
    try{
        const factoryContract = PANCAKE_FACTORY;
        const web3Instance = new Web3(new Web3.providers.HttpProvider(url)).eth;
 
        const factory = new web3Instance.Contract(factoryAbi, factoryContract);
        const pair = await factory.methods.getPair(from, to).call();
        return pair;
    }catch(e){
        return '0x0000000000000000000000000000000000000000';
    };
};

export const getReservesRatio = async (from, pairAddress) => {
    try{
        const web3Instance = new Web3(new Web3.providers.HttpProvider(url)).eth;
        
        const tokenPair = new web3Instance.Contract(pairAbi, pairAddress);
        const token0 = await tokenPair.methods.token0().call();
        const reserve = await tokenPair.methods.getReserves().call();
        return String(token0).toLowerCase() === String(from).toLowerCase() ?  reserve._reserve0 / reserve._reserve1 : reserve._reserve1 / reserve._reserve0;
    }catch(e){
        return 0;
    };
};


export const getImpactForTesting = async (from, to, fromAmt, toAmt, factory) => {
    if(!fromAmt || !toAmt) return 0;
    let reserveRatio;
    const web3 = await get_web3_instance();
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


export const getDecimal = async (web3Instance, token) => {
    try{
        const instance = new web3Instance.Contract(ERC20, token);
        const decimals = await instance.methods.decimals().call();
        return decimals;
    }catch(e){
        return 18;
    }
};