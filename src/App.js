import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Display } from "./screens/display";
import { Home } from "./screens/home";
import { Test } from "./components/Test";
import axios from "axios";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./config/theme";
import { GlobalStyles } from "./config/global";
import "../src/scss/main.css";
import SnackbarProvider from "react-simple-snackbar";
import { ThemeContext } from "./contexts/ThemeContext";
import { isValidAddress } from "ethereumjs-util";
export default function App() {
  let content;

  const theme = useContext(ThemeContext);
  const [cloneData, setCloneData] = useState();
  const [isloading, setIsloading] = useState(false);
  const [noSubDomain, setNoSubDomain] = useState(false);
  const [subDomainName, setSubDomainName] = useState("");
  const [lightThemeData, setLightThemeData] = useState(lightTheme);
  const getData = async (domain) => {
    setIsloading(true);
    try {
      const res = await axios.get(
        `https://wildcard.bswap.info:1830/api/v1/subdomain/degen/getSubDomain/${domain[0]}`
      );
      if (res.data.response_code === 200) {
        console.log(res.data.result);
        window.lisenceData = {
          bsc: res.data.result.bscLicenseAddress,
          eth: res.data.result.ethLicenseAddress
        }
        const finalData = {
          bgimage: res.data.result.backGroundImage,
          logoImage: res.data.result.logo,
          subDomain: res.data.result.subDomain,
          primaryColor: res.data.result.primaryColors,
          secondaryColor: res.data.result.seconderyColor,
          fontStyle: res.data.result.fontStyle,
          backgroundOverLay: res.data.result.backgroundOverLay,
          swapButtonColor: res.data.result.swapButton,
          logoUrl: res.data.result.logoUrl,
        };
        setCloneData(finalData);
        theme.updateCloneData(finalData, false);
        document.getElementsByTagName("body")[0].classList.add("subdomain");
        if (domain[0].substring(0, 2) === "0x") {
          if (isValidAddress(domain[0])) {
            setNoSubDomain(true);
            // web3Config.setLicenseeData(res.data.result)
          }
        } else {
          // const r = document.querySelector(":root");
          // r.style.setProperty("--text-color", res.data.result.primaryColors);
          // r.style.setProperty(
          //   "--button-bg-color",
          //   res.data.result.seconderyColor
          // );
          // r.style.setProperty(
          //   "--req-bg",
          //   `url(${res.data.result.logo})`
          // );

          document.body.style.backgroundImage = `url(${res.data.result.backGroundImage})`;
          document.body.style.backgroundSize = 'cover';
          const finalData = {
            bgimage: res.data.result.backGroundImage,
            logoImage: res.data.result.logo,
            logoImageDark: res.data.result.logoDark,
            subDomain: res.data.result.subDomain,
            primaryColor: res.data.result.primaryColors,
            secondaryColor: res.data.result.seconderyColor,
            fontStyle: res.data.result.fontStyle,
            backgroundOverLay: res.data.result.backgroundOverLay,
            swapButtonColor: res.data.result.swapButton,
            logoUrl: res.data.result.logoUrl,
          };
          setCloneData(finalData);
          theme.updateCloneData(finalData, false);
          document.getElementsByTagName("body")[0].classList.add("subdomain");
        }
      } else {
        window.lisenceData = { eth: '', bsc: '' };
        setNoSubDomain(true);
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
    }
  };


  useEffect(() => {
    const href = window.location.href;
    const domaindata = href
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split("/")[0];
    const domain = domaindata.split(".");

    setSubDomainName(domain[0]);

    const localhost = domaindata.indexOf("localhost");
    if (domain.length === (localhost === -1 ? 3 : 2)) {
      theme.updateSubDomain(true);
      getData(domain);
    } else {
      document.getElementsByTagName("body")[0].classList.remove("subdomain");
      theme.updateSubDomain(false);
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    if (cloneData) {
      setLightThemeData({
        ...lightThemeData,
        hero_bg: cloneData.primaryColor,
        popup_after: cloneData.primaryColor,
        footer_bg: cloneData.secondaryColor,
        footer_bg1: cloneData.secondaryColor,
        primary_bg: cloneData.primaryColor,
        swapButtonColor: cloneData.swapButtonColor,
      });
    }
  }, [cloneData]);

  useEffect(() => {
    if (theme.preview) {
      setLightThemeData({
        ...lightThemeData,
        hero_bg: theme.cloneData.primaryColor,
        popup_after: theme.cloneData.primaryColor,
        footer_bg: theme.cloneData.secondaryColor,
        footer_bg1: theme.cloneData.secondaryColor,
        primary_bg: theme.cloneData.primaryColor,
        swapButtonColor: theme.cloneData.swapButtonColor,
      });
      document.getElementsByTagName("body")[0].classList.add("subdomain");
    } else {
      if (cloneData) {
        setLightThemeData({
          ...lightThemeData,
          hero_bg: cloneData.primaryColor,
          popup_after: cloneData.primaryColor,
          footer_bg: cloneData.secondaryColor,
          footer_bg1: cloneData.secondaryColor,
          primary_bg: cloneData.primaryColor,
          swapButtonColor: cloneData.swapButtonColor,
        });
      } else {
        setLightThemeData({
          ...lightTheme,
        });
      }
      document.getElementsByTagName("body")[0].classList.remove("subdomain");
    }
  }, [theme.preview, theme.cloneData]);
  content = (
    <ThemeProvider theme={!theme.isDark ? lightThemeData : darkTheme}>
      <SnackbarProvider>
        <>
          <GlobalStyles />
          <Router>
            <div>
              <Switch>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/notfound">
                  <NotFound />
                </Route>
                <Route path="/display">
                  <Display />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </Router>
        </>
      </SnackbarProvider>
    </ThemeProvider>
  );

  return content;
}

function About() {
  return <h2>About</h2>;
}

function NotFound() {
  return (
    <>
      <div
        id="notfoundscreen"
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ alignItems: "center", fontFamily: "comic", fontSize: 40 }}
        >
          <Test />
          <h1 align="center">404</h1>
          <p>Page Not Found</p>
        </div>
        <br />
      </div>
      <footer></footer>
    </>
  );
}
