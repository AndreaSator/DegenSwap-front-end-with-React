import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import CloneForm from "./CloneForm";
import About from "./About";
import HowitWork from "./HowItWork";
import DegenOverview from "./DegenOverview";
import Reimbursement from "./Reimbursement";
import { useDegenPrice } from "../hooks";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./../config/theme";

export const Footer = ({
  aboutPopup, HowitworkPopup, DegenOverviewPopup, ReimbursementPopup, continueClone,
  setAboutPopUp, setHowitworkPopup, setDegenOverviewPopup, setReimbursementPopup, setClonePopupHome
}) => {

  const[footerTheme, setFooterTheme]=useState("light");
  const price = useDegenPrice();
  const theme = useContext(ThemeContext);
  const [clonePopup, setClonePopUp] = useState(false);
  // const [aboutPopup, setAboutPopUp] = useState(
  //   theme.isSubdomain ? false : false
  // );
  // const [HowitworkPopup, setHowitworkPopup] = useState(
  //   theme.isSubdomain ? false : false
  // );
  // const [DegenOverviewPopup, setDegenOverviewPopup] = useState(
  //   theme.isSubdomain ? false : false
  // );
  // const [ReimbursementPopup, setReimbursementPopup] = useState(
  //   theme.isSubdomain ? false : false
  // );
  const [prevCloneData, setPrevCloneData] = useState();

  const setCloneData = (data) => {
    theme.updateCloneData(data, true);
    setPrevCloneData(data);
    setClonePopUp(false);
    document.getElementsByTagName("body")[0].style.fontFamily =
      data.fontStyle === "Default" ? "Comic" : `${data.fontStyle}`;
    document.body.style.backgroundImage = `url(${data.bgimage})`;
    document.body.style.backgroundSize = 'cover';
  };

  const closePopUp = () => {
    theme.updateCloneData(
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
    setPrevCloneData();
    setClonePopUp(false);
    setClonePopupHome(false)
    document.getElementsByTagName("body")[0].style.fontFamily = "";
    document.body.style.backgroundImage = "";
  };


  return (
    <ThemeProvider theme={footerTheme === "light" ? lightTheme : darkTheme}>
    <footer>
      {(clonePopup || continueClone) && (
        <CloneForm
          close={closePopUp}
          setCloneData={setCloneData}
          prevCloneData={prevCloneData}
          dark={theme.isDark}
        />
      )}
      {aboutPopup && (
        <About close={() => setAboutPopUp(false)} dark={theme.isDark} />
      )}
      {HowitworkPopup && (
        <HowitWork close={() => setHowitworkPopup(false)} dark={theme.isDark} />
      )}

      {DegenOverviewPopup && (
        <DegenOverview close={() => setDegenOverviewPopup(false)} dark={theme.isDark} />
      )}

      {ReimbursementPopup && (
        <Reimbursement close={() => setReimbursementPopup(false)} dark={theme.isDark} />
      )}

      <div className="footertop"></div>

      <div className="footerbottom">
        {/* <img className="leftimg" src="imgs/left-footer.png" alt="" /> */}
        <div className="twolist">
          <ul className="list-nav1">
            {/* {!theme.isSubdomain && (
              <li>
                <a href="#" onClick={() => setClonePopUp(true)}>
                  {prevCloneData ? "Continue Clone" : "Free license"}
                </a>
                <span className="column"></span>
              </li>
            )} */}
            <li>
              <a href="#" onClick={() => setClonePopUp(true)} className="active">
                {continueClone ? "Continue Clone" : "Free license"}
              </a>
              <span className="column"></span>
            </li>
            <li>
              <a href="#">Upgrade to v2</a>
              <span className="column"></span>
            </li>
            <li>
              <a href="#" onClick={() => setReimbursementPopup(true)} >100% gas and fees reimbursement</a>
            </li>
            <li>
              <a href='https://dynamicswap.exchange/#bnb-degen' target='_blank'>
                DEGEN: {price}
                <span style={{ marginLeft: '15px', color: '#fcf302' }}>BUY NOW &gt;</span>
              </a>
            </li>
            {/* <li>
              <a href="#">Github</a>
              <span className="column"></span>
            </li>
            <li>
              <a href="#">Telegram</a>
              <span className="column"></span>
            </li>
            <li>
              <a href="#">Reddit</a>
              <span className="column"></span>
            </li>

            <li>
              <a href="#">Twitter</a>
            </li> */}
          </ul>

          <ul className="list-nav2">
            {/* <li>
              Affiliate of <img src="imgs/footer-1inch.png" alt="" />{" "}
              <span className="column"></span>
            </li> */}


            <li>shoji:</li>
            <li>
              <a href="https://smartswap.exchange/" target="_blank" >SmartSwap.exchange</a>
              <span className="column"></span>
            </li>
            <li>
              <a href="https://www.jointer.io/" target="_blank" >Jointer.io</a>
              <span className="column"></span>
            </li>
            <li>
              <a href="http://nft.mx/" target="_blank" >NFT.mx</a>
              <span className="column"></span>
            </li>

            <li>
              <a href="https://pdo.finance/" target="_blank" >PDO.finance </a>
              <span className="column"></span>
            </li>
            <li>
              <a href="#">DegenSwap.io </a>
              <span className="column"></span>
            </li>
            <li>
              <a href="https://dynamicswap.exchange/" target="_blank" >Dynamicswap.exchange </a>
              <span className="column"></span>
            </li>
            <li>
              <a href="https://freez.finance/" target="_blank" >Freez.finance       </a>
              <span className="column"></span>
            </li>
            <li>
              <a href="https://cbdc.science/" target="_blank" >CBDC.science </a>
            </li>
          </ul>
        </div>
        <div className="twologos">
          <a href="#" className="logo-dull">
            <img
              id="blackimg"
              src={
                !theme.isDark
                  ? "imgs/ethereumblack.png"
                  : "imgs/ethereumblack_dark.png"
              }
              alt=""
            />
          </a>
          <a href="#" className="logo-color">
            {" "}
            <img src="imgs/binance.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
    </ThemeProvider>
  );
};
