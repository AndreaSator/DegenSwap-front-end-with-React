import { useEffect, useState } from "react";
import { sendTransaction, approveToken, get_web3_instance } from "../service/degen_function";
import { metamask_connection } from "../service/metamask_function";
import { useSnackbar } from 'react-simple-snackbar';
import { isArray } from "lodash";
import { API_URL, CHAINS, degen_contract_address, degen_contract_address1, LARGE_APPROVAL_AMOUNT, UNISWAP_FACTORY } from "../common/constant";
import erc20Abi from '../abi/erc20_abi.json';
import { TEST_WBNB, TEST_WETH } from '../common/constant'
import bnbImg from '../asstes/imgs/bnb.png';
import ethImg from '../asstes/imgs/ETH1.png';
import DetectMetamaskAlert from "./detect-metamask-alert";
import detectEthereumProvider from "@metamask/detect-provider";
import { getDecimal } from "../service/degen_function";
import { ethUsdtValue, getChainShort } from "../common/functions";
import {DebounceInput} from 'react-debounce-input';

export const ConnectWallet = ({ tokenPair, addressProp, fromChain, fromCoin, toCoin, isThreePath, inSuffLiq, setInSuffLiq, priceImpact, slippage, onSuccess, inchTxnData, ...prop }) => {
  const [openSnackbar] = useSnackbar()

  const [meta_wallet, setMetaWallet] = useState(null);
  const [quotePrice, setQuotePrice] = useState('0');
  const [minValue, setMinValue] = useState('0');
  const [percentValue, setPercentValue] = useState('0');
  const [chainIcon, setChainIcon] = useState('');
  const [allowedAmt, setAllowedAmt] = useState('');
  const [metamaskprovider, setProvider] = useState(null);
  const [baseValue, setBaseValue] = useState('0');
  const [connectClicked, setConnectClicked] = useState(false);
  const [_availableBal, setAvailableBal] = useState('0');


  const detectMetamask = async () => {
    detectEthereumProvider().then(pro => {
      setProvider(pro);
    });
  }

  useEffect(() => {
    findAllowedAmount(setAllowedAmt);
  }, [addressProp, fromChain, prop.valueProp]);


  useEffect(() => {

    let interval;
    callQouteFunction(prop.valueProp);
    clearInterval(interval);
    interval = setTimeout(() => {
      if (!prop.valueProp) prop.defaultProp();
    }, 2000);
    return () => clearTimeout(interval);
  }, [prop.valueProp])

  useEffect(() => {

    detectMetamask();
    showpopup();
    getAccount();
    metamask_connection(localStorage.getItem('account'), 'UseEffect');

    setQuotePrice(prop.QuotePriceValue);

    setMinValue(prop.MinimumCalValue);

    setPercentValue(prop.SlippagePercent);

    setMetaWallet(localStorage.getItem('account'));

    const intr = setInterval(() => {
      if (metamaskprovider) {
        getDefaultIcon();
        clearInterval(intr);
      }
    }, 1000);

    if (baseValue == 0) {
      setQuotePrice('0')
    }

  }, [prop.QuotePriceValue, metamaskprovider]);

  useEffect(() => {
    setInSuffLiq(false);
  }, [fromChain, prop.toChain])

  const showpopup = () => {
    var icon = document.querySelector(
      ".hero__content--form form > div:nth-child(3) .bottomtext i"
    );

    var txt = document.querySelector(".dummypopup");

    icon.onclick = function () {
      if (txt.classList.contains("show")) {
        txt.classList.remove("show");
      } else {
        txt.classList.add("show");
      }
    };
  };

  const OpenModal = (type, chainType) => {
    prop.tokenBalances()
    prop.modalStateType(type, chainType);
  }

  const callQouteFunction = async (inputValue) => {
    prop.bestQuotePrice(inputValue)
    setBaseValue(inputValue);

  }

  const findAllowedAmount = async (callback = () => { }) => {
    try {
      const decimal = await getDecimal(addressProp[0]);
      const web3 = get_web3_instance()
      let walletAddress = localStorage.getItem('account');
      let contract = new web3.eth.Contract(erc20Abi, addressProp[0]);
      let allowed = await contract.methods.allowance(walletAddress, fromChain === 'eth' ? degen_contract_address1 : degen_contract_address).call();
      allowed = +allowed / Math.pow(10, decimal);
      callback(allowed || '');
      return allowed;
    } catch (error) {
      callback('');
      return '';
    };
  };



  const approveContract = async () => {
    const weth_wbnb = [TEST_WETH, TEST_WBNB];
    if (fromChain == undefined || fromChain == null || fromChain == '') {
      openSnackbar('Please Select From Chain');
    } else if (prop.toChain == undefined || prop.toChain == null || prop.toChain == '') {
      openSnackbar('Please Select To Chain');
    } else if (!isArray(addressProp) || addressProp.length != 2) {
      openSnackbar('Please Select From and To Tokens');
    } else if (isNaN(prop.valueProp) || prop.valueProp == '0' || prop.valueProp == null || prop.valueProp == '') {
      openSnackbar('Please Input a valid Number');
    } else {
      let approveResponse;
      // prop.myLoaderSatate(false);
      const allowed = await findAllowedAmount();
      let shouldApprove = !+allowed || +allowed < prop.valueProp;

      if (weth_wbnb.includes(prop.tokenAddressArr.from)) {
        shouldApprove = false;
      }

      if (shouldApprove) {
        const decimal = await getDecimal(prop.tokenAddressArr.from);
        approveResponse = await approveToken(addressProp, Math.min(LARGE_APPROVAL_AMOUNT, (prop.availableBal / Math.pow(10, decimal) || 0), +prop.valueProp), prop.gasProp, fromChain, prop.toChain);
      };


      if (!shouldApprove || (approveResponse && approveResponse.status)) {
        const orderType = await getOrderType();
        const tokenSymbol = tokenPair.base + '/' + tokenPair.quote;
        let res = [];
        if (isThreePath) {
          res[0] = addressProp[0];
          res[1] = fromChain === 'eth' ? TEST_WETH : TEST_WBNB;
          res[2] = addressProp[1];
        } else {
          res = [...addressProp];
        }
        const isEthToBsc = getChainShort(fromChain) === 'eth' && getChainShort(prop.toChain) === 'bsc' && addressProp[0] === TEST_WETH && addressProp[1] === TEST_WBNB;
        let newMinValue;
        if (isEthToBsc) { newMinValue = await ethUsdtValue(prop.valueProp); }
        sendTransaction(res, prop.valueProp, prop.coinProp, prop.gasProp, fromChain, prop.toChain, isEthToBsc ? newMinValue : minValue, orderType, tokenSymbol, prop.tokenPairImg, prop.dexData, quotePrice, onSuccess, inchTxnData).then((trxResponse) => {
          //;
          if (addressProp[0] === addressProp[1]) {
            openSnackbar('Identical Token Addresses');
            return;
          }
          prop.myLoaderSatate(true);
          if (trxResponse === undefined) {
            findAllowedAmount(setAllowedAmt);
            openSnackbar('Transaction has been cancelled');
          } else {
            openSnackbar('Swapping Transaction Hash is ' + trxResponse);
            prop.reset();
            setQuotePrice("");
          }
        }).catch(err => {
          openSnackbar('Transaction failed, please try again ');
        });
      }
      else {
        // prop.myLoaderSatate(true);
        openSnackbar('Token not approved');

      }
    }
  }

  const getOrderType = async () => {
    let orderType = { orderType: '', crossOrderType: '' };
    let frm = tokenPair.base;
    let to = tokenPair.quote;
    if (fromChain === prop.toChain) {
      if (frm == 'ETH' || frm == 'BNB') {
        orderType.orderType = '0'
      }
      else if ((frm != 'ETH' || frm != 'BNB') && (to == 'ETH' || to == 'BNB')) {
        orderType.orderType = '1'
      }
      else if ((frm != 'ETH' || frm != 'BNB') && (to != 'ETH' || to != 'BNB')) {
        orderType.orderType = '2'
      }
    }
    else {
      if ((frm == 'ETH' && to == 'BNB') || (frm === 'BNB' && to === 'ETH')) {
        orderType.orderType = '0';
        orderType.crossOrderType = '1';
      }
      else if (frm == 'ETH' && to != 'BNB') {
        orderType.orderType = '0'
        orderType.crossOrderType = '2';
      }
      else if (frm == 'BNB' && to != 'ETH') {
        orderType.orderType = '0'
        orderType.crossOrderType = '2';
      }
      else if ((frm != 'ETH' || frm != 'BNB') && (to == 'ETH' || to == 'BNB')) {
        orderType.orderType = '2'
        orderType.crossOrderType = '1';
      }
      else if ((frm != 'ETH' || frm != 'BNB') && (to != 'ETH' || to != 'BNB')) {
        orderType.orderType = '2'
        orderType.crossOrderType = '2';
      }
    }
    return orderType;
  }
  const getAccount = () => {
    const intervalSubs = setInterval(() => {
      setMetaWallet(localStorage.getItem('account'));
      if (meta_wallet) {
        clearInterval(intervalSubs);
      }
    }, 1000);
  }
  const checkApprove = () => {
    if (prop.valueProp > 0 && quotePrice > 0) {
      approveContract();
    } else {
      openSnackbar('Values must be greater than 0')
    }
  }

  const getDefaultIcon = () => {
    if (window.ethereum.chainId === CHAINS.Ropsten || window.ethereum.chainId === CHAINS.Mainnet) {
      setChainIcon(ethImg);
    }
    if (window.ethereum.chainId === CHAINS.BSCTESTNET || window.ethereum.chainId === CHAINS.BSCMAINNET) {
      setChainIcon(bnbImg);
    }
  }

  const switchTokens = async () => {

    let coin_array_from;
    let coin_array_to;
    let tokenAdressArray = [];
    let bal;
    setBaseValue(quotePrice);
    setQuotePrice(baseValue);
    prop.setTokenPairs({ base: tokenPair.quote, quote: tokenPair.base })

    if (fromChain == 'eth' && prop.toChain == 'bsc') {
      let coin_array_from = fromCoin;
      let coin_array_to = toCoin;
      tokenAdressArray.push(coin_array_from[0].address, coin_array_to[0].address)
      prop.setAddressArray(tokenAdressArray)
      prop.setTokenAddressArr(ar => ({ from: tokenAdressArray[0], to: tokenAdressArray[1] }));
      prop.setTokenPairImage({ baseImg: coin_array_from[0].image, quoteImg: coin_array_to[0].image })

    }
    else if (fromChain == 'bsc' && prop.toChain == 'eth') {
      coin_array_from = fromCoin;
      coin_array_to = toCoin;
      tokenAdressArray.push(coin_array_from[0].address, coin_array_to[0].address)
      prop.setAddressArray(tokenAdressArray)
      prop.setTokenAddressArr(ar => ({ from: tokenAdressArray[0], to: tokenAdressArray[1] }));
      prop.setTokenPairImage({ baseImg: coin_array_from[0].image, quoteImg: coin_array_to[0].image })
    } else {
      prop.setAddressArray([prop.tokenAddressArr.to, prop.tokenAddressArr.from])
      prop.setTokenPairImage({ baseImg: prop.tokenPairImg.quoteImg, quoteImg: prop.tokenPairImg.baseImg })
      prop.setTokenAddressArr(ar => ({ from: ar.to, to: ar.from }));
    }

    if ((fromChain == 'eth' && prop.toChain == 'bsc') || (fromChain == 'bsc' && prop.toChain == 'eth')) {
      bal = await prop.particularTokenBal(tokenAdressArray[0]);
    } else {
      bal = await prop.particularTokenBal(addressProp[1]);
    }

    prop.setFromTokenBalance(bal)

    const el = document.getElementsByClassName('from-token');
    var event = new Event('change');
    el[0].dispatchEvent(event);
    setTimeout(() => {
      event.target.value = quotePrice;
      prop.valueSetterProp(quotePrice)
      prop.tokenBalances()
    }, 1000);

  }
  const [tokenBal, setTokenBal] = useState(0)
  useEffect(async() => {
   if (prop && prop.availableBal) {
    const decimals=  await getDecimal(fromCoin?.address);
    const val = (prop.availableBal * Math.pow(10, -decimals)).toString()
    const newBal = ( val.indexOf(".") === -1 ?val : val.slice(0, (val.indexOf("."))+6))
    setTokenBal(newBal)
   }
  }, [prop.availableBal]);

  return (
    <main> 
    {(!metamaskprovider && connectClicked) ?  <DetectMetamaskAlert onClose={() => setConnectClicked(false)} /> : <></>}
    
    <div className="hero__content--form">
       {/* <Loader loaded={loaderState}/> */}
      <form action="javascript:void(0)">
        <div className="input-group from-token">
        <DebounceInput
          minLength={1}
          debounceTimeout={500} autoComplete="off" id="inputID" type="number"  onKeyDown={ (evt) => (evt.key === 'e' || evt.key === '-' || evt.key === 'ArrowUp' || evt.key === 'ArrowDown') && evt.preventDefault() }  defaultValue='' placeholder="0" value={ !prop.valueProp.includes('.') && prop.valueProp[0]  === '0' && prop.valueProp.length !== 1? prop.valueProp.replace(/^0+/, '') : prop.valueProp } onChange={(event) => prop.valueSetterProp(event.target.value)}/>
          
          <span className="bSWAP chains" onClick={() => OpenModal('1','chain-from')}>
            <img src= {(fromChain?.toUpperCase() || 'BSC') === 'BSC' ? bnbImg : ethImg} alt="" height='20' />
            {fromChain == 'eth' ? 'ETHEREUM' : 'BSC' } <span className="icon-chevron-down"></span>
          </span>

          <span className="BEP tokens" onClick={() => OpenModal('1', 'tokens')}>
            {tokenPair?.base ? <div className="smtextFix01">
              <img alt='' src={window.location.origin + '/' + prop.tokenPairImg.baseImg} onError={(e)=>{e.target.onerror = null; e.target.src=prop.tokenPairImg.baseImg}} className='jsimg' />
              <span className='jsspan'>{ tokenPair.base }</span>
            </div> : 'Select Token'} 
            <span className="icon-chevron-down"></span>
          </span>

        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}> 
         <p className="bottomtext">
            {prop.valueProp >0 && quotePrice && tokenPair && tokenPair.base  && tokenPair.quote ? (tokenPair.base)+ " Current price : " + (quotePrice/prop.valueProp).toFixed(4) +' '+ tokenPair.quote :'' }
            {/* | $0.105322{" "}
            <span> (+8.73% 24h)</span> */}
              </p>
              <p style={{cursor: 'pointer'}} onClick={async()=>{
                 if (prop.availableBal >0) {
                  const decimals=  await getDecimal(fromCoin?.address);
                  const val = (prop.availableBal * Math.pow(10, -decimals)).toString()
                   prop.valueSetterProp( val.indexOf(".") === -1 ?val : val.slice(0, (val.indexOf("."))+6))
                 }
              }}>
                {tokenPair && tokenPair.base ? 'Available : ' + tokenPair.base : ""}  {prop.availableBal > 0 ? tokenBal + "  " : tokenPair.base ? '0' : ' '}
                {tokenPair?.base ? <></>
                  // (<span className='max-amount' onClick={() => maxWalletValue()}>(Max)</span>) 
                  : null}
              </p>
            </div>

          </div>
          <div className="exchange">
            <a href="#!" onClick={switchTokens}><img src="imgs/changeICO.png" alt="" /> </a>
          </div>
          <div className="input-group to-token">
            <input autoComplete="off" id="inputID1" type="text" placeholder="0" readOnly={true} defaultValue='' value={quotePrice ?? 0} />

            <span className="bSWAP chains" style={{ whiteSpace: 'nowrap' }} onClick={() => OpenModal('2', 'chain-to')}>
              <img src={(prop?.toChain?.toUpperCase() || 'BSC') === 'BSC' ? bnbImg : ethImg} alt="" height='20' />
              <span className='jsspan'> {prop.toChain == 'eth' ? 'ETHEREUM' : 'BSC'}</span> <span className="icon-chevron-down"></span>
            </span>

            <span className="BEP tokens" id='to-token' onClick={() => OpenModal('2', 'tokens')}>
              {tokenPair?.quote
                ?
                <div>
                  <img alt='' src={window.location.origin + '/' + prop.tokenPairImg.quoteImg} onError={(e) => { e.target.onerror = null; e.target.src = prop.tokenPairImg.quoteImg }} className='jsimg' />
                  <span className='jsspan'>{tokenPair.quote}</span>
                </div>
                : 'Select Token'}
              <span className="icon-chevron-down"></span>
            </span>

            <p className="bottomtext">
              {tokenPair && tokenPair.quote && tokenPair.quote.toUpperCase()} ≈ Price Impact: {priceImpact}% <span></span> | Minimum to receive:
              <span>{prop.slippageCalcuation ?? 0}</span> {tokenPair && tokenPair.quote && tokenPair.quote.toUpperCase()}
              {/* | <span>{prop.reward}</span> Degen reward */}
              <i className="fas fa-question-circle" />
              <span className="dummypopup">
                Receive the best price on your trades from multiple aggregators {" "}
              </span>
            </p>

          </div>

          {/* <div className="chainICOBX">
                <span><img src="imgs/chainICO-01.png" alt="" /></span>
                <i className="fas fa-chevron-right"></i>
                <span><img src="imgs/chainICO-02.png" alt="" /></span>
                <i className="fas fa-chevron-right"></i>
                <span><img src="imgs/chainICO-03.png" alt="" /></span>
            </div> */}

          {!meta_wallet
            ? (<div className="connect-wallet blackBG">
              <button type="submit" onClick={() => {
                setConnectClicked(true);
                metamask_connection(localStorage.getItem('account'), 'ahrefClick');
              }}>
                Connect Wallet
              </button>
            </div>)
            : (tokenPair?.base != "" && tokenPair?.base != "" && baseValue > (prop.availableBal * Math.pow(10, -18)) || inSuffLiq || Math.abs(parseFloat(priceImpact)) >= 40 || slippage >= 50) || false
              ? (<div className="connect-wallet">
                <button >
                  {Math.abs(parseFloat(priceImpact)) >= 40
                    ? 'Price Impact Too High'
                    : inSuffLiq ? 'Insufficient Liquidity' : slippage >= 50 ? 'Invalid Slippage' : 'Insufficient Balance'
                  }
                </button>
              </div>)
              : tokenPair?.base == "" || tokenPair?.quote == ""
                ? (<div className="connect-wallet"><button >Please select token</button></div>)
                : tokenPair?.base != "" && tokenPair?.quote != ""
                  ? (<div className="connect-wallet">
                    <button type="submit" onClick={() => checkApprove()}>
                      {allowedAmt >= +prop.valueProp || [TEST_WETH, TEST_WBNB].includes(prop.tokenAddressArr.from) ? 'Swap' : 'Approve & Swap'}
                    </button>
                  </div>)
                  : null
          }
        </form>

        {/* <div  className="infoTXT01">You save $123.54 compared to the current best exchange rate in the market <i className="fas fa-question-circle" /></div> */}

      </div>
    </main>
  );
};
