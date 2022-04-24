import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { NumberContext } from "../api";
// let NumberContext = React.createContext();
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./../config/theme";
import { GlobalStyles } from "./../config/global";
import {
  metamask_connection,
  getAccountaddress,
} from "../service/metamask_function";
import { get_web3_instance } from "../service/degen_function";
import bnb from "../asstes/imgs/bnb-coin.svg";
import eth_icon from "../asstes/imgs/ETH1.png";
import { NETWORK } from "../common/constant";
import detectEthereumProvider from "@metamask/detect-provider";
import { ThemeContext } from "../contexts/ThemeContext";
import DetectMetamaskAlert from "./detect-metamask-alert";

export const Header = ({ clonePopup, setClonePopup }) => {
  const [theme, setTheme] = useState("light");
  const themeCloneData = useContext(ThemeContext);
  const [meta_wallet, setMetaWallet] = useState(null);
  const [connectClicked, setConnectClicked] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0.0);
  const [networkVersion, setNetworkVersion] = useState(
    Number(window.ethereum && window.ethereum.networkVersion)
  );
  const [accAddress, setAccAddress] = useState("");
  const [metamaskprovider, setProvider] = useState(null);
  const [toggleCheck, setCheck] = useState(false);



  // const toggleTheme = () => {
  //     // if the theme is not light, then set it to dark
  //     if (theme === 'light') {
  //         setTheme('dark');
  //         localStorage.setItem("mytheme", "dark")
  //         // otherwise, it should be light
  //     } else {
  //         setTheme('light');
  //         localStorage.setItem("mytheme", "light")
  //     }
  // }
  const detectMetamask = async () => {
    detectEthereumProvider().then((pro) => {
      setProvider(pro);
    });
  };

  /* useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener('storage', e => console.log(e));
    }
  }, []); */

  useEffect(() => {
    detectMetamask();
    getAccount();
    setTimeout(() => {
      setNetworkVersion(
        Number(window.ethereum && window.ethereum.networkVersion)
      );
    }, 1000);
    const intr = setInterval(() => {
      if (metamaskprovider) {
        getAccountBal();
        clearInterval(intr);
      }
    }, 1000);

    metamask_connection(localStorage.getItem("account"), "UseEffect");
    let mytheme = localStorage.getItem("mytheme");
    if (mytheme !== null) {
      setTheme(mytheme);
    } else {
      setTheme("light");
    }
    // alert(mytheme)

    //setMetaWallet(getAccountaddress());

    // let meta_wallets = getAccountaddress();
    setMetaWallet(localStorage.getItem("account"));
    getModifiedAddress();
    // logout();

  }, [metamaskprovider, toggleCheck]);
  const getAccount = () => {
    const intervalSubs = setInterval(() => {
      setMetaWallet(localStorage.getItem("account"));
      if (meta_wallet) {
        clearInterval(intervalSubs);
      }
    }, 1000);
  };
  const getAccountBal = async () => {
    const accAdderss = localStorage.getItem("account");
    let web3 = await get_web3_instance();
    if (accAdderss) {
      const accountBal = await web3.eth.getBalance(accAdderss);
      setAccountBalance((accountBal * Math.pow(10, -18)).toFixed(2));
    }
  };


  const logout = () => {
    let dotspan = document.querySelector(".dotspan");

    let connectwallet = document.querySelector(".connectwallet");

    let login = document.querySelector(".login");
    let menuRight = document.querySelector(".right-sidemenu");

    let presalesmartswap = document.querySelector(".presalesmartswap");

    // dotspan.onclick = function (e) {
    //   e.stopPropagation();
    //   menuRight.classList.add("slide");
    //   document.documentElement.style.overflow = "hidden";
    //   login.classList.remove("show");
    //   connectwallet.classList.remove("hide");
    //   dotspan.classList.remove("active");

    //   presalesmartswap.style.display = "block";
    // };
  };
  const getModifiedAddress = () => {
    if (localStorage.getItem("account")) {
      const add = localStorage.getItem("account");
      const acc = add.substr(0, 6) + "..." + add.substr(add.length - 4);
      setAccAddress(acc);
    }
  };

  const cancelClone = () => {
    themeCloneData.updateCloneData(
      {
        bgimage: "",
        logoImage: "",
        subDomain: "",
        primaryColor: "",
        secondaryColor: "",
        fontStyle: "Default",
        logoUrl: "",
        swapButtonColor: "",
      },
      false
    );
    setClonePopup(false)
    document.getElementsByTagName("body")[0].style.fontFamily = "";
    document.body.style.backgroundImage = "";
  };


  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
    {(!metamaskprovider && connectClicked) ?  <DetectMetamaskAlert onClose={() => setConnectClicked(false)} /> : <></>}
      {/* <NumberContext.Consumer> */}
      <>
        {/* <GlobalStyles /> */}



        <div className="header">
        <div className="header__LBX">
          <a
            className="presalesmartswap"
            target="_blank"
            href={themeCloneData.cloneData.logoUrl !== '' ? themeCloneData.cloneData.logoUrl : "https://degenswap.io/"}
          >
            <div className="header__logo">
              {/* <img src={themeCloneData.isDark ? (themeCloneData.cloneData.logoImageDark !== '' ? themeCloneData.cloneData.logoImageDark : "imgs/right-logo.png") : (themeCloneData.cloneData.logoImage !== '' ? themeCloneData.cloneData.logoImage : "imgs/right-logo.png")} alt="" /> */}
              <img src={themeCloneData.isDark ? (themeCloneData.cloneData.logoImageDark !== '' ? themeCloneData.cloneData.logoImageDark : "imgs/logo-usr.png") : (themeCloneData.cloneData.logoImage !== '' ? themeCloneData.cloneData.logoImage : "imgs/logo-usr.png")} alt="" width={74} height={68} />
              <span className="logo-txt">Degen Swap</span>
              
            </div>
          </a>
          <div className="header__info">
            <a
              target="_blank"
              href="https://dynamicswap.exchange/#bnb-degen"
            >
              PDO LIVE
            </a>
          </div>

          </div>

          <div
            className="header__title"
            onClick={() => {
              // toggleTheme()
              //  alert(`Do you want to change ${theme} theme ?`)
            }}
          >
            <h1>One-click cross-chain liquidity aggregators umbrella</h1>
          </div>
          <div className="header__control">
            <div href="#" className="right-menu-btn">
              {themeCloneData.preview ?
                <>
                  <button onClick={() => setClonePopup(true)}>
                    <span className="smWallFix01">Continue Clone</span>
                  </button>
                  <button onClick={() => cancelClone()}>
                    <span className="smWallFix01">Cancel Clone</span>
                  </button>
                </>
                :
                <>
                  {meta_wallet && (
                    <a
                      className="presalesmartswap"
                      href="javascript:void"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span className="smWallFix01">{accountBalance}</span>
                      {(networkVersion == NETWORK.BSCMAINNET ||
                        networkVersion == NETWORK.BSCTESTNET) && (
                          <>
                            <span className="smWallFix01" style={{ paddingLeft: "5px" }}>BNB</span>
                            <span style={{ paddingLeft: "5px" }}>
                              <img src={bnb} width="20" />
                            </span>
                          </>
                        )}
                      {(networkVersion == NETWORK.Ropsten ||
                        networkVersion == NETWORK.Mainnet) && (
                          <>
                            <span style={{ paddingLeft: "5px" }}>ETH</span>
                            <span style={{ paddingLeft: "5px" }}>
                              <img src={eth_icon} width="20" />
                            </span>
                          </>
                        )}
                    </a>
                  )}
                  {meta_wallet != null ? (
                    <div className="login" style={{ display: "block" }}>
                      {/* <p className="firstp">
                  12.356BNB
                  <img src="imgs/Layer-5443.png" alt="" />
                </p> */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          paddingBottom: "5px",
                        }}
                      >

                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            marginLeft: "26px",
                          }}
                        >
                          <span className="smWallFix01"> {accAddress} </span>
                        </div>
                        <div className="dotspan"></div>
                      </div>
                    </div>
                  ) : (
                    <a
                      href="#"
                      className="connectwallet"
                      onClick={() => {
                          metamask_connection(localStorage.getItem("account"), "ahrefClick");
                          setCheck(!toggleCheck);
                        }
                      }
                      style={{ display: "block" }}
                    >
                      Connect Wallet
                    </a>
                  )}</>
              }
            </div>
          </div>
        </div>
      </>
    </ThemeProvider>
  );
};
