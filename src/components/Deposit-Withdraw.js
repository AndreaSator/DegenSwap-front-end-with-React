import React, { PureComponent } from "react";
import { reimbursement_contract_address_bsc, reimbursement_contract_address_eth } from "../common/constant";
import { depositTokens, reimbursement_contract_address_ETH, withdrawTokens } from "../service/license_function";
import notificationConfig from '../common/notificationConfig'
import "./AboutPopup.css";
import Loader from "react-loader-spinner";
export default class DepoWithPopup extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      depositTokenAmt: 0,
      withdrawTokenAmt: 0,
      network: null,
      vaultAddress: null,
      depositLoading: false,
      withdrawLoading: false
    }
  }
  componentWillReceiveProps(newProps) { }

  componentDidMount() {
    // console.log(this.state.coinList)
  }

  async handleInputChange(event) {
    const { name, value } = event.target;
    if (Number(value) >= 0 && value.length <= 5) {
      this.setState({
        [name]: value
      })
    } else {
      return
    }
  };

  async depositTokens() {
    this.setState({ depositLoading: true })
    let { network, vaultAddress, tokenAddress } = this.props;
    let { depositTokenAmt } = this.state;

    let newNetworkId = localStorage.getItem("chainId")

    if (
      network === "Ethereum" &&
      (newNetworkId === 97 || newNetworkId === 56)
    ) {
      notificationConfig.warning("Change metamask network to Ethereum!");
      this.setState({ depositLoading: false })
      return;
    } else if (
      network === "BSC" &&
      (newNetworkId === 42 || newNetworkId === 1)
    ) {
      notificationConfig.warning("Change metamask network to Binance!");
      this.setState({ depositLoading: false })
      return;
    }

    let setDepositTokensData = {};

    setDepositTokensData["to"] = vaultAddress;
    setDepositTokensData["amount"] = depositTokenAmt;
    setDepositTokensData["tokenAddress"] = tokenAddress;

    depositTokens(
      setDepositTokensData,
      (hash) => {
        this.setState({
          // swapLoading: true,
          // txIdSent: hash,
          // txLinkSend: data[networkId].explorer + '/tx/' + hash,
        });
      },
      async (receipt) => {
        notificationConfig.success('Deposit Tokens Successfully!');
        this.setState({ depositLoading: false })
      },
      async (error) => {
        if (error.code === 4001) {
          notificationConfig.error("Transaction rejected!")
        }
        this.setState({ depositLoading: false })
      }
    );

  }

  async withdrawTokens() {
    this.setState({ withdrawLoading: true })
    let { network, vaultAddress } = this.props;
    let { withdrawTokenAmt } = this.state;

    let newNetworkId = localStorage.getItem("chainId")


    if (
      network === "Ethereum" &&
      (newNetworkId === 97 || newNetworkId === 56)
    ) {
      notificationConfig.warning("Change metamask network to Ethereum!");
      this.setState({ withdrawLoading: false })
      return;
    } else if (
      network === "BSC" &&
      (newNetworkId === 42 || newNetworkId === 1)
    ) {
      notificationConfig.warning("Change metamask network to Binance!");
      this.setState({ withdrawLoading: false })
      return;
    }

    let setWithdrawTokensData = {};

    setWithdrawTokensData["vault"] = vaultAddress;
    setWithdrawTokensData["amount"] = withdrawTokenAmt;
    setWithdrawTokensData["reimbursementAddress"] = network === "BSC" ? reimbursement_contract_address_bsc : reimbursement_contract_address_eth
    // setWithdrawTokensData["tokenAddress"] = tokenAddress;

    withdrawTokens(
      setWithdrawTokensData,
      (hash) => {
        this.setState({
          // swapLoading: true,
          // txIdSent: hash,
          // txLinkSend: data[networkId].explorer + '/tx/' + hash,
        });
      },
      async (receipt) => {
        notificationConfig.success('Withdraw Tokens Successfully!');
        this.setState({ withdrawLoading: false })
      },
      async (error) => {
        if (error.code === 4001) {
          notificationConfig.error("Transaction rejected!")
        }
        this.setState({ withdrawLoading: false })
      }
    );

  }

  render() {
    const { closePopup, dark } = this.props;
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
            onClick={closePopup}
          />
        </div>
        <div className="main-box hiwMBX" >

          <div className="DTabMbx">
            <a className={this.props.whichBox === "deposit" ? "active" : ""} href="#">Deposit</a>
            <a className={this.props.whichBox === "withdraw" ? "active" : ""} href="#">Withdrawal</a>
          </div>
          {this.props.whichBox === "deposit" ?
            <div className="DTabformBX">

              <div className="DTformMBX01">
                <label>Amount</label>
                <input type="number" placeholder="0" defaultValue='' name="depositTokenAmt" onChange={this.handleInputChange.bind(this)} />
                {/* <p className='smlText'>Max available to deposit 1,000,000 [TOKEN]</p> */}
              </div>


              <div className="hiwlinkBX">
                {this.state.depositLoading ?
                  <a href='#'><Loader type="ThreeDots" color="#fff" height={15} width={80} /></a>
                  :
                  <a href='#' onClick={() => { this.depositTokens() }}>DEPOSIT</a>
                }
              </div>
            </div>
            :
            <div className="DTabformBX">

              <div className="DTformMBX01">
                <label>Amount</label>
                <input type="number" name="withdrawTokenAmt" placeholder="0" defaultValue='' onChange={this.handleInputChange.bind(this)} />
                {/* <p className='smlText'>Max available to withdraw 1,000,000 [TOKEN]</p> */}
              </div>


              <div className="hiwlinkBX">
                {this.state.withdrawLoading ?
                  <a href='#'><Loader type="ThreeDots" color="#fff" height={15} width={80} /></a>
                  :
                  <a href='#' onClick={() => { this.withdrawTokens() }}>Withdraw</a>
                }
              </div>
            </div>
          }



        </div>
      </div>
    );
  }
}
