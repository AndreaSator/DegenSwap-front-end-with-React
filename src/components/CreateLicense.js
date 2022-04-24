import _ from 'lodash';
import Loader from "react-loader-spinner";
import React, { PureComponent } from "react";
import web3 from 'web3';
import { isValidAddress } from 'ethereumjs-util';

// import web3Config from "../config/web3Config";

// import ReimbursementContract from '../helper/reimbursementContract';
import SwapPairAbi from '../abi/swappair_abi.json';
// import { ethers } from 'ethers';
import { SWAP_Factory_Contract_BINANCE, SWAP_Factory_Contract_ETHEREUM, tokenDetails } from '../common/constant';
import { metamask_connection } from '../service/metamask_function';
import { getVaultAddress, newVault } from '../service/license_function';
import notificationConfig from '../common/notificationConfig';

export default class CreateLicense extends PureComponent {

    constructor(props) {
        super(props);
        // this.web3Connected = this.web3Connected.bind(this)
        this.state = {
            address: null,
            web3: null,
            token: "",
            swapPair: "",
            period: 0,
            reimbursementRatio: 0,
            licenseeFees: 0,
            creatingLicense: false,
            crtLicSuccess: false
        }
    }

    async handleLicense(network) {

        let newNetworkId = localStorage.getItem("chainId")

        if (
            network === "Ethereum" &&
            (newNetworkId === "0x61" || newNetworkId === "0x38")
        ) {
            notificationConfig.warning("Change metamask network to Ethereum!");
            return;
        } else if (
            network === "BSC" &&
            (newNetworkId === "0x2A" || newNetworkId === "0x1")
        ) {
            notificationConfig.warning("Change metamask network to Binance!");
            return;
        }

        const {
            token,
            swapPair,
            period,
            reimbursementRatio,
            licenseeFees
        } = this.state;
        // event.preventDefault();

        if (token === "0x" || token === "") {
            notificationConfig.info("Please Enter Proper Token Address");
            return 0;
        }
        if (swapPair === "0x" || swapPair === "") {
            notificationConfig.info("Please Enter Proper Pool Address");
            return 0;
        }
        // if (period === 0) {
        //     notificationConfig.info("Enter Staking Period");
        //     return 0;
        // }

        if (licenseeFees === 0) {
            notificationConfig.info("Enter Fees");
            return 0;
        }

        if (reimbursementRatio === 0) {
            notificationConfig.info("Please Enter Reimbursement Ratio");
            return 0;
        }

        this.setState({ creatingLicense: true })

        // let web3 = web3Config.getWeb3();
        // let networkId = web3Config.getNetworkId();
        // let address = web3Config.getAddress();

        // let reimbursementContract = new ReimbursementContract(web3, networkId);

        let newVaultData = {};


        newVaultData["reimbursementAddress"] = this.props.reimbursementAddress;
        newVaultData["token"] = token;
        newVaultData["isMintable"] = false;
        newVaultData["period"] = Number(period) * 86400;
        newVaultData["reimbursementRatio"] = Number(reimbursementRatio) * 100;
        newVaultData["swapPair"] = swapPair;
        newVaultData["licenseeFee"] = [Number(licenseeFees) * 100];
        newVaultData["projectContract"] = network === "BSC" ? [SWAP_Factory_Contract_BINANCE] : [SWAP_Factory_Contract_ETHEREUM];

        await newVault(newVaultData,
            (hash) => {
                this.setState({
                    // swapLoading: true,
                    // txIdSent: hash,
                    // txLinkSend: data[networkId].explorer + '/tx/' + hash,
                });
            },
            async (receipt) => {
                console.log("receipt")
                console.log(receipt)
                this.setState({ crtLicSuccess: true, creatingLicense: false })
                this.props.updateLicenseAddress(this.props.network, await getVaultAddress(receipt), licenseeFees)
                notificationConfig.success('License Created Successfully!');
            },
            async (error) => {
                this.setState({ creatingLicense: false })
                if (error.code === 4001) {
                    notificationConfig.error("Transaction rejected!")
                }
            }
        );

        // reimbursementContract.newVault(
        //     newVaultData,
        //     (hash) => {
        //         this.setState({
        //             // swapLoading: true,
        //             // txIdSent: hash,
        //             // txLinkSend: data[networkId].explorer + '/tx/' + hash,
        //         });
        //     },
        //     async (receipt) => {
        //         this.setState({ crtLicSuccess: true, creatingLicense: false })
        //         this.props.updateLicenseAddress(this.props.network, await reimbursementContract.getVaultAddress(receipt), licenseeFees)
        //         // notificationConfig.success('License Created Successfully!');
        //     },
        //     async (error) => {
        //         this.setState({ creatingLicense: false })
        //         if (error.code === 4001) {
        //             notificationConfig.error("Transaction rejected!")
        //         }
        //     }
        // );

    }


    floatOnly(event) {
        if (event.shiftKey === true) event.preventDefault();

        var code = event.keyCode;

        if (
            (code >= 48 && code <= 57) ||
            (code >= 96 && code <= 105) ||
            code === 8 ||
            code === 9 ||
            code === 37 ||
            code === 39 ||
            code === 46 ||
            code === 190 ||
            code === 110
        ) {
            // allowed characters
        } else event.preventDefault();

        if (
            event.target.value.indexOf(".") !== -1 &&
            (code === 190 || code === 110)
        )
            event.preventDefault();
    }

    async checkSwapPairTokens() {
        if (this.state.token === "" || this.state.token === "0x") {
            notificationConfig.error("Please enter valid token address!")
            return;
        }
        if (this.state.swapPair === "" || this.state.swapPair === "0x") {
            notificationConfig.error("Please enter valid pair address!")
            return;
        }
        let web3 = null;
        if (this.props.network === "BSC") {
            web3 = this.props.web3Binance;
        } else if (this.props.network === "Ethereum") {
            web3 = this.props.web3Ethereum;
        }

        if (await web3.eth.getCode(this.state.swapPair) !== "0x") {

            let swapPairInstance = await new web3.eth.Contract(
                SwapPairAbi,
                this.state.swapPair
            );

            let isAddressSwapPair = false;

            try {
                let token0 = (await swapPairInstance.methods.token0().call()).toLowerCase();
                let token1 = (await swapPairInstance.methods.token1().call()).toLowerCase();
                console.log("------------------------------------swappair-details---------------------------------")
                console.log("token0 - ", token0)
                console.log("token1 - ", token1)
                console.log("------------------------------------swappair-details---------------------------------")
                if (this.props.network === "BSC") {
                    if ((token0 === (this.state.token).toLowerCase() && token1 === tokenDetails.WBNB.address) || (token1 === (this.state.token).toLowerCase() && token0 === tokenDetails.WBNB.address)) {
                        isAddressSwapPair = true;
                    } else
                        isAddressSwapPair = false;
                } else if (this.props.network === "Ethereum") {
                    if ((token0 === (this.state.token).toLowerCase() && token1 === tokenDetails.WETH.address) || (token1 === (this.state.token).toLowerCase() && token0 === tokenDetails.WETH.address)) {
                        isAddressSwapPair = true;
                    } else
                        isAddressSwapPair = false;
                }
                if (!isAddressSwapPair) {
                    notificationConfig.error("Invalid token pair address!");
                    this.setState({
                        swapPair: "",
                        token: ""
                    })
                } else {
                    notificationConfig.success("Token pair verified!");
                }
                console.log("isAddressSwapPair", isAddressSwapPair)
                // decimal = web3.utils.hexToNumber(decimal._hex);
                // this.setState({ tokenName: name, symbol: symbol, decimalCheck: decimalConfig[decimal.toString()] });
                // isAddressToken = true;
            } catch (e) {
                console.log(e)
            }

        }
    }

    async checkAddress(event) {
        let address = event.target.name;
        let tokenAddress = event.target.value;
        let isAddressValid = false;
        try {
            isAddressValid = isValidAddress(tokenAddress);
        } catch (e) { }
        if (!isAddressValid) {
            notificationConfig.info("Please Enter Proper Address");
            this.setState({ [address]: "" });
            return 0;
        }

        // let tokenInstance = new ethers.Contract(
        //     tokenAddress,
        //     tokenAbi,
        //     web3Config.getWeb3().getSigner(0)
        //   );



        this.setState({ [address]: tokenAddress });
    }

    async handleInputChange(event) {
        const { name, value } = event.target;
        if (name === "licenseeFees" || name === "reimbursementRatio") {
            if (Number(value) <= 100 && Number(value) >= 0 && value.length <= 5) {
                this.setState({
                    [name]: value
                })
            } else {
                return
            }
        } else {
            this.setState({
                [name]: value
            })
        }

    };

    async intOnly(event) {
        if (event.shiftKey === true)
            event.preventDefault();

        var code = event.keyCode;

        if ((code >= 48 && code <= 57) || (code >= 96 && code <= 105) || code === 8 || code === 9 || code === 37 || code === 39 || code === 46) {
            // allowed characters
        } else
            event.preventDefault();
    }

    render() {
        return (
            <div className="input-box">
                <fieldset>
                    <legend>{this.props.network}</legend>
                    <div className="input-box">
                        <div className="title">
                            Choose the extra fee to charge your users{" "}
                            <i class="help-circle">
                                <i
                                    class="fas fa-question-circle protip"
                                    data-pt-position="top"
                                    data-pt-title="We are charging all users 0.3%. If you want to charge your on fees above it, please choose a percent with 2 decimals, for example 0.01% or 0.50%"
                                    aria-hidden="true"
                                ></i>
                            </i>
                            <div className="small-text">
                                Fees automatically deposit to your wallet{" "}
                                <i class="help-circle">
                                    <i
                                        class="fas fa-question-circle protip"
                                        data-pt-position="top"
                                        data-pt-title="demo data"
                                        aria-hidden="true"
                                    ></i>
                                </i>
                            </div>
                        </div>

                        <div className="input-area">
                            <div className="input-data">0%</div>
                            <input className="input" type="text" value={this.state.licenseeFees} name="licenseeFees" onChange={this.handleInputChange.bind(this)} onKeyDown={this.floatOnly.bind(this)} />
                        </div>
                    </div>
                    <div className="input-box">
                        <div className="title">
                            Add your native token smart contract on BSC{" "}
                            <i class="help-circle">
                                <i
                                    class="fas fa-question-circle protip"
                                    data-pt-position="top"
                                    data-pt-title="Help Text"
                                    aria-hidden="true"
                                ></i>
                            </i>
                        </div>
                        <div className="input-area">
                            <div className="input-data">TOKEN</div>
                            <input className="input" type="text" name="token" onChange={this.checkAddress.bind(this)} onBlur={() => this.checkSwapPairTokens()} value={this.state.token} />
                        </div>
                    </div>
                    <div className="input-box">
                        <div className="title">
                            Add a pool contract between your TOKEN to BNB{" "}
                            <i class="help-circle">
                                <i
                                    class="fas fa-question-circle protip"
                                    data-pt-position="top"
                                    data-pt-title="Help Text"
                                    aria-hidden="true"
                                ></i>
                            </i>
                        </div>
                        <div className="input-area">
                            <div className="input-data">TOKEN</div>
                            <input className="input" type="text" name="swapPair" onChange={this.checkAddress.bind(this)} onBlur={() => this.checkSwapPairTokens()} value={this.state.swapPair} />
                        </div>
                    </div>
                    <div className="input-box">
                        <div className="title">
                            How many days users need to stake to get 100% reimbursement?{" "}
                            <i class="help-circle">
                                <i
                                    class="fas fa-question-circle protip"
                                    data-pt-position="top"
                                    data-pt-title="Help Text"
                                    aria-hidden="true"
                                ></i>
                            </i>
                        </div>
                        <div className="input-area">
                            <div className="input-data">DAYS</div>
                            <input className="input" type="text" value={this.state.period} name="period" onChange={this.handleInputChange.bind(this)} onKeyDown={this.intOnly.bind(this)} />
                        </div>
                    </div>

                    <div className="input-box">
                        <div className="title">
                            Choose the token ratio users will need to stake{" "}
                            <i class="help-circle">
                                <i
                                    class="fas fa-question-circle protip"
                                    data-pt-position="top"
                                    data-pt-title="Help Text"
                                    aria-hidden="true"
                                ></i>
                            </i>
                        </div>
                        <div className="input-area">
                            <div className="input-data">: 1</div>
                            <input className="input" type="text" value={this.state.reimbursementRatio} name="reimbursementRatio" onChange={this.handleInputChange.bind(this)} onKeyDown={this.floatOnly.bind(this)} />
                        </div>
                    </div>
                    <div className="input-box">
                        {localStorage.getItem("account") ?
                            this.state.creatingLicense ?
                                <button className="get-license -small">
                                    Creating License<Loader type="ThreeDots" color="#fff" height={15} width={80} />
                                </button>
                                :
                                this.state.crtLicSuccess ?
                                    <button className="get-license -small -green"><i className="fas fa-check"></i> {this.props.network} license been created successfully</button>
                                    :
                                    <button className="get-license -small" onClick={() => { this.handleLicense(this.props.network) }}>Create license on {this.props.network} </button>
                            :
                            <button className="get-license -small" onClick={() =>
                                metamask_connection(
                                    localStorage.getItem("account"),
                                    "ahrefClick"
                                )
                            }>Connect your {this.props.network} wallet to create a license on {this.props.network} </button>
                        }
                    </div>
                </fieldset>
            </div>
        );
    }
}