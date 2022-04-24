import React, { PureComponent } from "react"; 
import "./AboutPopup.css";
export default class DegenOverview extends PureComponent {
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
          <h1 className="align -center">DEGEN overview</h1>
          <p className='hiwText01'>DEGEN v2 is a wholly decentralized governance and compensation token created to encourage users to utilize the DegenSwap cross-chain liquidity aggregator by wholly reimbursing gas and fees. </p>
          <p className='hiwText01'>
Fees for swapping using DegenSwap are used to buyback DEGEN from the market.</p>
         
 
        </div> 
        </div> 
    );
  }
}
