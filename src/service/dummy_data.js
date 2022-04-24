import bnbImg from '../asstes/imgs/bnb.png';
import ethImg from '../asstes/imgs/ETH1.png';
import avav from '../asstes/imgs/aave.png';
import commonImg from '../asstes/imgs/form-input.png';
import {TEST_WBNB, TEST_WETH} from '../common/constant'
import { getDefaultChain } from './degen_function';
import { getBscTokens, getEthTokens } from './token_list';
export const coin_array = [
    { symbol: 'ETH',chain:'eth', image: 'imgs/ETH1.png', address: TEST_WETH},

    { symbol: 'AVAV', chain:'eth', image: 'imgs/aave.png', address: '0x116699E5E9aE620Ad11CaAcb3dc5982ecfB49152' },
    { symbol: 'TK', chain:'eth', image: 'imgs/ETH1.png', address: '0x47A530f3Fa882502344DC491549cA9c058dbC7Da' },
    { symbol: 'BVBV',chain:'eth', image: 'imgs/ETH1.png', address: '0x422c9EeE99b40775c258bF1AEED4528F0A8b380E'},
    
    { symbol: 'BNB',chain:'bsc', image: 'imgs/bnb.png', address: TEST_WBNB },
    { symbol: 'AVAV', chain:'bsc', image: 'imgs/aave.png', address: '0x6484eBf9880eFD0e226a31cB2Cd4fbc12b31C757' },
    { symbol: 'TK', chain:'bsc', image: 'imgs/bnb.png', address: '0x536Ed4aaf8fBe8e35CDDd04b1928882FA292C282' },
    { symbol: 'BVBV',chain:'bsc', image: 'imgs/bnb.png', address: '0xAe0354F143Ad57843359fb32966F48A4693B3D76' },
    
];
export const chain_array = [
    { name: 'BSC',chain:'bsc', image: bnbImg, address: '0x116699e5e9ae620ad11caacb3dc5982ecfb49152' },
    { name: 'ETHEREUM',chain:'eth', image: ethImg, address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
];

export const getProductionTokens = async (chain, d) => {
    if(!chain) chain = await getDefaultChain();
    let tokens = [];
    console.log(chain, 'is the chain in setting', d)
    if(chain === 'eth' || chain === 'ethereum') 
    {
        tokens = await getEthTokens();
         const cToken = getMycustomToken('eth');
         if (cToken) {   
            tokens.push(cToken)
        }
    }
    else {
        tokens = await getBscTokens();
        const cToken = getMycustomToken('bsc');
        if (cToken) {   
            tokens.push(cToken)
        }
    }
  

    return tokens;
}

const getMycustomToken = (chain) =>{
    const customToken = sessionStorage.getItem('customTokenByUser');

if(customToken && JSON.parse(customToken).chain == chain) return JSON.parse(customToken);
}