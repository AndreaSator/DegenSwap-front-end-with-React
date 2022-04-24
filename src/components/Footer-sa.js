import { useEffect, useState } from "react";

export const Footer = () => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    let mytheme = localStorage.getItem("mytheme");
    if (mytheme !== null) {
      setTheme(mytheme);
    } else {
      setTheme("light");
    }
  }, []);
  // console.log(theme);
  return (
    <footer>
      <div
        className="footertop"
        style={
          theme === "light"
            ? { backgroundColor: "#fbf303" }
            : { backgroundColor: "#2c2f36" }
        }
      ></div>

      <div className="footerbottom">
        <img className="leftimg" src="imgs/left-footer.png" alt="" />
        <div className="twolist">
          <ul className="list-nav1">
            <li>
              <a href="#">Upgrade to v2</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Voting</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Github</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Telegram</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Reddit</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>

            <li>
              <a href="#">Twitter</a>
            </li>
          </ul>

          <ul className="list-nav2">
            <li>
              Affiliate of <img src="imgs/footer-1inch.png" alt="" />{" "}
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>Powered By Atom Foundation:</li>
            <li>
              <a href="#">Jointer.io</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">BSCswap.com</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>

            <li>
              <a href="#">SmartSwap.exchange</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">ZERO/1</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">ElementZero.network</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Packey.insure</a>
              <img src="imgs/column.png" alt="" className="column" />
            </li>
            <li>
              <a href="#">Mass.investments</a>
            </li>
          </ul>
        </div>
        <div className="twologos">
          <a href="#">
            <img
              id="blackimg"
              src={
                theme === "light"
                  ? "imgs/ethereumblack.png"
                  : "imgs/ethereumblack_dark.png"
              }
              alt=""
            />
          </a>
          <a href="#">
            {" "}
            <img src="imgs/binance.png" alt="" />
          </a>
        </div>
      </div>
    </footer>
  );
};
