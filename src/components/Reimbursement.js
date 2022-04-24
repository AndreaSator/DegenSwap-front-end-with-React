import React, { PureComponent } from "react"; 
import "./AboutPopup.css";
export default class Reimbursement extends PureComponent {
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
          <h1 className="align -center">100% gas and fees reimbursement</h1>
          <p className='hiwText01'>DEGEN users have the option to receive 100% reimbursement for their gas and swap fees. Users are able to claim reimbursements via the reimbursement staking contract. To release reimbursements, users must stake the 1:1 equal amount of DEGEN for one year, but will be able to release partial amounts of the reimbursement if withdrawn at any time before the 1 year period . The pending balance accumulates and the user is able to claim the rest.   </p>
          <p className='hiwText01'>
              <b>Example </b><br/><br/>
          If over the year a user spent over $1000 or more on gas, at any time he can be reimbursed for such cost even if the DEGEN token value is higher due to appreciation.</p>
         
         <div className="hiwlinkBX"> <a href='#'>GET REIMBURSED</a>  </div>
 
        </div> 
        </div> 
    );
  }
}
