export const degen_contract_address = '0xcd65a4f94c812967a972afe87c1e16552b6950fd';  // BSC CONTRACT
export const degen_contract_address1 = '0x1553630a8b4b1b314b0ac457be8ea70f32cfa461'; // ETH CONTRACT
export const LARGE_APPROVAL_AMOUNT = 999;

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

//test
export const UNISWAP_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
export const UNISWAP_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
export const SUSHISWAP_ROUTER = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';
export const PANCAKE_ROUTER = '0x10ED43C718714eb63d5aA57B78B54704E256024E';
export const PANCAKE_FACTORY = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
export const SUSHISWAP_FACTORY = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac';
export const TEST_WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const TEST_WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
export const BNB_USDT = '0x55d398326f99059fF775485246999027B3197955';
export const ETH_USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// testnet
// export const reimbursement_contract_address_bsc = "0x668509132Ba24A5cD09D7909c71a2D3AF19016ff";
// export const reimbursement_contract_address_eth = "0x1c8aAf10df80F0771a6926ff739d30db53Da7CE9";
// export const RPC_PROVIDER_ETHEREUM = "wss://kovan.infura.io/ws/v3/d86e5c556a9f4e5d84c5319ab1d174be";
// export const RPC_PROVIDER_BINANCE = "https://data-seed-prebsc-1-s1.binance.org:8545";
// export const SWAP_Factory_Contract_BINANCE = "0x078F9018a2fF0D7a0FE919Ff6e4d2485a0d78d8c";
// export const SWAP_Factory_Contract_ETHEREUM = "0x8Be80736badB7bEf6fa9160eCF9581A62CD280Da";
// export const tokenDetails = {
//     "WBNB": {
//         symbol: "WBNB",
//         name: "Wrapped BNB",
//         networkId: 97,
//         coingecko_id: "",
//         address: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
//         isActive: true,
//         iconName: "WBNB",
//         approveRequire: true
//     },
//     "WETH": {
//         symbol: "WETH",
//         name: "Wrapped Ether",
//         networkId: 97,
//         coingecko_id: "",
//         address: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
//         isActive: true,
//         iconName: "WETH",
//         approveRequire: true
//     }
// }

// mainnet
export const reimbursement_contract_address_bsc = "0xd26132cca2d9e0b4901c7ad4de2b16364624f85a";
export const reimbursement_contract_address_eth = "0x96d1e9D25bD949b6811e2844ACa63CB3Cfce68AF";
export const RPC_PROVIDER_ETHEREUM = 'wss://mainnet.infura.io/ws/v3/0bc569339d39467c9c1840a2f5c6615f';
export const RPC_PROVIDER_BINANCE = 'https://bsc-dataseed.binance.org';
export const SWAP_Factory_Contract_BINANCE = "0xcd65a4f94c812967a972afe87c1e16552b6950fd";
export const SWAP_Factory_Contract_ETHEREUM = "0x1553630a8b4b1b314b0ac457be8ea70f32cfa461";
export const tokenDetails = {
    "WBNB": {
        symbol: "WBNB",
        name: "Wrapped BNB",
        networkId: 56,
        coingecko_id: "",
        address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        isActive: true,
        iconName: "WBNB",
        approveRequire: true
    },
    "WETH": {
        symbol: "WETH",
        name: "Wrapped Ether",
        networkId: 1,
        coingecko_id: "",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        isActive: true,
        iconName: "WETH",
        approveRequire: true
    }
}

// export const API_URL = 'https://api.degenswap.io/'; 

export const deployment_env = 'production' //'production' || 'development';

export const PARA_API_URL = 'https://apiv5.paraswap.io';
export const API_URL = deployment_env == 'development' ? 'http://52.70.198.55:5000/' : 'https://api.degenswap.io/';

export const eth_chain = 'ETHEREUM';
export const bsc_chain = 'BSC';
export const NETWORK = {
    Mainnet: 1,
    Kovan: 42,
    Ropsten: 3,
    Rinkeby: 4,
    Goerli: 5,
    BSCTESTNET: 97,
    BSCMAINNET: 56
};
export const CHAINS = {
    Mainnet: '0x1',
    Kovan: '0x42',
    Ropsten: '0x3',
    Rinkeby: '0x4',
    Goerli: '0x5',
    BSCTESTNET: '0x61',
    BSCMAINNET: '0x38'
};

export const inchUrl = ({
    fromToken, toToken, amount
}) => `https://api.1inch.exchange/v3.0/1/quote?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${amount}`;
export const ETH_BASES = ['ETH', 'WETH', 'USDT', 'vETH'];
export const BSC_BASES = ['BNB', 'WBNB', 'USDT', 'BTCB'];