import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { NumberContext } from "../api";
// let NumberContext = React.createContext();
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./../config/theme";
import { GlobalStyles } from "./../config/global";
// const NumberContext = React.createContext();

export const Display = () => {
  const { Provider, Consumer } = React.createContext();
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    // if the theme is not light, then set it to dark
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("mytheme", "dark");
      // otherwise, it should be light
    } else {
      setTheme("light");
      localStorage.setItem("mytheme", "light");
    }
  };

  const history = useHistory();
  useEffect(() => {
    let mytheme = localStorage.getItem("mytheme");
    setTheme(mytheme);
    // alert(mytheme)
    // history.push("/");
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      {/* <NumberContext.Consumer> */}
      <>
        {/* <GlobalStyles /> */}
        {/* {value => <div style={{ flex: '1 1 200', backgroundColor: 'green' }}>
                        <p id='gan'>animation test.</p>
                        <h1> Context value-- {value}.</h1>
                    </div>} */}
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
            //onClick={() => history.push('/')}
            style={{ alignItems: "center", fontFamily: "comic", fontSize: 50 }}
          >
            {/* <Test /> */}
            <h1
              onClick={() => {
                toggleTheme();
                //  alert(`Do you want to change ${theme} theme ?`)
              }}
              align="center"
            >
              Theme test
            </h1>
            <h1>
              It's a {theme === "light" ? "dark Theme" : "light Theme"} new!
            </h1>
            {/* <p>Page Not Found</p> */}
          </div>
          <br />
        </div>
      </>
      {/* </NumberContext.Consumer> */}
    </ThemeProvider>
  );
};
