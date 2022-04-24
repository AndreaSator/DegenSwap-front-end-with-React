import React, { useState, useEffect } from "react";
const CACHE_KEY = "IS_DARK";

const ThemeContext = React.createContext({
  isDark: null,
  toggleTheme: () => null,
});

const ThemeContextProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const isDarkUserSetting = localStorage.getItem(CACHE_KEY);
    return isDarkUserSetting ? JSON.parse(isDarkUserSetting) : false;
  });
  const [isSubdomain, setIsSubdomain] = useState(false);
  const [preview, setPreview] = useState(false);
  const [cloneData, setCloneData] = useState({
    bgimage: "",
    logoImage: "",
    logoImageDark: "",
    subDomain: "",
    primaryColor: "",
    secondaryColor: "",
    fontStyle: "Default",
    logoUrl: "",
    swapButtonColor: "",
  });
  const toggleTheme = () => {
    setIsDark((prevState) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(!prevState));
      return !prevState;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.getElementsByTagName("body")[0].classList.remove("light");
    } else {
      document.getElementsByTagName("body")[0].classList.add("light");
    }
  }, [isDark]);

  const updateCloneData = (data, type) => {
    setCloneData({
      bgimage: data.bgimage,
      logoImage: data.logoImage,
      logoImageDark: data.logoImageDark,
      subDomain: data.subDomain,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      fontStyle: data.fontStyle,
      logoUrl: data.logoUrl,
      swapButtonColor: data.swapButtonColor,
    });
    setPreview(type);
  };
  const updateSubDomain = (type) => {
    setIsSubdomain(type);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme,
        preview,
        cloneData,
        updateCloneData,
        updateSubDomain,
        isSubdomain,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeContextProvider };
