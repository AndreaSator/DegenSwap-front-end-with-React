import React, { useEffect, useState, useContext } from "react";
import { ETH_USDT, PANCAKE_FACTORY, SUSHISWAP_FACTORY, TEST_WBNB, TEST_WETH, UNISWAP_FACTORY } from '../common/constant';
import {
  useIsFocusVisible,
} from "@material-ui/core";
import { Header } from "../components/Header";
import Web3 from 'web3';
import { Footer } from "../components/Footer";
import { MainCaousel } from "../components/MainCaousel";
import { RightSidemenu } from "../components/RightSidemenu";
import { Ledger } from "../components/Ledger";
import { Loader } from "../components/Loader";
import { useHistory } from "react-router-dom";
import { ConnectWallet, ModalState } from "../components/ConnectWallet";
import { getRate } from '../common/para';
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./../config/theme";
import { GlobalStyles } from "./../config/global";
import {
  sendTransaction,
  get_web3_instance,
  getFees,
  chooseBase,
} from "../service/degen_function";
import { checkMetasmask } from "../service/metamask_function";
import { GetTokenListEth, GetTokenListBsc } from "../service/token_list";
import { coin_array, chain_array, getProductionTokens } from "../service/dummy_data";
import { TradeChart } from "../components/trade-chart";
import {
  bsc_chain,
  CHAINS,
  deployment_env,
  eth_chain,
} from "../common/constant";
import { useSnackbar } from "react-simple-snackbar";
import { isArray, orderBy } from "lodash";
import { CompareTable } from "../components/compare-table";
import MyLoader from "../components/spinner";
import addTokenAbi from "../abi/custom_token_abi.json";
import erc20Abi from "../abi/erc20_abi.json";

import tokendefaultIcon from "../asstes/imgs/defaultIcon.svg";
import AlertModal from "../components/alert-modal";
import { ThemeContext } from "./../contexts/ThemeContext";
import detectEthereumProvider from "@metamask/detect-provider";
import { useOnScreen } from "../hooks";
import { bnbConnectionUrl, createCustomInstance, ethConnectionUrl, getAmountOut, getAmountOutPan, getAmountOutSushi, getAmountOutUni, getImpact, getInchAtAllCosts, inchSwapUrl, inchUsdtAmount, panUsdtAmount, sushiUsdtAmount, uniUsdtAmount } from "../common/functions";
import { getImpactForTesting, getValueForTesting } from "../common/new";

window.$("#connectwalletselect").niceSelect();

let address_array = [];
let tokenSideValue,
  selectedTokenPair,
  ledgerCount = 0;
export const Home = () => {
  const[themeBackground, setThemeBackground]=useState("light");
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [load, setLoad] = useState(false);
  const [count, setCount] = useState(0);
  const history = useHistory();
  const isFocused = useIsFocusVisible();
  // const [theme, setTheme] = useState("light");
  const theme = useContext(ThemeContext);
  // const [degen_price, setDegenPrice] = useState('0');
  const [best_quote, setBestQuote] = useState("0");
  const [value_quote, setValueQuote] = useState("");
  const [newArrayAddress, setaddressArray] = useState([]);
  const [coinPairStatus, setcoinPairStatus] = useState("2");
  const [fromInputValue, setfromInputValue] = useState("");
  const [api_data, setApiData] = useState([]);
  const [gasPrice, setGasPrice] = useState("0");
  const [slippage, setSlippagePrice] = useState(0.5);
  const [loaderState, setLoaderState] = useState(true);
  const [minimumValue, setMinimumValue] = useState("0");
  const [percentCalculate, setPercentCalculate] = useState("0");
  const [fromChain, setFromChain] = useState("bsc");
  const [toChain, setToChain] = useState("eth");
  const [randomKey, setRandomKey] = useState(Math.random());
  const [coinList, setCoinList] = useState([]);
  const [tokenSide, setTokenSide] = useState("");
  const [tokenAddressArr, setTokenAddressArr] = useState({ from: "", to: "" });
  const [showGraph, setShowGraph] = useState(false);
  const [reward, setReward] = useState(0.0);
  const [tokenPair, setTokenPair] = useState({ base: "", quote: "" });
  const [toggletableView, setToggletableView] = useState(false);
  const [toggleModel, setToggleModel] = useState(false);
  const [priceImpact, setPriceImpact] = useState('0.00');

  const [GetTokenListDataEth, setGetTokenListDataEth] = useState([]);
  const [GetTokenListDataBsc, setGetTokenListDataBsc] = useState([]);
  const [dropDownToggle, setDropDownToggle] = useState([]);
  const [customToken, setCustomToken] = useState([]);
  const [contractValue, setContractValue] = useState("");
  const [showAlert, toggleAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [metamaskprovider, setProvider] = useState(null);
  const [fromTokenBal, setFromTokenBal] = useState(0);
  const [binaryStr, setBinaryStr] = useState("");
  const [chainType, setChainType] = useState("from");
  const [tokenPairImg, setTokenPairImg] = useState({
    baseImg: "",
    quoteImg: "",
  });
  const [dexId, setDexId] = useState(0);
  const [dexIdDestination, setDexIdDestination] = useState(0);
  const [prodTokens, setProdTokens] = useState([]);
  const [bscProdTokens, setBscProdTokens] = useState([]);
  const [fromCoin, setFromCoin] = useState({});
  const [toCoin, setToCoin] = useState({});
  const [buttonSeen, lastRef] = useOnScreen({
    threshold: .1
  });
  const [query, setQuery] = useState('');
  const [inSuffLiq, setInSuffLiq] = useState(false);

  const [distribution, setDistribution] = useState([]);
  const [slippageCal, setslippageCal] = useState('');
  const [companyFee, setCompanyFee] = useState('0.1%');
  const [isThreePath, setIsThreePath] = useState(false);

  const [inchTxnData, setInchTxnData] = useState(null);

  const [tokenSearchResult, setTokensearchResult] = useState(true);
  const [showWarning, setShowWarning] = useState(false)
  const [fetchLedger, setFetchLedger] = useState(false);
  const [aboutPopup, setAboutPopUp] = useState(false);
  const [clonePopup, setClonePopup] = useState(false);
  const [HowitworkPopup, setHowitworkPopup] = useState(false);
  const [DegenOverviewPopup, setDegenOverviewPopup] = useState(false);
  const [ReimbursementPopup, setReimbursementPopup] = useState(false);
  const [tokenAlreadyExist, setTokenAlreadyExist] = useState(false);
  const [fromCommonBases, setFromCommonBases] = useState([]);
  const [toCommonBases, setToCommonBases] = useState([]);

  let modal_value,
    customGasPrice,
    invironment = deployment_env;
  let toggleTableUI;
  let showGraphStatus;
  let tknList = {
    dropDownToggle: [],
    prodToken: [],
    bscProdTokens: []
  }

  const detectMetamask = async () => {
    detectEthereumProvider().then((pro) => {
      setProvider(pro);
    });
  };
  useEffect(() => {
    setTimeout(() => {
      setRandomKey(Math.random())
      var vid = document.getElementById("myVideo");
      vid.playbackRate = 0.5;
    }, 2000);
    
  }, []);
  useEffect(() => {
    // setfromInputValue("");
    if (fromInputValue >=0) {
      callQuotePrice(fromInputValue)
    }
  }, [toChain, fromChain, tokenPair.quote, tokenPair.base]);

  useEffect(() => {
    // if(!window.ethereum){
    //   window.web3 = new Web3(new Web3.providers.HttpProvider(fromChain === 'bsc' ? bnbConnectionUrl : ethConnectionUrl));
    // }        
  }, [fromChain]);


  const resetOnSuccess = () => {
    setTokenPair({ base: "", quote: "" })
    getTokenBalances();
    setLoaderState(true);
    setfromInputValue("");
    setFromTokenBal(0);
    setslippageCal('');
  }



  useEffect(() => {
    let balInterval = setInterval(() => {
      if (MergeArray && MergeArray.length) {
        getTokenBalances();
        clearInterval(balInterval);
      }
    }, 1000);
    return () => {
      clearInterval(balInterval);
    };
  }, [fromChain]);

  useEffect(() => {
    if (process.env.REACT_APP_MODE === 'production') {
      getProductionTokens(fromChain).then(t => {
        setProdTokens(t);
        setFromCommonBases(chooseBase(fromChain).map(b => t.find(e => e.symbol === b)));
      });
      getProductionTokens(toChain, 'from').then(t => {
        setBscProdTokens(t);
        setToCommonBases(chooseBase(toChain).map(b => t.find(e => e.symbol === b)));
      });
    }
  }, [fromChain, toChain, randomKey]);

  useEffect(() => {
    console.log({ from: fromCommonBases[0], to: toCommonBases[0] });
  }, [fromCommonBases, toCommonBases]);

  useEffect(() => {
    if (process.env.REACT_APP_MODE === 'production' && buttonSeen && prodTokens.length > dropDownToggle.length) {
      setDropDownToggle((chainType === 'from' ? prodTokens : bscProdTokens).slice(0, (dropDownToggle.length || 0) + 30));
    };
  }, [buttonSeen, prodTokens, dropDownToggle, bscProdTokens, chainType]);

  useEffect(() => {
    setTimeout(() => {
      window.$(
        ".owl-carousel .owl-nav button.owl-next span"
      ).html = `<i class="fas fa-chevron-right"></i>`;
      window.$(
        ".owl-carousel .owl-nav button.owl-prev"
      ).html = `<i class="fas fa-chevron-left"></i>`;
      document.body.onclick = (event) => {
        if (
          !(
            event &&
            event.target &&
            event.target.classList.contains('bg_main')
          )
        ) {
          window.$(".right-sidemenu").removeClass("slide");
          window.$('#btn-viewtable').removeClass('active')
          document.documentElement.style.overflow = "visible";
          document.documentElement.style.paddingRight = "0px";
          setShowGraph(false);
          setToggletableView(false);
        }
      };

      //   document.body.onclick = (event) => {
      //     if(!(event && event.target && event.target.classList.contains('bg_main'))){
      //       // setTimeout(() => {
      //       //   toggleTable();
      //       // }, 100);
      //     window.$(".right-sidemenu").removeClass("slide");
      //     window.$("#btn-viewtable").removeClass('active')
      //     document.documentElement.style.overflow = "visible";
      //     setShowGraph(false);
      //     setToggletableView(false);
      //   }
      // }

      window.$(".right-sidemenu").on("click", (e) => {
        if (e.target.id === "mode") {
          theme.toggleTheme();
        }

        e.stopPropagation();
      });
    }, 100);
  }, []);

  useEffect(() => {
    detectMetamask();
    setTimeout(() => {
      checkMetasmask();
      // let activeGraph = 0;
      const chartButton = window.$("#btn-chart");
      chartButton.on("click", function () {
        setTimeout(() => {
          toggleGraph();
        }, 100);
        window.$(this).toggleClass("active")
        // if (activeGraph === 0) {
        //   window.$(this).addClass("active");
        //   activeGraph = 1;
        // } else {
        //   window.$(this).removeClass("active");
        //   activeGraph = 0;
        // }
        // if (window.$(this).hasClass("active")) {
        //   window.$(this).removeClass("active");
        // } else {
        //   window.$(this).addClass("active");
        // }
      });

      const viewTableButton = window.$("#btn-viewtable");
      let activeTable = 0;
      viewTableButton.on("click", function () {
        setTimeout(() => {
          toggleTable();
        }, 100);

        if (activeTable === 0) {
          window.$(this).addClass("active");
          activeTable = 1;
        } else {
          window.$(this).removeClass("active");
          activeTable = 0;
        }
      });


    }, 100);

    GetTokenListEth().then((tokens) => {
      setGetTokenListDataEth(tokens);
    });
    GetTokenListBsc().then((tokens) => {
      setGetTokenListDataBsc(tokens);
    });
    swapDropdown("");
    getRightMenu();
    connectWallet();
    slideAbout();
    slideCommunity();
    slideLibrary();
    addActiveValueGas();
    slideValue();
    addActiveValue();
    getTokens();
    getChainList();
    showOptions();
    // addCtive();
    toggleBtn();
    showGirdList();
    dropdownTable();
    searchInput();
    searchChainInput();
    showpopup();
    dropdownView2();
    showLogos();
    addActive();

    const carouselWidth = window.$(".hero__content--logos").width();
    window.$(".owl-carousel").owlCarousel({
      loop: false,
      margin: 0,
      nav: true,
      dots: false,
      items: parseInt(parseInt(carouselWidth) / 50),

    });
    const intervalSub = setInterval(() => {
      if (metamaskprovider) {
        setFromChain(getDefaultChain());
        setToChain(getDefaultChain());
      }
      if (fromChain && toChain) {
        clearInterval(intervalSub);
      }
    }, 1000);

    // get_Degen_Price().then((res) => {
    //   const price = (res / Math.pow(10,18)).toFixed(2);
    //   setDegenPrice(price);
    // });
  }, [metamaskprovider]);

  const getDefaultChain = () => {
    // if (window.ethereum && window?.ethereum?.chainId) {
    if (
      window?.ethereum?.chainId == CHAINS.Ropsten ||
      window?.ethereum?.chainId == CHAINS.Mainnet
    ) {
      return "eth";
    } else if (
      window?.ethereum?.chainId == CHAINS.BSCTESTNET ||
      window?.ethereum?.chainId == CHAINS.BSCMAINNET
    ) {
      return "bsc";
    }
    // }
  };
  let MergeArray = [];
  if (process.env.REACT_APP_MODE === 'production') MergeArray = [];
  else MergeArray = coin_array;

  useEffect(() => {
    const maxValue = +value_quote;
    if (!maxValue || !Number(slippage)) return;
    setslippageCal((maxValue - (maxValue * slippage / 100)).toFixed(5));
    setMinimumValue((maxValue - (maxValue * slippage / 100)));
    setPercentCalculate((maxValue * slippage / 100).toFixed(5));
  }, [slippage, value_quote]);
  const addActive = () => {
    let logoBrand = document.querySelectorAll(".five-logos > div");

    logoBrand.forEach((item) => {
      item.onclick = function () {
        for (var i = 0; i < logoBrand.length; i++) {
          logoBrand[i].classList.remove("active");
        }

        item.classList.add("active");
      };
    });
  };
  const showLogos = () => {
    var imgs = document.querySelectorAll(".hero__content--logos a img");

    var txts = document.querySelectorAll(".hero__content--logos a p");

    imgs.forEach((item, index) => {
      item.onclick = function () {
        if (window.matchMedia("(max-width: 600px)").matches) {
          for (var i = 0; i < imgs.length; i++) {
            txts[i].classList.remove("show");
          }
          if (txts[index].classList.contains("show")) {
            txts[index].classList.remove("show");
          } else {
            txts[index].classList.add("show");
          }
        }
      };
    });
  };
  const dropdownView2 = () => {
    var btndrop = document.querySelector(".btn-drop");

    var dropList = document.querySelector(".dropdownrow");

    btndrop.onclick = function () {
      if (dropList.classList.contains("show")) {
        dropList.classList.remove("show");
        document.querySelectorAll(".row3").forEach((item) => {
          item.style.height = "65px";
          item.style.alignItems = "center";
          if (window.matchMedia("(max-width: 500px)").matches) {
            item.style.height = "80px";
          }
          if (window.matchMedia("(max-width: 400px)").matches) {
            item.style.height = "90px";
          }
        });

        btndrop.classList.remove("rotate");
      } else {
        dropList.classList.add("show");
        document.querySelectorAll(".row3").forEach((item) => {
          item.style.height = "250px";
          item.style.alignItems = "flex-start";
          if (window.matchMedia("(max-width: 600px)").matches) {
            item.style.height = "450px";
          }
        });
        btndrop.classList.add("rotate");
      }
    };
  };
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
  const searchInput = () => {
    // let tknss= tknList;
    var tokenInput = document.querySelector(".popup .wrap .inputgroup input");
    var chainInput = document.querySelector(".chain-popup .chain-wrap .inputgroup input");

    var liItms = document.querySelectorAll(".popup .wrap .tokenlist ul li");

    var reqTxt = document.querySelectorAll(
      ".popup .wrap .tokenlist ul li span:nth-child(2)"
    );

    function tokenFilter() {
      let input, filter, ul, li, span, i, txtValue;
      input = document.querySelector(".popup .wrap .inputgroup input");
      filter = input.value.toUpperCase();
      setQuery(filter);
      if (input && input.value.startsWith('0x')) {

      } else {

        ul = document.querySelector(".popup .wrap .tokenlist ul");
        li = ul.getElementsByTagName("li");
        // let result = true;
        for (i = 0; i < li.length; i++) {
          span = li[i].getElementsByTagName("span")[0];
          txtValue = span.textContent || span.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
            // result = true;
          } else {
            li[i].style.display = "none";
            // result =false;
          }
        }
        setTokensearchResult(li.length == 0 ? false : true)
      }
    }

    function chainFilter() {
      var input, filter, ul, li, span, i, txtValue;
      input = document.querySelector(".chain-popup .chain-wrap .inputgroup input");
      filter = input.value.toUpperCase();
      ul = document.querySelector(".chain-popup .chain-wrap .chain-list ul");
      li = ul.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }

    tokenInput.addEventListener("keyup", tokenFilter);
    chainInput.addEventListener("keyup", chainFilter);

  };

  const searchChainInput = () => {
    var myInput = document.querySelector(
      ".chain-popup .chain-wrap .inputgroup input"
    );

    var liItms = document.querySelectorAll(
      ".chain-popup .chain-wrap .chain-list ul li"
    );

    var reqTxt = document.querySelectorAll(
      ".popup .wrap .tokenlist ul li span:nth-child(2)"
    );

    function myFunction() {
      var input, filter, ul, li, span, i, txtValue;
      input = document.querySelector(".popup .wrap .inputgroup input");
      filter = input.value.toUpperCase();
      ul = document.querySelector(".popup .wrap .tokenlist ul");
      li = ul.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
        } else {
          li[i].style.display = "none";
        }
      }
    }

    // myInput.addEventListener("keyup", myFunction);
  };
  const dropdownTable = () => {
    var icondropDown = document.querySelector(".icondropdown");

    var list = document.querySelector(".dropdown");

    icondropDown.onclick = function () {
      if (!list.classList.contains("show")) {
        list.classList.add("show");

        icondropDown.classList.add("rotate");
      } else {
        list.classList.remove("show");
        icondropDown.classList.remove("rotate");
      }
    };
  };
  const showGirdList = () => {
    var gridIcon = document.querySelector(".listView");
    var listIcon = document.querySelector(".gridView");

    var listDiv = document.querySelector(".swap__ledger__container");

    var gridDiv = document.querySelector(".swap__ledger__container2");

    gridIcon.onclick = function () {
      listDiv.classList.add("hide");

      gridDiv.classList.add("show");

      this.style.color = "#fd0352";
      listIcon.style.color = "#aaa";
    };

    listIcon.onclick = function () {
      listDiv.classList.remove("hide");

      gridDiv.classList.remove("show");

      this.style.color = "#fd0352";

      gridIcon.style.color = "#aaa";
    };
  };
  const toggleBtn = () => {
    var onSpan = document.querySelectorAll(".onspan");
    var offSpan = document.querySelectorAll(".offspan");

    var inputOn = document.querySelectorAll(".checkon");

    var inputOff = document.querySelectorAll(".checkoff");

    onSpan.forEach((item, index) => {
      item.onclick = function () {
        inputOn[index].checked = true;
        inputOff[index].checked = false;
        item.style.backgroundColor = "#29f80c";
        offSpan[index].style.background = "none";
      };
    });
    offSpan.forEach((item, index) => {
      item.onclick = function () {
        inputOn[index].checked = false;
        inputOff[index].checked = true;
        item.style.backgroundColor = "#ababab";
        onSpan[index].style.background = "none";
      };
    });
  };
  // const addCtive = () => {
  //   let listItems = document.querySelectorAll(".list-nav1 > li");
  //   listItems.forEach((item) => {
  //     item.onmouseenter = () => {
  //       for (var i = 0; i < listItems.length; i++) {
  //         listItems[i].classList.remove("active");
  //       }

  //       item.classList.add("active");
  //     };
  //   });
  // };
  const showOptions = () => {
    var settingIcon = document.querySelector(".setting");
    var opts = document.querySelector(".options");

    settingIcon.onclick = function () {
      if (!opts.classList.contains("show")) {
        opts.classList.add("show");
      } else {
        opts.classList.remove("show");
      }
    };

    settingIcon.onmouseenter = function () {
      opts.classList.add("show");
    };

    //closing popup

    document.querySelector(".hero__content").onclick = function () {
      opts.classList.remove("show");
    };
    document.querySelector(".header").onclick = function (e) {
      if (!e.target.classList.contains("setting")) {
        opts.classList.remove("show");
      }
    };

    opts.onclick = function (e) {
      e.stopPropagation();
    };
  };
  const getTokens = () => {
    //  const myInterval = setInterval(() => {
    setLoaderState(false);
    localStorage.removeItem("addressArray");
    // setTimeout(function(){
    setLoaderState(true);
    var tokens = document.querySelectorAll(".tokens");
    var popup = document.querySelector(".popup");
    // var closeBtn = document.querySelector(".close");
    var closeBtnToken = document.querySelector('.close-token');


    closeBtnToken.onclick = function () {
      setQuery('');
      document.querySelector(".popup .wrap .inputgroup input").value = '';
      popup.classList.remove("show");
      document.documentElement.style.overflow = "visible";
    };

    popup.onclick = function (e) {
      if (e.target.classList.contains("popup")) {
        popup.classList.remove("show");
        document.documentElement.style.overflow = "visible";
      }
    };
    //work area
    tokens.forEach((item) => {
      item.onclick = function () {
        popup.classList.add("show");
        document.documentElement.style.overflow = "hidden";
        var listItems = document.querySelectorAll(
          ".popup .wrap .tokenlist ul li"
        );
        listItems.forEach((listelement) => {
          listelement.onclick = function (e) {

            popup.classList.remove("show");
            document.documentElement.style.overflow = "visible";
          };
        });
      };
    });
  };
  const getChainList = () => {
    setLoaderState(false);
    localStorage.removeItem("addressArray");
    setTimeout(function () {
      setLoaderState(true);
      var chainList = document.querySelectorAll(".chains");
      var popup = document.querySelector(".chain-popup");
      var closeBtn = document.querySelector(".chain-close");
      var listItems = document.querySelectorAll(
        ".chain-popup .chain-wrap .chain-list ul li"
      );
      closeBtn.onclick = function () {
        popup.classList.remove("show");
        document.documentElement.style.overflow = "visible";
      };
      popup.onclick = function (e) {
        if (e.target.classList.contains("chain-popup")) {
          popup.classList.remove("show");
          document.documentElement.style.overflow = "visible";
        }
      };
      chainList.forEach((item) => {
        item.onclick = function () {
          popup.classList.add("show");
          document.documentElement.style.overflow = "hidden";
          listItems.forEach((listelement) => {
            listelement.onclick = function (e) {
              // for (var i = 0; i < listItems.length; i++) {
              //   listItems[i].classList.remove("active");
              // }
              // this.classList.add("active");

              // setTimeout(() => {
              if (
                listelement.firstElementChild.nextElementSibling.textContent ==
                eth_chain &&
                tokenSideValue == "1" &&
                window?.ethereum?.chainId != "0x3"
              ) {
                toggleAlert(true);
                setAlertText("switch to Ethereum chain ");
                setTimeout(() => {
                  // setFromChain("bsc");
                }, 1000);
                return;
              } else if (
                listelement.firstElementChild.nextElementSibling.textContent ==
                bsc_chain &&
                tokenSideValue == "1" &&
                window?.ethereum?.chainId != "0x61"
              ) {

                toggleAlert(true);
                setAlertText("switch to Binance chain");

                setTimeout(() => {
                  // setFromChain("eth");
                }, 1000);
                return;
              }

              popup.classList.remove("show");
              document.documentElement.style.overflow = "visible";
              // getRewards();
              // }, 2000);
            };
          });
        };
      });
    }, 5000);
  };
  const addActiveValue = () => {
    let spanValue = document.querySelectorAll(
      ".slippage-tolerance .selectvalue > span"
    );

    let getValue = document.querySelector(".slippage-tolerance .getvalue");

    let myInput = document.querySelector(
      ".slippage-tolerance .values .custom-values input"
    );

    spanValue.forEach((item) => {
      item.onclick = function () {
        for (var i = 0; i < spanValue.length; i++) {
          spanValue[i].classList.remove("active");
        }

        item.classList.add("active");

        getValue.textContent = item.textContent || "";
        const slippage = item.textContent.split("%");
        setSlippagePrice(parseFloat(slippage));
      };
    });

    myInput.oninput = function () {
      if (myInput.value !== "") {
        getValue.textContent = myInput.value + "%";
      } else {
        getValue.textContent = document.querySelector(
          ".selectvalue > span.active"
        ).textContent;
      }
      setSlippagePrice(myInput.value);
    };
  };
  const slideValue = () => {
    let chevron = document.querySelectorAll(".slidechevron");

    let valueList = document.querySelectorAll(".values");

    let show = false;

    chevron.forEach((item, index) => {
      item.onclick = function () {
        if (!valueList[index].classList.contains("slide")) {
          valueList[index].classList.add("slide");
          item.classList.add("rotate");
          show = true;
        } else {
          valueList[index].classList.remove("slide");
          item.classList.remove("rotate");
          show = false;
        }
      };
    });
  };
  const addActiveValueGas = () => {
    let spanValue = document.querySelectorAll(".Gas-price .selectvalue > span");

    let getValue = document.querySelector(".Gas-price .getvalue");

    let myInput = document.querySelector(
      ".Gas-price .values .custom-values input"
    );

    spanValue.forEach((item) => {
      item.onclick = function () {
        for (var i = 0; i < spanValue.length; i++) {
          spanValue[i].classList.remove("active");
        }

        item.classList.add("active");

        getValue.textContent =
          item.textContent.split(" ").reverse().join(" ") + " GEWI";
        const gasName = item.textContent.split(" ");
        setGasPrice(gasName[0]);
        customGasPrice = gasName[0];
      };
    });

    myInput.oninput = function () {
      if (myInput.value !== "") {
        getValue.textContent = myInput.value;
        setGasPrice(myInput.value);
        customGasPrice = myInput.value;
      } else {
        getValue.textContent = document.querySelector(
          ".Gas-price .selectvalue > span.active"
        ).textContent;
      }
    };
  };

  const slideLibrary = () => {
    let slidelibrary = document.querySelector(".slidelibrary");

    let dropdownLibrary = document.querySelector(".dropdownlibrary");

    let show = false;

    function slide() {
      if (!show) {
        dropdownLibrary.classList.add("slide");
        slidelibrary.firstElementChild.classList.add("rotate");

        show = true;
      } else {
        dropdownLibrary.classList.remove("slide");
        slidelibrary.firstElementChild.classList.remove("rotate");

        show = false;
      }
    }

    slidelibrary.addEventListener("click", slide);
  };
  const slideCommunity = () => {
    let communityslide = document.querySelector(".communityslide");

    let dropdowncommuity = document.querySelector(".dropdowncommuity");

    let show = false;

    function slide() {
      if (!show) {
        dropdowncommuity.classList.add("slide");
        communityslide.firstElementChild.classList.add("rotate");

        show = true;
      } else {
        dropdowncommuity.classList.remove("slide");
        communityslide.firstElementChild.classList.remove("rotate");

        show = false;
      }
    }

    communityslide.addEventListener("click", slide);
  };

  const slideAbout = () => {
    let Aboutslide = document.querySelector(".slideAbout");

    let dropdownAbout = document.querySelector(".dropdownAbout");

    let show = false;

    function slide() {
      if (!show) {
        dropdownAbout.classList.add("slide");
        Aboutslide.firstElementChild.classList.add("rotate");

        show = true;
      } else {
        dropdownAbout.classList.remove("slide");
        Aboutslide.firstElementChild.classList.remove("rotate");

        show = false;
      }
    }

    Aboutslide.addEventListener("click", slide);
  };

  const getRightMenu = () => {
    let btntomenu = document.querySelectorAll(".btntomenu");

    let mainBtn = document.querySelector(".mainBtn");
    let menuRight = document.querySelector(".right-sidemenu");

    btntomenu.forEach((item) => {
      item.onclick = function (event) {
        event.stopPropagation();
        menuRight.classList.add("slide");

        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.paddingRight = "17px";
      };
    });

    mainBtn.onclick = function () {
      document.documentElement.style.overflow = "visible";
      setToggletableView(false);
      setShowGraph(false);
      menuRight.classList.remove("slide");
      window.$('#btn-viewtable').removeClass('active');
    };
  };

  const connectWallet = () => {
    let connectwallet = document.querySelector(".connectwallet");

    let login = document.querySelector(".login");

    let dotspan = document.querySelector(".dotspan");

    let connectpopup = document.querySelector(".connectpopup");

    let presalesmartswap = document.querySelector(".presalesmartswap");

    connectwallet.onclick = function () {
      connectpopup.classList.add("show");

      // login.classList.add("show");

      setTimeout(function () {
        connectpopup.classList.remove("show");
        connectwallet.classList.add("hide");

        //   login.classList.add("show");

        presalesmartswap.style.display = "none";
        dotspan.classList.add("active");
      }, 1200);
    };
  };

  const swapDropdown = (clickedFrom = "") => {
    let pageY;
    let closeCaret = document.querySelector(" .swap__ledger__nav i");
    if (typeof closeCaret != "undefined" && closeCaret != null) {
      let linkLegder = closeCaret.previousElementSibling;
      let parentCaret = closeCaret.parentElement;
      let contSec = closeCaret.parentElement.nextElementSibling;
      let showViews = document.querySelector(".showviews");
      let container2 = document.querySelector(".swap__ledger__container2");
      let container1 = document.querySelector(".swap__ledger__container");
      let listIcon = document.querySelector(".listView");
      let gridIcon = document.querySelector(".gridView");
      let ledgerCaret = document.querySelector("#ledger-caret");
      ledgerCaret.onclick = () => {
        slide();
      };
      // closeCaret.addEventListener("click", slide);
      if (clickedFrom == "sidebar") {
        slide();
        let menuRight = document.querySelector(".right-sidemenu");
        menuRight.classList.remove("slide");
      }
      function slide() {
        if (!contSec.classList.contains("slide")) {
          parentCaret.style.marginBottom = "2.5rem";
          contSec.classList.remove("true");
          contSec.classList.add("slide");
          closeCaret.classList.add("rotate");

          document.documentElement.style.scrollBehavior = "smooth";
          showViews.classList.add("show");
          gridIcon.style.color = "#fd0352";
          listIcon.style.color = "#aaa";
        } else {
          parentCaret.style.marginBottom = "0";
          contSec.classList.remove("slide");
          closeCaret.classList.remove("rotate");
          container2.classList.remove("show");
          container1.classList.remove("hide");
          document.documentElement.style.scrollBehavior = "auto";
          showViews.classList.remove("show");
          listIcon.style.color = "#aaa";
        }
      }
      return true;
    }
  };
  const onLoader = (load) => {
    setLoad(load);
    setTimeout(() => {
      // alert(load)
      setLoad(false);
      history.push("/notfound");
    }, 5000);
  };

  // const toggleTheme = () => {
  //     // if the theme is not light, then set it to dark
  //     if (theme === 'light') {

  //         // setTheme('dark');
  //         // otherwise, it should be light
  //     } else {
  //         // setTheme('light');
  //     }
  // }
  const setDefultValue = () => {
    setPercentCalculate("0");
    setMinimumValue(Math.ceil(0));
    setValueQuote("");
    // setfromInputValue('');
  };

  const chainChangeHandler = (item) => {
    setDefultValue();
    // console.log(item, tokenSide);
    var popup = document.querySelector(".popup");
    popup.classList.remove("show");
    if (tokenSide == "1") {
      // setFromChain(item.chain);
    } else if (tokenSide == "2") {
      setToChain(item.chain);

      let node = document.querySelectorAll("#to-token .jsspan");
      if (node && node.length) {
        node[0].innerText = "Select Token";
      }
      setTokenPair((tp) => ({ base: tp.base, quote: "" }));
      setTokenAddressArr((ta) => ({ to: "", from: ta.from }));
      selectedTokenPair = { base: item.symbol, quote: "" };
    }
    // const coinListByChain = MergeArray.filter((e) => e.chain === item.chain);
    // setDropDownToggle(coinListByChain);

    setTimeout(() => {
      callQuotePrice();
    }, 1000);
  };

  const CoinValue = async (item) => {
    setQuery('');
    document.querySelector(".popup .wrap .inputgroup input").value = '';
    if (item.address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
      item.address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    } else if (item.address === '0xxxxxxxxxx') {
      item.address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    };

    setDefultValue();
    var popup = document.querySelector(".popup");
    popup.classList.remove("show");

    if (tokenSide == "1") {
      setFromCoin(item);
      setTokenPair((tp) => ({ base: item.symbol, quote: tp.quote }));
      setTokenAddressArr((ta) => ({ from: item.address, to: ta.to }));
      setTokenPairImg((ti) => ({ baseImg: item.image, quoteImg: ti.quoteImg }));
      selectedTokenPair = { base: item.symbol, quote: tokenPair.quote };
      try {

        const bal = await getTokenBalance(item.address);
        setFromTokenBal(bal);

      } catch (error) {
        setFromTokenBal(0);
      }
      
    } else if (tokenSide == "2") {
      console.log(item);
      setToCoin(item);

      setTokenPair((tp) => ({ base: tp.base, quote: item.symbol }));
      setTokenAddressArr((ta) => ({ to: item.address, from: ta.from }));
      selectedTokenPair = { base: item.symbol, quote: tokenPair.quote };
      setTokenPairImg((ti) => ({ baseImg: ti.baseImg, quoteImg: item.image }));
    }

    let checking;
    if (tokenSide == "1") {
      if (localStorage.getItem("addressArray") !== null) {
        checking = localStorage.getItem("addressArray");
        address_array = checking.split(",");
        if (address_array.length > 1) {
          address_array.shift();
          address_array.unshift(item.address);
        } else {
          address_array.push(item.address);
        }
      } else {
        address_array.push(item.address);
      }
    } else {
      if (localStorage.getItem("addressArray") !== null) {
        checking = localStorage.getItem("addressArray");
        address_array = checking.split(",");
        if (address_array.length > 1) {
          address_array.pop();
          address_array.push(item.address);
        } else {
          address_array.push(item.address);
        }
      } else {
        address_array.push(item.address);
      }
    }

    if (address_array.length == 2) {
      localStorage.removeItem("addressArray");
      setaddressArray(address_array);

      localStorage.setItem("addressArray", address_array);
      // const fromName =  coinList.find(x => x.address == address_array[0]).name;
      // const toName = coinList.find(y => y.address == address_array[1]).name;
      // if(fromName == 'ETH' && toName != 'ETH')
      // {
      //   setcoinPairStatus('0');
      // }
      // else if(fromName != 'ETH' && toName == 'ETH')
      // {
      //   setcoinPairStatus('1');
      // }
      // else if(fromName != 'ETH' && toName != 'ETH')
      // {
      //   setcoinPairStatus('2');
      // }
    }
    setTimeout(() => {
      callQuotePrice();
    }, 1000);
  };

  const GetModalState = (type, ddlType) => {

    setTokenSide(type);
    if (ddlType.includes("tokens")) setChainType(type === "1" ? "from" : "to");
    tokenSideValue = type;
    let coinListByChain = [];
    if (type == "1" && ddlType == "tokens") {
      coinListByChain = MergeArray.filter((e) => e.chain === fromChain);
      let sortedList = orderBy(coinListByChain, ["balance"], ["desc"]);
      setDropDownToggle(sortedList);
    } else if (type == "2" && ddlType == "tokens") {
      coinListByChain = MergeArray.filter((e) => e.chain === toChain);
      coinListByChain.forEach((e) => e.balance = 0);
      let sortedList = orderBy(coinListByChain, ["balance"], ["desc"]);
      setDropDownToggle(sortedList);
    }
  };
  const changeChainHandlerfromHeader = (e) => {
    const chain = e.target.value;
    if (chainType !== "from") setToChain(chain);
    if (
      chain.toUpperCase() == eth_chain &&
      tokenSideValue == "1" &&
      window?.ethereum?.chainId != CHAINS.Ropsten
    ) {
      e.stopPropagation();
      toggleAlert(true);
      setAlertText("switch to Ethereum chain");
      return;
    } else if (
      chain.toUpperCase() == bsc_chain &&
      tokenSideValue == "1" &&
      window?.ethereum?.chainId != CHAINS.BSCTESTNET
    ) {
      e.stopPropagation();
      // openSnackbar('Please switch to BSC Testnet ');
      toggleAlert(true);
      setAlertText("switch to Binance chain ");
      return;
    } else {
      setLoaderState(false);
      const coinListByChain = MergeArray.filter((e) => e.chain === chain);
      setDropDownToggle(coinListByChain);
      setLoaderState(true);
    }
  };

  const GetGasPrice = (value) => {
    //  alert(value);
  };
  const toggleGraph = () => {
    if (selectedTokenPair && selectedTokenPair.base) {
      showGraphStatus = showGraphStatus ? false : true;
      setShowGraph(showGraphStatus);
      setLoaderState(true);
    } else {
      openSnackbar("Select both Token first");
      window.$("#btn-chart").removeClass("active");
    }
  };
  const toggleTable = () => {
    const viewTableButton = window.$("#btn-viewtable");
    let ele = document.getElementById("inputID");
    if (selectedTokenPair && selectedTokenPair.base) {
      toggleTableUI = toggleTableUI ? false : true;
      if (ele && ele.value && Number(ele.value) >= 0) {
        setToggletableView(toggleTableUI);
        setLoaderState(true);
        // }
      } else {
        viewTableButton.removeClass("active");
        openSnackbar("Please enter amount");
      }
    } else {
      viewTableButton.removeClass("active");
      openSnackbar("Select both Token first");
    }
  };

  const callQuotePrice = async (inputValue = "") => {
    if (fromChain == undefined || fromChain == null || fromChain == "") {
    } else if (toChain == undefined || toChain == null || toChain == "") {
    } else if (
      !tokenAddressArr ||
      tokenAddressArr.from == "" ||
      tokenAddressArr.from == null
    ) {
    } else if (
      !tokenAddressArr ||
      tokenAddressArr.to == "" ||
      tokenAddressArr.to == null
    ) {
    } else {


      if (inputValue) {
        getFees(fromChain, tokenAddressArr.from, inputValue, (fromChain === 'bsc' ? window?.lisenceData?.bsc : window?.lisenceData?.eth) || '0x0000000000000000000000000000000000000000').then(dataFee => {
          setCompanyFee(((dataFee.companyFeeRate) / 100 || 0) + "%")
        }).catch(e => {
          setCompanyFee('0%');
          setPriceImpact('0.00');
        });

      } else {
        setCompanyFee('0%');
        setPriceImpact('0.00');
      }
      
      if(!Number(inputValue)) return;
      console.log({ inputValue, stat: 'Calling api again' })
      if(fromChain === toChain){
        
        if(fromChain !== 'bsc'){
          let amtUni, amtSushi, amtInch;
          if(inputValue){
            try{
              amtUni = await getAmountOutUni({
                fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, amount: inputValue
              });
            } catch (e) {
              amtUni = ['0', '0'];
            }
            try {
              amtSushi = await getAmountOutSushi({
                fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, amount: inputValue
              });
            } catch (e) {
              amtSushi = ['0', '0'];
            }
            try{
              amtInch = await getInchAtAllCosts({
                fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, amount: inputValue
              });
            }catch(e){
              amtInch = ['0', '0'];
            }
            console.log({ amtInch, amtSushi, amtUni })
            const maxValue = Math.max(+amtSushi[0], +amtUni[0], +amtInch[0]);
            const impact = await getImpact(tokenAddressArr.from, tokenAddressArr.to, inputValue, maxValue, maxValue !== +amtSushi[0] ? UNISWAP_FACTORY : SUSHISWAP_FACTORY);
            console.log(impact,'impact value');
            setPriceImpact(impact.toFixed(4));
            setMinimumValue((maxValue - (maxValue * slippage / 100)));
            setslippageCal((maxValue - (maxValue * slippage / 100)).toFixed(5));
            setPercentCalculate((maxValue * slippage / 100).toFixed(5));
            setValueQuote(+maxValue === 0 ? '0' : maxValue.toFixed(5));
            setIsThreePath(amtUni[2]);
            setInSuffLiq(+amtUni[0] === 0 && +amtSushi[0] === 0);
            setDexId(maxValue === +amtUni[0] ? 0 : 1);

            if(maxValue === amtInch[0]){
              const url = await inchSwapUrl({ fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, amount: inputValue, slippage });
              try{
                const response = await fetch(url);
                const data = await response.json();
                setInchTxnData(data.tx);
              }catch(e){
                setInchTxnData(null);
              }
            }else setInchTxnData(null);
          }
        } else {
          let amtPan;
          if(inputValue){
            try{
              if(window.ethereum){
                amtPan = await getAmountOutPan({
                  fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, amount: inputValue
                });
              }else amtPan = await getValueForTesting({ amount: inputValue, fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to }); 
            }catch(e){
              amtPan = ['0', '0'];
            };

            const maxValue = +amtPan[0];
            let impact;
            if(window.ethereum) impact = await getImpact(tokenAddressArr.from, tokenAddressArr.to, inputValue, maxValue, PANCAKE_FACTORY);
            else impact = await getImpactForTesting(tokenAddressArr.from, tokenAddressArr.to, inputValue, maxValue, PANCAKE_FACTORY);
            console.log(impact,'impact value');
            setPriceImpact(impact.toFixed(4));
            setslippageCal((maxValue - (maxValue * slippage / 100)).toFixed(5));
            setMinimumValue((maxValue - (maxValue * slippage / 100)));
            setPercentCalculate((maxValue * slippage / 100).toFixed(5));
            setValueQuote(+maxValue === 0 ? '0' : maxValue.toFixed(5));
            setIsThreePath(amtPan[2]);
            setInSuffLiq(+amtPan[0] === 0);
            setDexId(0);
          }
        };

      }else{
        
        
        if(fromChain === 'eth'){
          let uniTokenToUsdt, sushiTokenToUsdt, inchTokenToUsdt, panUsdtToToken;
          try{
            uniTokenToUsdt = await uniUsdtAmount({
              otherToken: tokenAddressArr.from, usdtSide: 'to', amount: inputValue
            });
          } catch (e) {
            uniTokenToUsdt = ['0', '0'];
          }
          try {
            sushiTokenToUsdt = await sushiUsdtAmount({
              otherToken: tokenAddressArr.from, usdtSide: 'to', amount: inputValue
            });
          } catch (e) {
            sushiTokenToUsdt = ['0', '0'];
          };
          try{
            inchTokenToUsdt = await inchUsdtAmount({
              otherToken: tokenAddressArr.from, usdtSide: 'to', amount: inputValue
            });
          }catch(e){
            inchTokenToUsdt = ['0', '0'];
          };
          const isUsingUni = +uniTokenToUsdt[0] > +sushiTokenToUsdt[0];

          try {
            panUsdtToToken = await panUsdtAmount({
              otherToken: tokenAddressArr.to, amount: Math.max(uniTokenToUsdt[0], sushiTokenToUsdt[0], inchTokenToUsdt[0]),
              shoudldCreateInstance: true
            });
          } catch (e) {
            panUsdtToToken = ['0', '0'];
          };

          const maxValue = +panUsdtToToken[0];

          setslippageCal((maxValue - (maxValue * slippage / 100)).toFixed(5));
          setMinimumValue((maxValue - (maxValue * slippage / 100)));
          setPercentCalculate((maxValue * slippage / 100).toFixed(5));
          setValueQuote(+maxValue === 0 ? '0' : maxValue.toFixed(5));
          setInSuffLiq(+panUsdtToToken[0] === 0);
          setDexId(isUsingUni ? 0 : 1);
          setDexIdDestination(0)
          setIsThreePath(false);
          // setIsThreePath(isUsingUni ? uniTokenToUsdt[2] : sushiTokenToUsdt[2]);


            if(Math.max(inchTokenToUsdt[0], uniTokenToUsdt[0], sushiTokenToUsdt[0]) === inchTokenToUsdt[0]){
              const url = await inchSwapUrl({ fromToken: tokenAddressArr.from, toToken: ETH_USDT, amount: inputValue, slippage });
              try{
                const response = await fetch(url);
                const data = await response.json();
                setInchTxnData(data.tx);
              }catch(e){
                setInchTxnData(null);
              }
            }else setInchTxnData(null);

        }else{
          let panTokenToUsdt, sushiUsdtToToken, uniUsdtToToken, inchUsdtToToken;
          
          if(window.ethereum){
            try{
              panTokenToUsdt = await panUsdtAmount({
                otherToken: tokenAddressArr.from, amount: inputValue, usdtSide: 'to'
              });
            }catch(e){
              panTokenToUsdt = ['0', '0'];
            };
            
            try{
              uniUsdtToToken = await uniUsdtAmount({
                otherToken: tokenAddressArr.to, amount: (panTokenToUsdt[0]),
                multipliedAmount: panTokenToUsdt[1],
                shoudldCreateInstance: true
              });
            }catch(e){
              uniUsdtToToken = ['0', '0'];
            }
            try{
              sushiUsdtToToken = await sushiUsdtAmount({
                otherToken: tokenAddressArr.to, amount: (panTokenToUsdt[0]),
                shoudldCreateInstance: true, multipliedAmount: panTokenToUsdt[1]
              });
            }catch(e){
              sushiUsdtToToken = ['0', '0'];
            };
            try{
              inchUsdtToToken = await inchUsdtAmount({
                otherToken: tokenAddressArr.to, amount: (panTokenToUsdt[0]),
                
              });
            }catch(e){
              inchUsdtToToken = ['0', '0'];
            }
          }else{
            uniUsdtToToken = await getValueForTesting({ fromToken: tokenAddressArr.from, toToken: tokenAddressArr.to, crossChain: true, amount: inputValue });
            sushiUsdtToToken = uniUsdtToToken;
            inchUsdtToToken = uniUsdtToToken;
          };

          console.log({ panTokenToUsdt, uniUsdtToToken, sushiUsdtToToken, inchUsdtToToken });

          const maxValue = Math.max(+sushiUsdtToToken[0], +uniUsdtToToken[0], +inchUsdtToToken[0]);

          const isUsingUni = +uniUsdtToToken[0] > +sushiUsdtToToken[0];

          setMinimumValue((maxValue - (maxValue * slippage / 100)));
          setslippageCal((maxValue - (maxValue * slippage / 100)).toFixed(5));
          setPercentCalculate((maxValue * slippage / 100).toFixed(5));
          setValueQuote(+maxValue === 0 ? '0' : maxValue.toFixed(5));
          // setIsThreePath(panTokenToUsdt[2]);
          setIsThreePath(false);
          setInSuffLiq(+uniUsdtToToken[0] === 0 && +sushiUsdtToToken[0] === 0);
          setDexId(0);
          setDexIdDestination(isUsingUni ? 0 : 1);
          

          if(maxValue === inchUsdtToToken[0]){
            const url = await inchSwapUrl({ fromToken: ETH_USDT, toToken: tokenAddressArr.to, amount: panTokenToUsdt[0], slippage });
            try{
              const response = await fetch(url);
              const data = await response.json();
              setInchTxnData(data.tx);
            }catch(e){
              setInchTxnData(null);
            }
          }else setInchTxnData(null);
        }


      }
    }
  };

  const makingTransaction = () => {
    sendTransaction(newArrayAddress, fromInputValue, coinPairStatus);
  };
  const setCustomLoaderState = (state) => {
    setLoaderState(state);
  };
  const addTokenModel = (status) => {
    setToggleModel(true);
  };
  useEffect(() => {
    console.log(tokenAddressArr);
  }, [tokenAddressArr])
  useEffect(() => {
    
    if (query && query.toLocaleLowerCase().startsWith('0x')){
      const addTokenHandler = async (contract) => {
        // const url = `https://api.etherscan.io/api?module=token&action=tokeninfo&contractaddress=${contract}&apikey=ZIXER7V3DQZ2ADINQJBA9HDE84DY66ISHK`
        // const response = await fetch(url);
        let web3 = await get_web3_instance();
        const isValidAddress = await web3.utils.isAddress(contract);
        if (!isValidAddress) {
          openSnackbar("Invalid Token Address");
          return;
        }
        const contractInstance = new web3.eth.Contract(addTokenAbi, contract);
        const response = await contractInstance.methods.symbol().call();
        if (response) {
          const chainList = tokenSide == "1" ? fromChain : toChain;
          const newToken = {
            address: contract,
            name: response,
            symbol: response,
            image: tokendefaultIcon,
            decimals: 18,
            chain: (chainList == 'ethereum' || chainList == 'eth') ? 'eth' : 'bsc',
            isCustom: true,
          };

          // const existingArray = process.env.REACT_APP_MODE !== 'production' ? tknList.dropDownToggle : tknList.prodToken
          const existingArray = process.env.REACT_APP_MODE !== 'production' ? dropDownToggle : prodTokens
          if (existingArray.find(e => e.name == newToken.name)) {
            setTokenAlreadyExist(true)
            setTokensearchResult(true);
            setCustomToken([]);
          } else {
            setCustomToken([newToken]);
            setTokensearchResult(true);
            setTokenAlreadyExist(false)

          }

        } else {
          setCustomToken([]);
          // setTokensearchResult(false)
        }
      };
      addTokenHandler(query)
    } else if (query) {
      setTokensearchResult(true);
      setTokenAlreadyExist(false)
      setCustomToken([]);
    }



  }, [query, prodTokens, bscProdTokens])


  const addCustomToken = () => {
    // MergeArray.push(customToken);
    // const chainList = tokenSide == "1" ? fromChain : toChain;

    let coinListByChain = [];
    // (!query || process.env.REACT_APP_MODE !== 'production') ? dropDownToggle : (chainType === 'from' ? prodTokens : bscProdTokens)
    if (process.env.REACT_APP_MODE !== 'production') {
      coinListByChain = dropDownToggle;
      coinListByChain.push(customToken[0]);
      setDropDownToggle(coinListByChain);
      sessionStorage.setItem('customTokenByUser', JSON.stringify(customToken[0]));
    } else if (chainType === 'from') {
      coinListByChain = prodTokens;
      coinListByChain.push(customToken[0]);
      setProdTokens(coinListByChain);
      if (fromChain == toChain) {
        setBscProdTokens(coinListByChain);
      }
      sessionStorage.setItem('customTokenByUser', JSON.stringify(customToken[0]));
    } else {
      coinListByChain = bscProdTokens;
      coinListByChain.push(customToken[0]);
      setBscProdTokens(coinListByChain);
    }

    // coinListByChain.push(customToken[0]);

    // setDropDownToggle(coinListByChain);
    getTokens();
    setCustomToken([]);
    setQuery('')
    const inp = document.querySelector(".popup .wrap .inputgroup input");
    inp.value = '';
  }
  const getLedger = (ledger) => {
    ledgerCount = ledger;
  };
  const getTokenBalance = async (address) => {
    let walletAddress = localStorage.getItem("account");
    let web3 = await get_web3_instance();
    let bal = "";
    if (web3 && web3.eth && walletAddress) {
      try {
        if (address) {
          if (address == TEST_WETH && fromChain == 'eth') {
            bal = await web3.eth.getBalance(walletAddress)
          }
          else if ((address == TEST_WBNB || address === '0xxxxxxxxxx') && fromChain == 'bsc') {
            bal = await web3.eth.getBalance(walletAddress)
          } else {
            let contract = new web3.eth.Contract(erc20Abi, address);
            bal = await contract.methods.balanceOf(walletAddress).call();
          }

        }
      } catch (error) { }
    }
    return bal;
  };

  const getTokenBalances = async () => {
    let walletAddress = localStorage.getItem("account");
    let web3 = await get_web3_instance();

    let accountBal;
    if (web3 && web3.eth && walletAddress) {

      accountBal = await web3.eth.getBalance(walletAddress)
      setTimeout(() => {

        MergeArray.forEach((el) => {
          let contract = new web3.eth.Contract(erc20Abi, el.address);

          if ((fromChain === 'eth' && el.chain === "eth" && el.symbol === "ETH") || (fromChain === 'bsc' && el.chain === "bsc" && el.symbol === "BNB")) {
            el.balance = parseFloat((accountBal * Math.pow(10, -18)).toFixed(4));
          }
          else if (fromChain === 'eth' || fromChain === 'bsc') {
            contract.methods
              .balanceOf(walletAddress)
              .call()
              .then((b) => {
                el.balance = b ? parseFloat((b * Math.pow(10, -18)).toFixed(4)) : 0;
              })
              .catch((e) => (el.balance = 0));
          }
        });

      }, 1000)

    }
  };


  return (
    <>
    <ThemeProvider theme={themeBackground === "light" ? lightTheme : darkTheme}>
      <MyLoader color={"#FFFF"} loading={!loaderState || isSaving} />
      {/* <GlobalStyles /> */}
      <div style={{ overflow: 'hidden' }}>
        <header className="main-header">
          <Header
            clonePopup={clonePopup} setClonePopup={setClonePopup}
          />
          <div className="hero-wrap">
           <div className="hero">
          {/* <video autoPlay muted id="myVideo">
            <source src="../imgs/Marketing.mp4" type="video/mp4" />
          </video> */}
          
            <div className="hero__content">
              <div className="hero__content--h2">
                <h2>
                  {" "}
                  <span className="primary-text">
                    Receive the best price on your trades from multiple aggregators
                  </span>
                </h2>
              </div>

              <MainCaousel />

              <ConnectWallet
                onSuccess={() => setFetchLedger(l => !l)}
                slippage={slippage}
                inchTxnData={inchTxnData}
                priceImpact={priceImpact}
                inSuffLiq={inSuffLiq}
                setInSuffLiq={setInSuffLiq}
                reset={resetOnSuccess}
                isThreePath={isThreePath}
                fromCoin={fromCoin} toCoin={toCoin}
                dexData={[dexId, distribution, dexIdDestination]}
                modalStateType={GetModalState}
                bestQuotePrice={callQuotePrice}
                QuotePriceValue={value_quote}
                makingTransactionProp={makingTransaction}
                addressProp={newArrayAddress}
                coinProp={coinPairStatus}
                setTokenAddressArr={setTokenAddressArr}
                valueProp={fromInputValue}
                gasProp={gasPrice}
                defaultProp={setDefultValue}
                valueSetterProp={setfromInputValue}
                MinimumCalValue={minimumValue}
                SlippagePercent={percentCalculate}
                fromChain={fromChain}
                toChain={toChain}
                reward={reward}
                tokenPair={tokenPair}
                myLoaderSatate={setCustomLoaderState}
                availableBal={fromTokenBal}
                tokenPairImg={tokenPairImg}
                selectedTokenPair
                tokenAddressArr={tokenAddressArr}
                slippageCalcuation={slippageCal}
                setTokenPairs={setTokenPair}
                setAddressArray={setaddressArray}
                setTokenPairImage={setTokenPairImg}
                tokenBalances={getTokenBalances}
                particularTokenBal={getTokenBalance}
                setFromTokenBalance={setFromTokenBal}
              // companyFee = {setCompanyFee}
              />

              <div className="beforeUsing">
                <p className="primary-text">
                  {companyFee} service fee <i className="fas fa-question-circle"></i>
                  <span className="popupdgen">
                    80% of fees support DEGEN liquid while 20% supports DEGEN
                    development
                  </span>{" "}
                </p>
                <p className="primary-text">
                  100% gas and fee reimbursement <i className="fas fa-question-circle"></i>
                  <span className="popupdgen">
                    DEGEN users have the option to receive 100% reimbursement for their gas and swap fees. Users are able to claim reimbursements via the reimbursement staking contract. To release reimbursements, users must stake the 1:1 equal amount of DEGEN for one year, but will be able to release partial amounts of the reimbursement if withdrawn at any time before the 1 year period.
                  </span>{" "}
                </p>
                <p className="btntomenu primary-text">
                  <i className="fas fa-cog"></i> Transaction Settings
                </p>
              </div>
            </div>

            <Ledger triggerLoad={fetchLedger} getLedger={getLedger} />
          </div>
          <div className="overlay-bg">
            <video autoPlay muted loop playsInline id="myVideo" data-wf-ignore="true" data-object-fit="cover">
              <source src="../imgs/degen-vedio1.mp4" type="video/mp4" data-wf-ignore="true" />
            </video>
          </div>
          </div>
        </header>
        <Footer
          HowitworkPopup={HowitworkPopup} setHowitworkPopup={setHowitworkPopup}
          aboutPopup={aboutPopup} setAboutPopUp={setAboutPopUp}
          continueClone={clonePopup} setClonePopupHome={setClonePopup}
          DegenOverviewPopup={DegenOverviewPopup} setDegenOverviewPopup={setDegenOverviewPopup}
          ReimbursementPopup={ReimbursementPopup} setReimbursementPopup={setReimbursementPopup}
        />

        <div className="popup cus-pop">
          <div className="header">
            <div className="header__logo">
              <img src="imgs/right-logo.png" alt="" />
            </div>
            <div className="header__info">
              <a href="#">ifo live</a>
            </div>

            <div className="header__title">
              <h1>One-click cross-chain liquidity aggregator</h1>
            </div>
            <div className="header__control">
              <form action="" method="GET">
                <img src="imgs/cntl-logo.png" alt="" />
                <button className="connectwallet" type="submit">
                  connect wallet
                </button>
                <a className="setting " href="#">
                  <i className="fas fa-cog"></i>
                </a>

                <div className="options ">
                  <h3>Transaction Settings </h3>
                  <h4>
                    Slippage tolerance{" "}
                    <i className="fas fa-question-circle"></i>
                  </h4>
                  <select
                    name="selectbox"
                    id="connectwalletselect"
                    style={{ display: "none" }}
                  >
                    <option value=""></option>
                    <option value=".1%">.1%</option>
                    <option value=".5%">.5%</option>
                    <option value="1%">1%</option>
                    <option value=".50%">.50%</option>
                  </select>
                  <div className="nice-select" tabIndex="0">
                    <span className="current"></span>
                    <ul className="list">
                      <li data-value="" className="option selected"></li>
                      <li data-value=".1%" className="option">
                        .1%
                      </li>
                      <li data-value=".5%" className="option">
                        .5%
                      </li>
                      <li data-value="1%" className="option">
                        1%
                      </li>
                      <li data-value=".50%" className="option">
                        .50%
                      </li>
                    </ul>
                  </div>
                  <p className="deadline">
                    Transaction deadline{" "}
                    <i className="fas fa-question-circle" />
                  </p>
                  <input
                    id="inputID"
                    type="text"
                    placeholder="20"
                    className="inputmnts"
                  />{" "}
                  <span className="mnts">minutes</span>
                  <p className="intsett">interface settings</p>
                  <div className="toggleexpert">
                    <p>
                      Toogle expert mode{" "}
                      <i className="fas fa-question-circle" />
                    </p>
                    <div className="togglebutton">
                      <span>
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkon"
                          name="on"
                        />
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkoff"
                          name="off"
                        />
                        <span className="onspan">on</span>
                        <span className="offspan">off</span>
                      </span>
                    </div>
                  </div>
                  <div className="toggldark">
                    <p>Toogle dark mode</p>
                    <div className="togglebutton">
                      <span>
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkon"
                          name=""
                        />

                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkoff"
                          name=""
                        />
                        <span className="onspan">on</span>
                        <span className="offspan">off</span>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="wrap cus-select">
            <div className="uppper">
              <p className="select-token">
                Select token <i className="fas fa-question-circle" />{" "}
                <span className="popupspan">Search for tokens </span>
              </p>
              <div className="dropdownERC select">
                {/* <ul>
                    <li>ERC20</li>
                    <li>ERC21</li>
                  </ul> */}
                <select
                  value={chainType === "from" ? fromChain : toChain}
                  style={{ border: "none", width: "150px" }}
                  onChange={(event) => changeChainHandlerfromHeader(event)}
                >
                  <option value="eth">ETHEREUM</option>
                  <option value="bsc">BSC</option>
                </select>
                {/* <span className="icon-chevron-down"></span> */}
              </div>
              <div className="close-token">
                <img
                  src="imgs/xshape.png"
                  alt=""
                  style={{ filter: "invert(0.5)" }}
                />
              </div>
            </div>
            <div className="inputgroup">
              <input
                id="inputID"
                type="text"
                placeholder="Search name or paste address"

              />

            </div>
              
            {/* <div className="tokenNames">
              <span>Common Bases</span>
            </div>
            <div className="tokenNames">
                  {(chainType === 'from' ? fromCommonBases : toCommonBases).map(b => <span 
                    onClick={() => CoinValue(b)}
                    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '10px', borderRadius: '5px', border: '1px solid #999', cursor: 'pointer' }} key={b.symbol}>
                    <img style={{ height: '20px', width: '20px', marginRight: '5px' }} alt={b.symbol} src={b.image} />
                    {b.symbol}
                  </span>)}
            </div>   */}

            <div className="tokenNames">
              <span>Token name</span>
              {/* <i className="fas fa-arrow-down" /> */}
            </div>

            <div className="tokenlist">
              <ul>
                {/* {dropDownToggle.map((item, index) => ( */}
                {customToken.length == 0 && ((!query || process.env.REACT_APP_MODE !== 'production') ? dropDownToggle : (chainType === 'from' ? prodTokens : bscProdTokens).filter(e => e.symbol.toUpperCase().startsWith(query.toUpperCase()))).map((item, index) => (


                  <li
                    className={
                      Object.values(tokenPair).includes(item.symbol) &&
                        toChain === fromChain
                        ? "active"
                        : ""
                    }
                    key={index}
                    onClick={() => CoinValue(item)}
                  >
                    <img src={item.image} alt="" />
                    <span>{item.symbol}</span>
                    {item.isCustom && <span className='custom-token-info'>Added by User</span>}
                    {item.balance !== 0 ? (
                      <span className="dash" style={{ opacity: 0.5 }}>
                        {item.balance}
                      </span>
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
                {showWarning && <Warning listing={customToken[0]} setCoinList={addCustomToken} resetLink={setShowWarning} />}
                {!showWarning && customToken && customToken.length ?
                  <li>
                    <div key={'cust-token'} className='custom-token-block'>
                      <img src={tokendefaultIcon} />
                      <span >{customToken[0].name}</span>
                      <button className='imp-button' onClick={() => {
                        setShowWarning(true);
                        setQuery('')
                      }}>Import</button>
                    </div></li> : null
                }
                {tokenAlreadyExist && <div style={{ textAlign: 'center' }}> Token Already Exist.</div>}

                {!tokenSearchResult && <div style={{ textAlign: 'center' }}> No Matching Token Found.</div>}
                {process.env.REACT_APP_MODE === 'production' && !query ? <div style={{ color: 'transparent' }} ref={lastRef}>aaaa</div> : <></>}
              </ul>

            </div>

          </div>
        </div>
        <div className="chain-popup">
          <div className="header">
            <div className="header__logo">
              <img src="imgs/right-logo.png" alt="" />
            </div>
            <div className="header__info">
              <a href="#">ifo live</a>
            </div>

            <div className="header__title">
              <h1>One-click cross-chain liquidity aggregator</h1>
            </div>
            <div className="header__control">
              <form action="" method="GET">
                <img src="imgs/cntl-logo.png" alt="" />
                <button className="connectwallet" type="submit">
                  connect wallet
                </button>
                <a className="setting " href="#">
                  <i className="fas fa-cog"></i>
                </a>

                <div className="options ">
                  <h3>Transaction Settings </h3>
                  <h4>
                    Slippage tolerance{" "}
                    <i className="fas fa-question-circle"></i>
                  </h4>
                  <select
                    name="selectbox"
                    id="connectwalletselect"
                    style={{ display: "none" }}
                  >
                    <option value=""></option>
                    <option value=".1%">.1%</option>
                    <option value=".5%">.5%</option>
                    <option value="1%">1%</option>
                    <option value=".50%">.50%</option>
                  </select>
                  <div className="nice-select" tabIndex="0">
                    <span className="current"></span>
                    <ul className="list">
                      <li data-value="" className="option selected"></li>
                      <li data-value=".1%" className="option">
                        .1%
                      </li>
                      <li data-value=".5%" className="option">
                        .5%
                      </li>
                      <li data-value="1%" className="option">
                        1%
                      </li>
                      <li data-value=".50%" className="option">
                        .50%
                      </li>
                    </ul>
                  </div>
                  <p className="deadline">
                    Transaction deadline{" "}
                    <i className="fas fa-question-circle" />
                  </p>
                  <input
                    id="inputID"
                    type="text"
                    placeholder="20"
                    className="inputmnts"
                  />{" "}
                  <span className="mnts">minutes</span>
                  <p className="intsett">interface settings</p>
                  <div className="toggleexpert">
                    <p>
                      Toogle expert mode{" "}
                      <i className="fas fa-question-circle" />
                    </p>
                    <div className="togglebutton">
                      <span>
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkon"
                          name="on"
                        />
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkoff"
                          name="off"
                        />
                        <span className="onspan">on</span>
                        <span className="offspan">off</span>
                      </span>
                    </div>
                  </div>
                  <div className="toggldark">
                    <p>Toogle dark mode</p>
                    <div className="togglebutton">
                      <span>
                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkon"
                          name=""
                        />

                        <input
                          id="inputID"
                          type="checkbox"
                          className="checkoff"
                          name=""
                        />
                        <span className="onspan">on</span>
                        <span className="offspan">off</span>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="chain-wrap">
            <div className="uppper">
              <p className="select-token">
                Select Chain <i className="fas fa-question-circle" />{" "}
                <span className="popupspan">Search for Chain </span>
              </p>
              {/* <div className="dropdownERC">
                <ul>
                    <li>ERC20</li>
                  </ul>
                  <span className="icon-chevron-down"></span>
              </div> */}
              <div className="chain-close">
                <img
                  src="imgs/xshape.png"
                  alt=""
                  style={{ filter: "invert(0.5)" }}
                />
              </div>
            </div>
            <div className="inputgroup">
              <input
                id="inputID"
                type="text"
                placeholder="Search name or paste address"
              />
            </div>
            <div className="tokenNames">
              <span>Chain name</span>
              {/* <i className="fas fa-arrow-down" /> */}
            </div>

            <div className="chain-list">
              <ul>
                {chain_array.map((item, index) => (
                  <li key={index} onClick={() => chainChangeHandler(item)}>
                    <img src={item.image} alt="{item.name}" />
                    <span>{item.name}</span>
                    {/* <span className="dash">-</span> */}
                  </li>
                ))}
              </ul>
            </div>
            {/* <div className="havetrouble">
                <a href="#" >Having trouble finding a token ?</a>
              </div> */}
          </div>
        </div>
        <RightSidemenu
          setHowitworkPopup={setHowitworkPopup}
          setAboutPopUp={setAboutPopUp}
          setDegenOverviewPopup={setDegenOverviewPopup}
          setReimbursementPopup={setReimbursementPopup}
          slippage={slippage}
          setIsSaving={setIsSaving}
          binaryStr={binaryStr}
          setBinaryStr={setBinaryStr}
          propGetPrice={GetGasPrice}
          ledgerCount={ledgerCount}
          swapDropdown={swapDropdown}
        />
        {showGraph && (
          <div className="chart-sidebar">
            {" "}
            <TradeChart tokens={tokenPair} />
          </div>
        )}
        {toggletableView && Number(fromInputValue) > 0 && (
          <div className="chart-sidebar">
            {" "}
            <CompareTable
              tokenAddressArr={tokenAddressArr}
              amt={+value_quote * Math.pow(10, 18)}
              toChain={toChain}
              fromChain={fromChain}
              binaryStr={binaryStr}
              address={tokenAddressArr}
              amount={fromInputValue}
              chains={tokenPair}
            />
          </div>
        )}
        <Loader />

        {/* <div className="connectpopup">
                <div className="content">
                    Connectiong Your Wallet ...
                 </div>
            </div> */}
      </div>
      {/* <AddTokenModal
        isOpen={toggleModel}
        setToggleModel={setToggleModel}
        addTokenHandler={addTokenHandler}
        contractValue={contractValue}
        setContractValue={setContractValue}
      /> */}
      <AlertModal
        isOpen={showAlert}
        alertText={alertText}
        toggleAlert={toggleAlert}
      />
       </ThemeProvider>
    </>
   
  );
};

const Warning = ({
  listing,
  setCoinList,
  resetLink,
}) => {
  const [agree, setAgree] = useState(false);
  return <>
    {/* <MTtknMBX>
          <MTtknIcn><img src={listing?.data?.logoURI} onError={(e)=>{e.target.onerror = null; e.target.src=defaultIcon}} alt="" /></MTtknIcn>
          {listing?.data?.name}
          <span>{listing?.data?.tokens?.length || 0} tokens</span>
      </MTtknMBX> */}
    <WarnBox>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF4343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      <h2>Import at your own risk</h2>
      <div>By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.</div>
      <div>If you purchase a token from this list, you may not be able to sell it back.</div>
      <label style={{ margin: '20px 0' }}>
        <input style={{ marginRight: '5px' }} type='checkbox' checked={agree} onChange={() => setAgree(a => !a)} />
        I understand
      </label>
      <OrangeButton type='button' style={{ width: '90%' }} onClick={() => {
        if (!agree) return;
        setTimeout(() => {
          setCoinList();
          resetLink(false)
        }, 1);
      }}>Import</OrangeButton>
    </WarnBox>
  </>;
};
const FlexDiv = styled.div`
display: flex; align-items: center; justify-content:center; flex-wrap:wrap;
`;

const MTtabMBX = styled(FlexDiv)`
    width: 100%; 
    button{ width:50%; height:56px; text-align: center; display:block; font-weight:700; font-size:16px; color:#8e9195; border-bottom:3px solid #8e9195; 
    :hover, &.active { border-color:#febb00; color:#febb00; } 
    } 
`
const WarnBox = styled(FlexDiv)`
    display: flex; flex-direction: column; align-items: center; width: 100%;
    padding: 0;
h2{
  padding-bottom: 10px;
}
    div{
        color: #000;
    }
`;
const OrangeButton = styled.button`
    font-size:16px; color:#fff;  font-weight: 700; display:flex; align-items: center; justify-content:center;
    background-color:#febb00; font-size:16px; color:#fff; font-weight:500; padding:6px 12px; border-radius:6px;
`;