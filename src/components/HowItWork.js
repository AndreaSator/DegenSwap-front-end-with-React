import React, { PureComponent } from "react"; 
import "./AboutPopup.css";
export default class HowitWork extends PureComponent {
  constructor(props) {
    super();
  } 
  componentWillReceiveProps(newProps) {}

  componentDidMount() {
    // console.log(this.state.coinList)
  }

  render() {
    const { close, dark } = this.props;
    return ( 
        <div
        className=""
        id="CloneForm"
        style={dark ? { backgroundColor: "#2c2f36" } : null}
      >
        <div className="close">
          <img
            src={dark ? "imgs/xshape-w.png" : "imgs/xshape-B.png"}
            alt=""
            onClick={close}
          />
        </div>
        <div className="main-box hiwMBX" >
          <h1 className="align -center">How it works</h1>
          <p className='hiwText01'>The DEGEN platform is a blockchain agnostic, cross-chain aggregator that sources liquidity from multiple blockchains and DEXs across the entire DeFi ecosystem, regardless of the blockchain. Therefore, the platform allows users to receive the best price on their trades with one-click.</p>
        <div className="hiwImgBX">
          <img
            src={dark ? "imgs/howItWork-img.png" : "imgs/howItWork-img.png"}
            alt="" 
          />
</div>
 
        </div> 
        </div> 
    );
  }
}
