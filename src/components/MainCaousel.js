import { useState } from "react";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./../config/theme";

export const MainCaousel = () => {
  const[theme, setTheme]=useState("light");
  useEffect(() => {
    setTimeout(() => {
      window.$(
        ".owl-carousel .owl-nav button.owl-next span"
      ).html = `<i class="fas fa-chevron-right"></i>`;
      window.$(
        ".owl-carousel .owl-nav button.owl-prev"
      ).html = `<i class="fas fa-chevron-left"></i>`;
    }, 100);
  }, []);
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
    <div className="main-caousel">
      <div className="container">
        <div
          className="owl-carousel owl-theme hero__content--logos"
          // style={{ padding: "0 40px" }}
        >
          {/* <div className="item"> */}
          {/* <div className="hero__content--logos"> */}
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-01.png" alt="" />
              <p>smart Swap</p>
            </a>
          </div>

          {/* <div className="item">
            <a href="#">
              <img src="imgs/mylogos/luaswap.png" alt="" />
              <p>lua Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/bswap.png" alt="" />
              <p>bSwap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/pancake.png" alt="" />
              <p>pancake Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/bakery.png" alt="" />
              <p>bakery Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/balancer.png" alt="" />
              <p>balancer Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/bancorswap.png" alt="" />
              <p>bancor Swap</p>
            </a>
          </div> 
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/creamswap.png" alt="" />
              <p>cream Swap</p>
            </a>
          </div>*/}
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-02.png" alt="" />
              <p>curve Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-03.png" alt="" />
              <p>Totle Swap</p>
            </a>
          </div>
          {/* <div className="item">
            <a href="#">
              <img src="imgs/logos/logo--2.png" alt="" />
              <p>smart Swap</p>
            </a>
          </div> */}
          {/* <div className="item">
            <a href="#">
              <img src="imgs/logos/dodo.png" alt="" />
              <p>dodo Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/kybersweap.png" alt="" />
              <p>kyberSwap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/mstable.png" alt="" />
              <p>mstable Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/defiswap.png" alt="" />
              <p>defi swap</p>
            </a>
          </div> */}
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-05.png" alt="" />
              <p>zrx swap</p>
            </a>
          </div>
          {/* <div className="item">
            <a href="#">
              <img src="imgs/mylogos/valueswap.png" alt="" />
              <p>value liquid swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/mooniswap.png" alt="" />
              <p>mooni Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/oasis.png" alt="" />
              <p>oasis Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/Layer-3662.png" alt="" />
              <p> shell swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/iearnswap.png" alt="" />
              <p>iearn swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/cofixswap.png" alt="" />
              <p>cofix swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/swerveswap.png" alt="" />
              <p> swerve swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/sushiswap.png" alt="" />
              <p>sushi swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/uniswap.png" alt="" />
              <p>uni swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/aaveswap.png" alt="" />
              <p>aave swap</p>
            </a>
          </div> */}
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-04.png" alt="" />
              <p>Air Swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/logos/tsICO-07.png" alt="" />
              <p>1 inch swap</p>
            </a>
          </div>
          {/* <div className="item">
            <a href="#">
              <img src="imgs/mylogos/synthetixswap.png" alt="" />
              <p> synthetix swap</p>
            </a>
          </div>
          <div className="item">
            <a href="#">
              <img src="imgs/mylogos/miniswap.png" alt="" />
              <p> mini swap</p>
            </a>
          </div> */}
          {/* </div> */}
          {/* </div> */}

          {/* <div className="item">
            <div className="hero__content--logos">
              <a href="#">
                <img src="imgs/logos/smartswap.png" alt="" />
                <p>smart Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/luaswap.png" alt="" />
                <p>lua Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/bswap.png" alt="" />
                <p>bSwap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/pancake.png" alt="" />
                <p>pancake Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/bakery.png" alt="" />
                <p>bakery Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/balancer.png" alt="" />
                <p>balancer Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/bancorswap.png" alt="" />
                <p>bancor Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/creamswap.png" alt="" />
                <p>cream Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/curveswap.png" alt="" />
                <p>curve Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/dodo.png" alt="" />
                <p>dodo Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/kybersweap.png" alt="" />
                <p>kyberSwap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/mstable.png" alt="" />
                <p>mstable Swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/defiswap.png" alt="" />
                <p>defi swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/zrxswap.png" alt="" />
                <p>zrx swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/valueswap.png" alt="" />
                <p>value liquid swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/mooniswap.png" alt="" />
                <p>mooni Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/oasis.png" alt="" />
                <p>oasis Swap</p>
              </a>
              <a href="#">
                <img src="imgs/logos/Layer-3662.png" alt="" />
                <p> shell swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/iearnswap.png" alt="" />
                <p>iearn swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/cofixswap.png" alt="" />
                <p>cofix swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/swerveswap.png" alt="" />
                <p> swerve swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/sushiswap.png" alt="" />
                <p>sushi swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/uniswap.png" alt="" />
                <p>uni swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/aaveswap.png" alt="" />
                <p>aave swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/1inchswap.png" alt="" />
                <p>1 inch swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/synthetixswap.png" alt="" />
                <p> synthetix swap</p>
              </a>
              <a href="#">
                <img src="imgs/mylogos/miniswap.png" alt="" />
                <p> mini swap</p>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
 
};
