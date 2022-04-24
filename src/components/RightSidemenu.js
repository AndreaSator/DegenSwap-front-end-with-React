import React, { useEffect, useState, useContext } from "react";
import { API_URL } from "../common/constant";
import { useSnackbar } from "react-simple-snackbar";
import { fillUpto, updateLiquidityList } from "../service/degen_function";
import MyLoader from "./spinner";
import { ThemeContext } from "../contexts/ThemeContext";
// let binaryStr = '';
export const RightSidemenu = ({
  binaryStr,
  setIsSaving,
  setBinaryStr,
  slippage,
  setAboutPopUp, setHowitworkPopup, 
  setDegenOverviewPopup, setReimbursementPopup,
  ...prop
}) => {
  const [openSnackbar] = useSnackbar();
  const theme = useContext(ThemeContext);
  const [meta_wallet, setMetaWallet] = useState(null);
  // const [binaryStr, setBinaryStr] = useState('');
  let binaryStr1 = "";
  useEffect(() => {
    
    setMetaWallet(localStorage.getItem("account"));
    let acc = localStorage.getItem("account");
    if (acc) {
      getDexList(acc);
    }
    updateLiq(binaryStr);
    toggleLedgerView();
  }, []);
  const dec2bin = (dec) => {
    return (dec >>> 0).toString(2);
  };

  const getDexList = async (acc) => {
    try {
      const response = await fetch(
        `${API_URL}api/DEGEN/getDEXList?userAddress=${acc}`
      );
      const Api_Response = await response.json();
      if (Api_Response && Api_Response.status == "true") {
        const binDigit = dec2bin(Number(Api_Response.flags)).toString();
    
        const d = fillUpto(binDigit, 5);
        binaryStr1 = d;
        setBinaryStr(d);
      }
    } catch (error) {
      
    }
  };
  
  const SetGasPrice = (price) => {
    if (price == "" && price != null) {
      prop.propGetPrice(price);
    }
  };
  
  const updateLiq = () => {
    document.querySelector(".curve").onclick = (e) => {
      const chars = binaryStr1.split("");
      chars[0] = binaryStr1.charAt(0) == "0" ? "1" : "0";
      const newStr = chars.join("");
      binaryStr1 = newStr;

      setBinaryStr(newStr);
    };
    document.querySelector(".para").onclick = (e) => {
      const chars = binaryStr1.split("");
      chars[1] = binaryStr1.charAt(1) == "0" ? "1" : "0";
      const newStr = chars.join("");
      binaryStr1 = newStr;

      setBinaryStr(newStr);
    };
    document.querySelector(".inchlp-mig").onclick = (e) => {
      const chars = binaryStr1.split("");
      chars[2] = binaryStr1.charAt(2) == "0" ? "1" : "0";
      const newStr = chars.join("");
      binaryStr1 = newStr;
      setBinaryStr(newStr);
    };
    document.querySelector(".inchlp").onclick = (e) => {
      const chars = binaryStr1.split("");
      chars[3] = binaryStr1.charAt(3) == "0" ? "1" : "0";
      const newStr = chars.join("");
      binaryStr1 = newStr;

      setBinaryStr(newStr);
    };
    document.querySelector(".smart").onclick = (e) => {
      const chars = binaryStr1.split("");
      chars[4] = binaryStr1.charAt(4) == "0" ? "1" : "0";
      const newStr = chars.join("");
      binaryStr1 = newStr;

      setBinaryStr(newStr);
    };

    const updateLiquidityButton = document.getElementById("update-liquidity");
    updateLiquidityButton.onclick = () => {
      if (binaryStr1.indexOf("0") === -1) {
        openSnackbar(
          "Please select at least one liquidity resource before saving"
        );
        return;
      }
      setIsSaving(true);
      setTimeout(() => {
        updateLiquidityList(parseInt(binaryStr1, 2), (message) => {
          openSnackbar(message);
          setIsSaving(false);
        });
      }, 500);
    };
  };
  const slideLiquidity = () => {
    document.querySelector("");
  };
  const toggleLedgerView = () => {
    const el = document.querySelector("#sidbar-ledger");
    el.onclick = () => {
      prop.swapDropdown("sidebar");
    };
    document.querySelector('#aboutus').onclick=() => {
      setAboutPopUp(p => !p)
      prop.swapDropdown("sidebar");
    }
    document.querySelector('#hundredper').onclick=() => {
      setReimbursementPopup(p => !p)
      prop.swapDropdown("sidebar");
    }
    document.querySelector('#degenover').onclick=() => {
      prop.swapDropdown("sidebar");
      setDegenOverviewPopup(p => !p)
    }
    document.querySelector('#howit').onclick=() => {
      prop.swapDropdown("sidebar");
      setHowitworkPopup(p => !p)
    }
  };
  return (
    <div className="right-sidemenu">
      <span className="mainBtn">
        {" "}
        {meta_wallet} <span className="dotspan"></span>
      </span>

      <a className="buy-degenA active" href="#">Buy Degen</a> <br/>
      <a className="buy-degenA" href="#" >Free license</a> <br/>

      <div className="swap-advanced">
        <p>SWAP advanced Settings</p>
        <div className="five-logos">
          {/* <div className="active"><img src="imgs/icon-1.png" alt="" /></div>
                    <div><img src="imgs/icon-2.png" alt="" /></div> */}
          <div id="btn-viewtable">
            <img src="imgs/icon-3.png" alt="" />
          </div>
          <div id="btn-chart">
            <img src="imgs/icon-4.png" alt="" />
          </div>
          {/* <div><img src="imgs/icon-5.png" alt="" /></div> */}
        </div>
      </div>

      <div className="slippage-tolerance">
        <div className="content-slippage">
          <span>Slippage tolerance</span>
          
          <p>
            <span className="getvalue">.5%</span>
            <span className="slidechevron">
              <i className="fas fa-caret-down" />{" "}
            </span>
          </p>
        </div>
        <div className="values">
          <div className="selectvalue">
            <span>0.1%</span>
            <span className="active">0.5%</span>
            <span>1%</span>
            <span>3%</span>
          </div>
          <div className="custom-values">
            <input id="inputID" type="number" placeholder="Custom" />
          </div>
        </div>
        
      </div>
      <div>
      {slippage >= 50 ? <p style={{
            paddingTop: '20px',
            color: '#f00'
          }}>Enter a valid slippage percentage</p> : <></>}
          {(slippage >= 6 && slippage < 50) ? <p style={{
            paddingTop: '20px',
            color: '#aa0'
          }}>Your transaction may be frontrun</p> : <></>}
          {!slippage ? <p style={{
            paddingTop: '20px',
            color: '#aa0'
          }}>Your transaction may fail</p> : <></>}
      </div>
      <div className="Gas-price">
        <div className="content-slippage">
          <span>Gas Price</span>
          <p>
            <span className="getvalue">Fast (116 GWEI)</span>
            <span className="slidechevron">
              <i className="fas fa-caret-down" />
            </span>
          </p>
        </div>

        <div className="values">
          <div className="selectvalue">
            <span style={{ zIndex: 20 }} onClick={() => SetGasPrice("91")}>
              91 standard
            </span>
            <span onClick={() => SetGasPrice("116")} className="active">
              116 Fast
            </span>
            <span onClick={() => SetGasPrice("130")}>130 Instant</span>
          </div>
          <div className="custom-values">
            <input id="inputID" type="number" placeholder="Custom" />
          </div>
        </div>
      </div>
      <div className="liquidiy-resource">
        <div className="liquid-content">
          <span>Liquidity resources</span>
          <p>
            <span className="getvalueresources">
              {binaryStr.split("0").length - 1}
            </span>
            <span className="slidechevron-rersources"></span>
          </p>
        </div>
        <div className="liquidity-list">
          <div className="liquid-group">
            <div
              className={binaryStr.charAt(0) == "0" ? "active curve" : "curve"}
            >
              {/* <img src="imgs/liq-1.png" alt="" /> */}
              Curve
            </div>
            <div
              className={binaryStr.charAt(1) == "0" ? "active para" : "para"}
            >
              {/* <img src="imgs/liq-1.png" alt="" /> */}
              Paraswap
            </div>
            <div
              className={
                binaryStr.charAt(2) == "0" ? "active inchlp-mig" : "inchlp-mig"
              }
            >
              {/* <img src="imgs/liq-2.png" alt="" /> */}
              INCH
            </div>
            <div
              className={
                binaryStr.charAt(3) == "0" ? "active inchlp" : "inchlp"
              }
            >
              {/* <img src="imgs/liq-2.png" alt="" /> */}
              Sushiswap
            </div>
            <div
              className={binaryStr.charAt(4) == "0" ? "active smart" : "smart"}
            >
              {/* <img src="imgs/liq-1.png" alt="" /> */}
              Uniswap
            </div>

            {/* <div className="inchlp-v1"><img src="imgs/liq-2.png" alt="" />INCH LP V1.1</div>
                    <div className="AAVE"><img src="imgs/liq-5.png" alt="" />AAVE</div>
                    <div className="AAVE-Liq"><img src="imgs/liq-5.png" alt="" />Aave Liquidatar</div> */}
          </div>
          <div style={{ textAlign: "right" }}>
            <button
              key="update-liquidity"
              id="update-liquidity"
              className="update-liquidity"
            >
              Save
            </button>
          </div>
        </div>
      </div>
     
      {/* <div className="custom-token">
                <div className="custom-content">
                    <span>Custom tokens<i className="fas fa-plus-circle" /></span>
                    <p><span className="">0</span><span className="slidechevron-custom"><i className="fas fa-caret-down" /></span></p>
                </div>
            </div> */}

      <div className={prop.ledgerCount == 0 ? "list-info " : "list-info "}>
        <ul>
          <li>
            <a href="javacript:void" id="sidbar-ledger">
              Ledger
            </a>
          </li>
          <li><a id='howit' href="#">How it works</a></li>
                    <li><a id='degenover' href="#">DEGEN Overview</a></li>
                    <li><a id='hundredper' href="#">100% gas and fees reimbursement</a></li>
          <li>
            <a href="#">Governance</a>
          </li>
        </ul>
      </div>

      <div className="library">
        <p className="slidelibrary">
          Library
          <span>
            <i className="fas fa-caret-down" />
          </span>
        </p>
        <ul className="dropdownlibrary">
          <li>
            <a href="#">Github</a>
          </li>
          <li>
            <a href="#">Whitepaper</a>
          </li>
          {/* <li>
            <a href="#">Light Paper</a>
          </li> */}
          <li>
            <a href="#">Technical Documentaion</a>
          </li>
          <li>
            <a href="#">Pitch Deck</a>
          </li>
          <li>
            <a href="#">One Page</a>
          </li>
        </ul>
      </div>

      <div className="commuity">
        <p className="communityslide">
          Community
          <span className="">
            <i className="fas fa-caret-down" />
          </span>
        </p>
        <ul className="dropdowncommuity">
          <li>
            <a href="#">
              <i className="fab fa-twitter" />
              Twitter
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fab fa-reddit" />
              Reddit
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fab fa-medium-m" />
              Medium
            </a>
          </li>
        </ul>
      </div>

      <div className="About">
        <p className="slideAbout">
          About
          <span className="">
            <i className="fas fa-caret-down" />
          </span>
        </p>
        <ul className="dropdownAbout">
          <li>
            <a id='aboutus' href="#">About Us</a>
          </li>
          <li>
            <a href="#">Careers</a>
          </li>
          <li>
            <a href="#">Partner with Us</a>
          </li>
          <li>
            <a href="#">Privacy Policy</a>
          </li>
          <li>
            <a href="#">Terms Of Use</a>
          </li>
          <li>
            <a href="#">Cookie Policy</a>
          </li>
        </ul>
      </div>

      <div className="bottom-imgs">
        {/* <h1 id="mode" style={{ cursor: "pointer" }}>hjfdgsj</h1> */}
        <img
          id="mode"
          style={{ cursor: "pointer" }}
          src={
            !theme.isDark ? "imgs/bottom-imgs.png" : "imgs/bottom_imgs_dark.png"
          }
          alt=""
          // onClick={() => theme.toggleTheme()}
        />
      </div>

      <div className="footer-menu">
        <div>
          <img src="imgs/bottom-menu.png" alt="" />
        </div>
        <div className="copyright-menu">
          <p>&copy; 2021 Degen Swap Aggregator. All rights reserved</p>
        </div>
        <div className="powered-by-menu">
          <h2> <img src="imgs/atom-logo.png" alt="" /> </h2>
          <p>
          Atom Foundation is a Decentralized Financial (DeFi) liquidity ecosystem powered by proprietary protocols which underlines zero volatility platforms, a NFT (Non-fungible token) and altcoin marketplace with downside protection, post dex offerings (PDO), a dynamic AMM with multiple swap exchanges, cross network aggregation, as well as a CBDC alternative and price support game theoretic model.
          </p>
          <a href="#" className="donate">
            Donate Crypto to Charities
          </a>
        </div>
      </div>
    </div>
  );
};
