import Web3 from 'web3';
import uniswapAbi from './abi/uniswap.json';
import { useState, useEffect } from 'react';
import { getPrices } from './service/degen_function';

// hook that binds intersection observer
export const useOnScreen = options => {
      
    const [ref, setRef] = useState(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {

        const observer = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting);
        }, options);

        if(ref){
            observer.observe(ref);
        };

        return () => {
            if(ref){
                observer.unobserve(ref);
            }
        }
    }, [options, ref]);

    return [visible, setRef, ref];
};

const findDegenToBnb = async () => {
    const connectionUrl = 'https://bsc-dataseed.binance.org';
    const router = '0xa81D569f7EdDc432FE86808B809d0AfCaE670ee3';
    const bnb = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const degen = '0x1Eea643fc6C0B4D253621839986fc566Fce40704';
    const amountIn = '1000000000000000000';
    const wallet = localStorage.getItem('account');
    const web3Instance = new Web3(new Web3.providers.HttpProvider(connectionUrl));
    const exchange = new web3Instance.eth.Contract(uniswapAbi, router);
    try{
        const toBnb = await exchange.methods.getAmountsOut(amountIn, [degen, bnb]).call({ from: wallet });
        return toBnb[1] / Math.pow(10, 18);
    }catch(e){
        return 0;
    };
};

const findBnbToUsd = async amt => {
    try{
        const { binancecoin: b } = (await getPrices());
        return amt * b.usd;
    }catch(e){
        return 0;
    }
}

export const useDegenPrice = () => {
    const [price, setPrice] = useState('$0.00');
 
    useEffect(() => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 4
        });
        const findPrice = async () => {
            const toBnb = await findDegenToBnb();
            const toUsd = await findBnbToUsd(toBnb);
            setPrice(formatter.format(toUsd));
        };
          
        findPrice();
        const interval = setInterval(findPrice, 1 * 60 * 1000);  // 1 minute

        return () => {
            clearInterval(interval);
        }
    }, []);
    
    return price;
};