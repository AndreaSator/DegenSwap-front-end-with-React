import React, { PureComponent } from "react";
import Web3 from "web3";
import { ChromePicker } from "react-color";
import axios from "axios";
import Highlight from "react-highlight";
import { ZERO_ADDRESS, reimbursement_contract_address_bsc, reimbursement_contract_address_eth, RPC_PROVIDER_ETHEREUM, RPC_PROVIDER_BINANCE, SWAP_Factory_Contract_BINANCE, SWAP_Factory_Contract_ETHEREUM } from "../common/constant"
import CreateLicense from "./CreateLicense";
import { metamask_connection } from "../service/metamask_function";
import { isValidAddress } from "ethereumjs-util";
import InputRange from 'react-input-range';
import reimbursement_abi from '../abi/reimbursement_abi.json';
import token_vault_abi from '../abi/token_vault_abi.json';
import DepoWithPopup from "../components/Deposit-Withdraw";
import { setLicenseeFee } from "../service/license_function";
import notificationConfig from "../common/notificationConfig";
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const isValidURL = (string) => {
  // var res = string.match(
  //   /((http|https):\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g //eslint-disable-line
  // );
  // return res !== null;
  var res = string.match(
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?(\/)?$/gm
  );
  return res !== null;
};
const validatesubDomain = (value) => {
  const reg = /^[a-zA-Z0-9&_-]+$/;
  const isvalid = reg.test(value);
  return isvalid;
};
const copyAffiliateLink = (id) => {
  var copyText = document.getElementById(id);
  copyText.select();
  document.execCommand("copy");
};

export default class CloneForm extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      isOpen1: false,
      value: 68,
      isOpen2: false,
      bgimage: props.prevCloneData ? props.prevCloneData.bgimage : "",
      logoImage: props.prevCloneData ? props.prevCloneData.logoImage : "",
      logoImageDark: props.prevCloneData ? props.prevCloneData.logoImageDark : "",
      error: "",
      isloading: false,
      subDomain: props.prevCloneData ? props.prevCloneData.subDomain : "",
      errormsg: "",
      primaryColor: props.prevCloneData
        ? props.prevCloneData.primaryColor
        : "#fcf302",
      showPrimaryColor: false,
      secondaryColor: props.prevCloneData
        ? props.prevCloneData.secondaryColor
        : "#14b745",
      showSecondaryColor: false,
      formData: {
        primaryColor: { value: "", error: "", errormsg: "" },
        secondaryColor: { value: "", error: "", errormsg: "" },
        subDomain: { value: "", error: "", errormsg: "" },
      },
      visitDomain: "",
      fontStyle: props.prevCloneData
        ? props.prevCloneData.fontStyle
        : "Default",
      backgroundOverLay: "60",
      typeofLicense: "Zero integration",
      changeFee: "Yes",
      changeText: props.prevCloneData ? props.prevCloneData.changeText : "Yes",
      displayToken: "Display token lists",
      logoUrl: props.prevCloneData ? props.prevCloneData.logoUrl : "",
      swapButtonColor: props.prevCloneData
        ? props.prevCloneData.swapButtonColor
        : "#91dc27",
      showSwapButtonColor: false,
      blockchain: {
        Ethereum: false,
        BSC: true,
        Polygon: false,
      },
      bscLicenseAddress: ZERO_ADDRESS,
      ethLicenseAddress: ZERO_ADDRESS,
      bscLicenseFees: 0,
      ethLicenseFees: 0,
      bscLicenseFeesCurrent: 0,
      ethLicenseFeesCurrent: 0,
      bscLicenseTokenBalance: 0,
      ethLicenseTokenBalance: 0,
      allowClone: false,
      licenseeData: null,
      depositWithdrawNetwork: null,
      depositWithdrawVaultAddress: null,
      depositTokenAddress: ZERO_ADDRESS,
      instanceReimbursementBinance: null,
      instanceReimbursementEthereum: null,
      dpstWthdrwPopup: false,
      whichBox: null
    };
    this.preview = this.preview.bind(this);
    this.clearPreview = this.clearPreview.bind(this);
    this.uploadData = this.uploadData.bind(this);
    this.changeFontStyle = this.changeFontStyle.bind(this);
    this.changeOverlay = this.changeOverlay.bind(this);
    this.changeTypeofLicense = this.changeTypeofLicense.bind(this);
    this._onChangeRadio = this._onChangeRadio.bind(this);
    this.closePop = this.closePop.bind(this);
    this._onChangeCheckbox = this._onChangeCheckbox.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      web3: newProps.web3,
      web3Config: newProps.web3Config,
    });
  }

  componentDidMount() {
    this.setState({
      web3Ethereum: new Web3(
        new Web3.providers.WebsocketProvider(RPC_PROVIDER_ETHEREUM)
      ),
      web3Binance: new Web3(
        new Web3.providers.HttpProvider(RPC_PROVIDER_BINANCE)
      ),
    }, async () => {
      await this.initInstance();
      await this.getData([localStorage.getItem("account")])
    });
    // console.log(this.state.coinList)
  }

  async initInstance() {
    let { web3Binance, web3Ethereum } = this.state;
    let instanceReimbursementBinance = null;
    let instanceReimbursementEthereum = null;
    instanceReimbursementBinance = new web3Binance.eth.Contract(
      reimbursement_abi,
      reimbursement_contract_address_bsc
    );
    instanceReimbursementEthereum = new web3Ethereum.eth.Contract(
      reimbursement_abi,
      reimbursement_contract_address_eth
    );

    this.setState(
      {
        instanceReimbursementBinance,
        instanceReimbursementEthereum,
      },
      () => {
      }
    );
  }

  async getFees(network, vaultAddress, projectContractAddress) {
    let currInstance = null;
    if (network === "BSC") {
      currInstance = this.state.instanceReimbursementBinance;
      console.log(currInstance)
      let fees = Number(await currInstance.methods.getLicenseeFee(vaultAddress, projectContractAddress).call());
      let tokenBalance = await currInstance.methods.getAvailableTokens(vaultAddress).call();
      return { fees: fees, tokenBalance: Web3.utils.fromWei(tokenBalance) };
    } else if (network === "Ethereum") {

      currInstance = this.state.instanceReimbursementEthereum;
      console.log(currInstance)
      let fees = Number(await currInstance.methods.getLicenseeFee(vaultAddress, projectContractAddress).call());
      let tokenBalance = await currInstance.methods.getAvailableTokens(vaultAddress).call();
      return { fees: fees, tokenBalance: Web3.utils.fromWei(tokenBalance) };
    }
  }

  handleChangeComplete = (color, node) => {
    this.setState({ [node]: color.hex });
  };
  handleChangeComplete2 = (color) => {
    this.setState({ secondaryColor: color.hex });
  };

  handalFormChange = (e) => {
    this.setState({
      subDomain: e.target.value,
    });
    const isvalid = validatesubDomain(e.target.value);
    if (!isvalid) {
      this.setState({
        errormsg: "Not a valid subdomain",
      });
    } else {
      this.setState({
        errormsg: "",
      });
    }
  };

  getData = async (domain) => {
    // this.setState({
    //   isloading: true,
    // });
    try {
      const res = await axios.get(
        `https://wildcard.bswap.info:1830/api/v1/subdomain/degen/getSubDomain/${domain[0]}`
      );
      console.log(res);
      if (res.data.response_code === 200) {
        if (isValidAddress(domain[0])) {
          let licenseeData = res.data.result;
          if (licenseeData !== null) {
            const href = window.location.href;
            const domaindata = href
              .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
              .split("/")[0];
            // this.clearPreview();
            this.setState({
              licenseeData: licenseeData,
              bscLicenseAddress: licenseeData.bscLicenseAddress,
              ethLicenseAddress: licenseeData.ethLicenseAddress,
              bscLicenseFees: licenseeData.bscLicenseAddress !== ZERO_ADDRESS ? (await this.getFees("BSC", licenseeData.bscLicenseAddress, SWAP_Factory_Contract_BINANCE)).fees : 0,
              ethLicenseFees: licenseeData.ethLicenseAddress !== ZERO_ADDRESS ? (await this.getFees("Ethereum", licenseeData.ethLicenseAddress, SWAP_Factory_Contract_ETHEREUM)).fees : 0,
              bscLicenseTokenBalance: licenseeData.bscLicenseAddress !== ZERO_ADDRESS ? (await this.getFees("BSC", licenseeData.bscLicenseAddress, SWAP_Factory_Contract_BINANCE)).tokenBalance : 0,
              ethLicenseTokenBalance: licenseeData.ethLicenseAddress !== ZERO_ADDRESS ? (await this.getFees("Ethereum", licenseeData.ethLicenseAddress, SWAP_Factory_Contract_ETHEREUM)).tokenBalance : 0,
              visitDomain: `http://${licenseeData.subDomain}.${domaindata}`,
            }, () => {
              this.setIsValidLicenseAddress()
            });
          }
        } else {

        }
      } else if (res.data.response_code === 404) {
        // this.setState({
        //   noSubDomain: true,
        // });
        // setTimeout(() => {
        //   this.openPopup("NoDomain");
        // }, 100);
      }
      // this.setState({
      //   isloading: false,
      // });
    } catch (error) {
      console.log(error)
      console.log(error.response);
      // this.setState({
      //   isloading: false,
      // });
    }
  };

  toggle = (index) => {
    let collapse = "isOpen" + index;

    this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
  };

  changeBg = async () => {
    const file = document.querySelector("#contained-button-file-background").files[0];
    const image = await toBase64(file);
    this.setState({
      bgimage: image,
    });
  };

  changeLogo = async () => {
    const file = document.querySelector("#contained-button-file-logo").files[0];
    const image = await toBase64(file);
    this.setState({
      logoImage: image,
    });
  };

  changeLogoDark = async () => {
    const file = document.querySelector("#contained-button-file-logodark").files[0];
    const image = await toBase64(file);
    this.setState({
      logoImageDark: image,
    });
  };

  toggalColor = (e, colorType, id) => {
    e.stopPropagation();
    document.getElementById(id).checked = true;
    this.setState({
      [colorType]: true,
    });
  };
  toggalColor1 = () => {
    this.setState({
      showSecondaryColor: true,
    });
  };
  changeFontStyle = (e) => {
    this.setState({
      fontStyle: e.target.value,
    });
  };
  changeOverlay = (e) => {
    this.setState({
      backgroundOverLay: e.target.value,
    });
  };

  preview = () => {
    const {
      bgimage,
      logoImage,
      logoImageDark,
      subDomain,
      primaryColor,
      secondaryColor,
      fontStyle,
      backgroundOverLay,
      logoUrl,
      swapButtonColor,
      changeText,
    } = this.state;
    const isvalid = validatesubDomain(subDomain);
    const isValidLogoUrl = isValidURL(logoUrl);
    if (
      bgimage !== "" &&
      logoImage !== "" &&
      logoImageDark !== "" &&
      primaryColor.value !== "#000000" &&
      secondaryColor !== "#000000" &&
      subDomain !== "" &&
      isvalid &&
      isValidLogoUrl
    ) {
      this.setState({
        errormsg: "",
        successmsg: "",
      });
      // const r = document.querySelector(":root");
      // r.style.setProperty("--text-color", primaryColor);
      // r.style.setProperty("--button-bg-color", secondaryColor);
      // r.style.setProperty("--req-bg", `url(${bgimage})`);
      // document.querySelector(".logoimage").src = logoImage;
      // this.props.closePopup("CloneForm");
      this.props.setCloneData({
        bgimage,
        logoImage,
        logoImageDark,
        subDomain,
        primaryColor,
        secondaryColor,
        fontStyle,
        backgroundOverLay,
        logoUrl,
        swapButtonColor,
        changeText,
      });
    } else if (!isvalid) {
      this.setState({
        errormsg: "Please enter valid subdomain",
      });
    } else if (!isValidLogoUrl) {
      this.setState({
        errormsg: "Please enter valid Url for behind your logo",
      });
    } else {
      this.setState({
        errormsg: "All fields are mandatory",
      });
    }
  };

  clearPreview = () => {
    const r = document.querySelector(":root");
    r.style.removeProperty("--text-color");
    r.style.removeProperty("--button-bg-color");
    r.style.removeProperty("--req-bg");
    r.style.removeProperty("--swap-btn-color");
    this.props.setCloneData({});
  };

  uploadData = async () => {
    let { logoUrl } = this.state;
    const {
      bgimage,
      logoImage,
      logoImageDark,
      subDomain,
      primaryColor,
      secondaryColor,
      fontStyle,
      backgroundOverLay,
      swapButtonColor,
      bscLicenseAddress,
      ethLicenseAddress,
      allowClone
    } = this.state;
    const isvalid = validatesubDomain(subDomain);
    const isValidLogoUrl = isValidURL(logoUrl);
    if (
      bgimage !== "" &&
      logoImage !== "" &&
      logoImageDark !== "" &&
      // primaryColor.value !== "#000000" &&
      // secondaryColor !== "#000000" &&
      subDomain !== "" &&
      isvalid &&
      isValidLogoUrl &&
      allowClone
    ) {
      this.setState({
        errormsg: "",
        successmsg: "",
        isloading: true,
      });
      if ((logoUrl).indexOf("https") < 0 || (logoUrl).indexOf("http") < 0) {
        logoUrl = "https://" + logoUrl;
      }
      try {
        const res = await axios.post(
          "https://wildcard.bswap.info:1830/api/v1/subdomain/degen/addSubDomain",
          {
            licenseeAddress: localStorage.getItem("account"),
            bscLicenseAddress: bscLicenseAddress,
            ethLicenseAddress: ethLicenseAddress,
            backGroundImage: bgimage,
            primaryColors: primaryColor,
            seconderyColor: secondaryColor,
            subDomain: subDomain,
            logo: logoImage,
            logoDark: logoImageDark,
            fontStyle,
            backgroundOverLay,
            logoUrl: logoUrl,
            swapButton: swapButtonColor,
          }
        );
        console.log(res);
        if (res.data.response_code === 200) {
          this.setState({
            successmsg: res.data.response_message,
          });
          const href = window.location.href;
          const domaindata = href
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
            .split("/")[0];
          this.setState({
            isloading: false,
            visitDomain: `http://${subDomain}.${domaindata}`,
          });
        } else if (res.data.response_code === 409) {
          this.setState({
            errormsg: res.data.response_message,
            isloading: false,
          });
        } else {
          this.setState({
            errormsg: "Something went wrong please try again later",
            isloading: false,
          });
        }
      } catch (error) {
        console.log(error.response);
        this.setState({
          isloading: false,
        });
      }
    } else if (!isvalid) {
      this.setState({
        errormsg: "Not a valid subdomain",
      });
    } else if (!isValidLogoUrl) {
      this.setState({
        errormsg: "Please enter valid Url for behind your logo",
      });
      notificationConfig.error("Please enter valid Url for behind your logo")
    } else if (logoImage === "") {
      this.setState({
        errormsg: "Please add logo",
      });
      notificationConfig.error("Please add logo")
    } else if (logoImageDark === "") {
      this.setState({
        errormsg: "Please add dark logo",
      });
      notificationConfig.error("Please add logo")
    } else if (!allowClone) {
      this.setState({
        errormsg: "Please create license contract",
      });
      notificationConfig.error("Please create license contract")
    } else {
      this.setState({
        errormsg: "All fields are mandatory",
      });
    }
  };
  changeTypeofLicense = (e) => {
    this.setState({
      typeofLicense: e.target.value,
    });
  };
  closeChromePickerPopUp = (e) => {
    e.stopPropagation();
    this.setState({
      showSecondaryColor: false,
      showPrimaryColor: false,
      showSwapButtonColor: false,
    });
  };

  _onChangeRadio(e) {
    const name = e.target.name;
    this.setState({
      [name]: e.target.value,
    }, () => {
      if (name === "changeFee") {
        this.setIsValidLicenseAddress()
      }
    });
    if (e.target.value === "No") {
      this.setState({
        primaryColor: "#fcf302",
        secondaryColor: "#14b745",
        swapButtonColor: "#91dc27",
      });
    }
  }
  _onChangeCheckbox(e) {
    const name = e.target.name;
    this.setState({
      blockchain: {
        ...this.state.blockchain,
        [name]: e.target.checked,
      },
    });
  }
  changeurl = (e) => {
    const link = e.target.value;
    this.setState({
      logoUrl: link,
    });
  };

  updateLicenseAddress(network, address, fees) {
    // console.log(network, address)
    // console.log(network === "BSC")
    let netlicAdd = (network === "BSC" ? "bscLicenseAddress" : "ethLicenseAddress")
    let netlicFees = (network === "BSC" ? "bscLicenseFees" : "ethLicenseFees")
    let netlicFeesCurrent = (network === "BSC" ? "bscLicenseFeesCurrent" : "ethLicenseFeesCurrent")
    this.setState({
      [netlicAdd]: address,
      [netlicFees]: fees,
      [netlicFeesCurrent]: fees
    }, () => {
      this.setIsValidLicenseAddress();
    })
  }

  async setIsValidLicenseAddress() {
    let { changeFee, blockchain, bscLicenseAddress, ethLicenseAddress } = this.state;
    let isValidLicenseAddress = false;
    if (changeFee === "Yes") {
      if (blockchain.BSC || blockchain.Ethereum) {
        if (blockchain.BSC && bscLicenseAddress !== ZERO_ADDRESS) {
          isValidLicenseAddress = true;
        } else {
          isValidLicenseAddress = false;
        }
        if (blockchain.Ethereum && ethLicenseAddress !== ZERO_ADDRESS) {
          if (blockchain.BSC && bscLicenseAddress !== ZERO_ADDRESS) {
            isValidLicenseAddress = true;
          } else {
            if (blockchain.Ethereum && ethLicenseAddress !== ZERO_ADDRESS && !blockchain.BSC)
              isValidLicenseAddress = true;
            else
              isValidLicenseAddress = false;
          }
        } else {
          if (blockchain.BSC && bscLicenseAddress !== ZERO_ADDRESS && !blockchain.Ethereum) {
            isValidLicenseAddress = true;
          } else {
            isValidLicenseAddress = false;
          }
        }
      } else {
        if (!blockchain.BSC && !blockchain.Ethereum)
          isValidLicenseAddress = false;
        else
          isValidLicenseAddress = true;
      }
      // isValidLicenseAddress = ((bscLicenseAddress !== CONSTANT.ZERO_ADDRESS) || (ethLicenseAddress !== CONSTANT.ZERO_ADDRESS));
    } else {
      isValidLicenseAddress = true;
    }
    this.setState({
      allowClone: isValidLicenseAddress
    }, () => {
      this.forceUpdate()
    })
  }

  async setLicenseeFee(network, reimbursementAddress, vaultAddress, newFees) {

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

    let setLicenseeFeeData = {};

    setLicenseeFeeData["reimbursementAddress"] = reimbursementAddress;
    setLicenseeFeeData["vault"] = vaultAddress;
    setLicenseeFeeData["projectContract"] = network === "Ethereum" ? SWAP_Factory_Contract_ETHEREUM : SWAP_Factory_Contract_BINANCE;
    setLicenseeFeeData["fee"] = Number(newFees);

    await setLicenseeFee(setLicenseeFeeData,
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
        notificationConfig.success('Fees Updated Successfully!');
      },
      async (error) => {
        if (error.code === 4001) {
          notificationConfig.error("Transaction rejected!")
        }
      }
    );
  }

  async showDepWdrwPopup(network, vaultAddress, popup) {
    let { web3Binance, web3Ethereum } = this.state;
    let instanceVault = null;
    if (network === "BSC") {
      instanceVault = new web3Binance.eth.Contract(
        token_vault_abi,
        vaultAddress
      );
    } else if (network === "Ethereum") {
      instanceVault = new web3Ethereum.eth.Contract(
        token_vault_abi,
        vaultAddress
      );
    }
    let tokenAddress = "";
    if (instanceVault._address !== ZERO_ADDRESS) {
      tokenAddress = await instanceVault.methods.reimbursementToken().call();
    }
    this.setState({
      depositTokenAddress: tokenAddress,
      depositWithdrawNetwork: network,
      depositWithdrawVaultAddress: vaultAddress,
      whichBox: popup,
      dpstWthdrwPopup: true
    }, () => {
    })
  }

  async closePop() {
    this.setState({
      dpstWthdrwPopup: false
    })
  }

  render() {
    const {
      bgimage,
      logoImage,
      logoImageDark,
      subDomain,
      primaryColor,
      showPrimaryColor,
      showSecondaryColor,
      secondaryColor,
      errormsg,
      isloading,
      visitDomain,
      fontStyle,
      typeofLicense,
      successmsg,
      logoUrl,
      changeFee,
      displayToken,
      changeText,
      swapButtonColor,
      showSwapButtonColor,
      blockchain,
      ethLicenseAddress,
      bscLicenseAddress,
      dpstWthdrwPopup
    } = this.state;
    const { close, dark } = this.props;
    return (



      <div
        className=""
        id="CloneForm"
        style={dark ? { backgroundColor: "#2c2f36" } : null}
      >


        {dpstWthdrwPopup ?
          <DepoWithPopup
            dark={dark}
            tokenAddress={this.state.depositTokenAddress}
            network={this.state.depositWithdrawNetwork}
            vaultAddress={this.state.depositWithdrawVaultAddress}
            closePopup={this.closePop}
            openPopup={this.openPopup}
            whichBox={this.state.whichBox}
          />
          : null}



        <div className="close">
          <img
            src={dark ? "imgs/xshape-w.png" : "imgs/xshape-B.png"}
            alt=""
            onClick={close}
          />
        </div>
        <div className="main-box" style={{ marginTop: 100 }}>
          <h1 className="align -center">Get Your Own License for FREE</h1>
          <div
            className="d-flex"
            style={{ alignItems: "initial", marginTop: 100 }}
          >
            <div className="clone-step">
              <div className="form-step justify-flex-start">
                <div className="number">1</div>
                <div className="text">Set up your fees and reimbursement</div>
              </div>
              <div className="input-box">
                <div className="title">
                  Do you wish to charge users a few above our fee?
                </div>
                <div className="d-flex justify-flex-start">
                  <div className="m-r-30">
                    <div className="md-radio md-radio-inline">
                      <input
                        type="radio"
                        id="changeFee"
                        name="changeFee"
                        value="Yes"
                        defaultChecked
                        onChange={this._onChangeRadio}
                      />
                      <label htmlFor="changeFee">Yes</label>
                    </div>
                  </div>
                  <div>
                    <div className="md-radio md-radio-inline">
                      <input
                        type="radio"
                        id="changeFee1"
                        name="changeFee"
                        value="No"
                        onChange={this._onChangeRadio}
                      />
                      <label htmlFor="changeFee1">No</label>
                    </div>
                  </div>
                </div>
              </div>
              {changeFee === "Yes" && (
                <>
                  <div className="input-box">
                    <div className="title">
                      Choose blockchain {""}
                      <i class="help-circle">
                        <i
                          class="fas fa-question-circle protip"
                          data-pt-position="top"
                          data-pt-title="demo data"
                          aria-hidden="true"
                        ></i>
                      </i>
                    </div>
                    <div className="d-flex justify-flex-start">
                      <div className="m-r-30">
                        <div className="custom-check-box">
                          <input
                            type="checkbox"
                            id="BSC"
                            name="BSC"
                            value="BSC"
                            defaultChecked
                            onChange={this._onChangeCheckbox}
                          />
                          <label htmlFor="BSC">
                            <span className="fa"></span>
                            BSC
                          </label>
                        </div>
                      </div>
                      <div className="m-r-30">
                        <div className="custom-check-box">
                          <input
                            type="checkbox"
                            id="Ethereum"
                            name="Ethereum"
                            value="Ethereum"
                            onChange={this._onChangeCheckbox}
                          />
                          <label htmlFor="Ethereum">
                            <span className="fa"></span>
                            Ethereum
                          </label>
                        </div>
                      </div>
                      <div>
                        <div className="custom-check-box">
                          <input
                            type="checkbox"
                            id="Polygon"
                            name="Polygon"
                            value="Polygon"
                            onChange={this._onChangeCheckbox}
                          />
                          <label htmlFor="Polygon">
                            <span className="fa"></span>
                            Polygon
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {blockchain.Ethereum && (
                    <CreateLicense reimbursementAddress={reimbursement_contract_address_eth} network="Ethereum" currency="ETH" connectWallet={() => { this.connectWallet() }} web3={this.state.web3} updateLicenseAddress={this.updateLicenseAddress.bind(this)} web3Ethereum={this.state.web3Ethereum}></CreateLicense>
                  )}
                  {blockchain.BSC && (
                    <CreateLicense reimbursementAddress={reimbursement_contract_address_bsc} network="BSC" currency="BNB" connectWallet={() => { this.connectWallet() }} web3={this.state.web3} updateLicenseAddress={this.updateLicenseAddress.bind(this)} web3Binance={this.state.web3Binance}></CreateLicense>
                  )}
                </>
              )}




            </div>
            <div className="clone-line"></div>
            <div className="clone-step">
              <div className="form-step justify-flex-start">
                <div className="number">2</div>
                <div className="text">Set up your design </div>
              </div>
              {/* <div className="input-box">
                <div className="title">Choose the type of license</div>
                <div className="d-flex">
                  <div>
                    <div className="md-radio md-radio-inline">
                      <input
                        type="radio"
                        id="radio147"
                        name="stepin55"
                        value="Zero integration"
                        defaultChecked
                        onChange={this.changeTypeofLicense}
                      />
                      <label htmlFor="radio147">
                        Zero integration{" "}
                        <i class="help-circle">
                          <i
                            class="fas fa-question-circle protip"
                            data-pt-position="top"
                            data-pt-title="Help Text"
                            aria-hidden="true"
                          ></i>
                        </i>
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="md-radio md-radio-inline">
                      <input
                        type="radio"
                        id="radio148"
                        name="stepin55"
                        value="Smart contract integration"
                        onChange={this.changeTypeofLicense}
                      />
                      <label htmlFor="radio148">
                        Smart contract integration{" "}
                        <i class="help-circle">
                          <i
                            class="fas fa-question-circle protip"
                            data-pt-position="top"
                            data-pt-title="Help Text"
                            aria-hidden="true"
                          ></i>
                        </i>
                      </label>
                    </div>
                  </div>
                </div>
              </div> */}
              {typeofLicense === "Zero integration" && (
                <>
                  <div className="input-box">
                    <div className="title">Choose your subdomain name</div>
                    <div className="input-area">
                      <div className="input-data -large">.degenswap.io</div>
                      <input
                        className="input -large"
                        type="text"
                        value={subDomain}
                        onChange={this.handalFormChange}
                      />
                    </div>
                  </div>
                  <div className="input-box -no-margin">
                    <div className="d-flex">
                      <div className="width width-47 m-t-50">
                        <div className="title">Light Logo</div>
                        <div className="input-area">
                          <input
                            accept="image/*"
                            id="contained-button-file-logo"
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.changeLogo.bind(this)}
                          />
                          <label
                            htmlFor="contained-button-file-logo"
                            className="input-data"
                          >
                            Browse
                          </label>
                          <div className="input">Choose&nbsp;file</div>
                        </div>
                      </div>
                      <div className="width width-47 m-t-50">
                        <div className="title">Dark Logo</div>
                        <div className="input-area">
                          <input
                            accept="image/*"
                            id="contained-button-file-logodark"
                            multiple
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.changeLogoDark.bind(this)}
                          />
                          <label
                            htmlFor="contained-button-file-logodark"
                            className="input-data"
                          >
                            Browse
                          </label>
                          <div className="input">Choose&nbsp;file</div>
                        </div>
                      </div>
                      {/* <div className="width width-47 m-t-50">
                    <div className="title">Add a URL link behind your logo</div>
                    <input
                      className="input -no-data"
                      placeholder="https://yourwebsite.com"
                      type="text"
                    />
                  </div> */}
                    </div>
                    {(logoImage !== "" || logoImageDark !== "") && (
                      <div className="d-flex">
                        <div className="width width-47 m-t-50">
                          {logoImage !== "" && (
                            <img src={logoImage} alt="" width="80%" />
                          )}
                        </div>
                        <div className="width width-47 m-t-50">
                          {logoImageDark !== "" && (
                            <img src={logoImageDark} alt="" width="80%" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="input-box -no-margin">
                    <div className="d-flex">
                      <div className="width width-47 m-t-50">
                        <div className="title">Add new background</div>
                        <div className="input-area">
                          <input
                            accept="image/*"
                            id="contained-button-file-background"
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.changeBg.bind(this)}
                          />
                          <label
                            htmlFor="contained-button-file-background"
                            className="input-data"
                          >
                            Browse
                          </label>
                          <div className="input">Choose&nbsp;file</div>
                        </div>
                      </div>
                      <div className="width width-47 m-t-50">
                        <div className="title" style={{ margin: '10px 0 0 0' }}>Background dark layer </div>

                        <div className="dragorInput">
                          <InputRange
                            maxValue={100}
                            minValue={0}
                            value={this.state.ethLicenseFees}
                            formatLabel={value => `${value}%`}
                            onChange={value => this.setState({ ethLicenseFees: value })} />
                        </div>
                      </div>
                    </div>
                    {(bgimage !== "") && (
                      <div className="d-flex">
                        <div className="width width-47 m-t-50">
                          {bgimage !== "" && (
                            <img src={bgimage} alt="" width="80%" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>








                  <div className="input-box">
                    <div className="title">Add a URL link behind your logo</div>
                    <input
                      className="input -no-data"
                      placeholder="https://yourwebsite.com"
                      type="text"
                      value={logoUrl}
                      onChange={this.changeurl}
                    />
                  </div>
                  <div className="input-box">
                    <div className="title">Change button and text</div>
                    <div className="d-flex justify-flex-start">
                      <div className="m-r-30">
                        <div className="md-radio md-radio-inline">
                          <input
                            type="radio"
                            id="radio_text"
                            name="changeText"
                            value="Yes"
                            defaultChecked
                            onClick={this._onChangeRadio}
                          />
                          <label htmlFor="radio_text">Yes</label>
                        </div>
                      </div>
                      <div>
                        <div className="md-radio md-radio-inline">
                          <input
                            type="radio"
                            id="radio_text1"
                            name="changeText"
                            value="No"
                            defaultChecked={changeText === "No"}
                            onClick={this._onChangeRadio}
                          />
                          <label htmlFor="radio_text1">No</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {changeText === "Yes" && (
                    <>
                      <div className="input-box">
                        <div className="title">Select font style</div>
                        <div className="input-area selFix01">
                          <select
                            name="fontStyle"
                            id="fontStyle"
                            className="input -no-data"
                            value={fontStyle}
                            onChange={this.changeFontStyle}
                          >
                            <option value="Default">Default</option>
                            <option value="Montserrat">Montserrat</option>
                            <option value="Nunito">Nunito</option>
                            <option value="Poppins">Poppins</option>
                            <option value="Roboto">Roboto</option>
                          </select>
                        </div>
                      </div>
                      <div className="input-box color-picker-box">
                        <div className="title">Body Color</div>
                        <div className="d-flex mobile-40">
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="radio149"
                              name="stepin50"
                              defaultChecked
                            />
                            <label
                              htmlFor="radio149"
                              onClick={() =>
                                this.setState({ primaryColor: "#fcf302" })
                              }
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>Current color</p>
                                <div
                                  className="color-area"
                                  style={{ backgroundColor: "#fcf302" }}
                                ></div>
                              </div>
                            </label>
                          </div>
                          <div className="right-arrow">
                            <img src="images/right-arrow-w.png" alt="" />
                          </div>
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="radio152"
                              name="stepin50"
                              defaultChecked={primaryColor !== "#fcf302"}
                            />
                            <label
                              htmlFor="radio152"
                              onClick={(e) => {
                                this.toggalColor(
                                  e,
                                  "showPrimaryColor",
                                  "radio152"
                                );
                              }}
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>New color</p>
                                <div
                                  className="color-area"
                                  style={{ background: primaryColor }}
                                ></div>
                                {showPrimaryColor && (
                                  <>
                                    <div
                                      className="overPicker"
                                      onClick={this.closeChromePickerPopUp.bind(
                                        this
                                      )}
                                    ></div>
                                    <div className="color-picker">
                                      <ChromePicker
                                        color={primaryColor}
                                        onChangeComplete={(color) => {
                                          this.handleChangeComplete(
                                            color,
                                            "primaryColor"
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="input-box color-picker-box">
                        <div className="title">Footer Color</div>
                        <div className="d-flex mobile-40">
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="radio151"
                              name="stepin51"
                              defaultChecked
                            />
                            <label
                              htmlFor="radio151"
                              onClick={() =>
                                this.setState({ secondaryColor: "#14b745" })
                              }
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>Current color</p>
                                <div
                                  className="color-area"
                                  style={{ backgroundColor: "#14b745" }}
                                ></div>
                              </div>
                            </label>
                          </div>
                          <div className="right-arrow">
                            <img src="images/right-arrow-w.png" alt="" />
                          </div>
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="radio153"
                              name="stepin51"
                              defaultChecked={secondaryColor !== "#14b745"}
                            />
                            <label
                              htmlFor="radio153"
                              onClick={(e) => {
                                this.toggalColor(
                                  e,
                                  "showSecondaryColor",
                                  "radio153"
                                );
                              }}
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>New color</p>
                                <div
                                  className="color-area"
                                  style={{ background: secondaryColor }}
                                ></div>
                                {showSecondaryColor && (
                                  <>
                                    <div
                                      className="overPicker"
                                      onClick={this.closeChromePickerPopUp.bind(
                                        this
                                      )}
                                    ></div>
                                    <div className="color-picker">
                                      <ChromePicker
                                        color={secondaryColor}
                                        onChangeComplete={(color) => {
                                          this.handleChangeComplete(
                                            color,
                                            "secondaryColor"
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="input-box color-picker-box">
                        <div className="title">Swap button</div>
                        <div className="d-flex mobile-40">
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="swap"
                              name="swapButtonColor"
                              value="s12"
                              defaultChecked
                              onClick={() =>
                                this.setState({
                                  swapButtonColor: "#91dc27",
                                })
                              }
                            />
                            <label
                              htmlFor="swap"
                              onClick={() =>
                                this.setState({ swapButtonColor: "#91dc27" })
                              }
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>Current color</p>
                                <div
                                  className="color-area"
                                  style={{ backgroundColor: "#91dc27" }}
                                ></div>
                              </div>
                            </label>
                          </div>
                          <div className="right-arrow">
                            <img src="images/right-arrow-w.png" alt="" />
                          </div>
                          <div className="md-radio" style={{ width: "100%" }}>
                            <input
                              type="radio"
                              id="swap1"
                              name="swapButtonColor"
                              value="s12"
                              defaultChecked={swapButtonColor !== "#91dc27"}
                            />

                            <label
                              htmlFor="swap1"
                              onClick={(e) => {
                                this.toggalColor(
                                  e,
                                  "showSwapButtonColor",
                                  "swap1"
                                );
                              }}
                              style={{ width: "100%" }}
                            >
                              <div className="color-box d-flex no-responsive">
                                <p>New color</p>
                                <div
                                  className="color-area"
                                  style={{ background: swapButtonColor }}
                                ></div>
                                {showSwapButtonColor && (
                                  <>
                                    <div
                                      className="overPicker"
                                      onClick={this.closeChromePickerPopUp.bind(
                                        this
                                      )}
                                    ></div>
                                    <div className="color-picker">
                                      <ChromePicker
                                        color={swapButtonColor}
                                        onChangeComplete={(color) => {
                                          this.handleChangeComplete(
                                            color,
                                            "swapButtonColor"
                                          );
                                        }}
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {errormsg !== "" && (
                    <p className="m-t-30" style={{ color: "red" }}>
                      {errormsg}
                    </p>
                  )}
                  {successmsg !== "" && (
                    <p className="m-t-30" style={{ color: "#1caf14" }}>
                      {successmsg}
                    </p>
                  )}
                  <div className="input-box">
                    <span className="preview-button" onClick={this.preview}>
                      Preview
                    </span>
                    {visitDomain !== "" && (
                      <span
                        className="preview-button"
                        style={{ marginLeft: 25, display: "inline-block" }}
                        onClick={() => {
                          window.open(visitDomain, "_blank");
                        }}
                      >
                        Go to Page
                      </span>
                    )}
                  </div>
                </>
              )}
              {typeofLicense === "Smart contract integration" && (
                <div id="contract-integration">
                  <div className="m-b-20 m-t-20" style={{ fontSize: 16 }}>
                    Licensee need to call this function in SmartSwap contract:{" "}
                  </div>
                  <div
                    style={{
                      background: "#9c9600",
                      padding: 20,
                      color: "#fff",
                    }}
                  >
                    <Highlight language="javascript">
                      {`//user should approve tokens transfer before calling this function.
    //if no licensee set it to address(0)
    function swap(
        address tokenA, // token that user send to swap ( address(1) for BNB, address(2) for ETH)
        address tokenB, // token that user want to receive ( address(1) for BNB, address(2) for ETH)
        address receiver,   // address that will receive tokens on other chain (user's wallet address)
        uint256 amountA,    // amount of tokens user sends to swap
        address licensee,   // for now, = address(0)
        bool isInvestment,  // for now, = false
        uint128 minimumAmountToClaim,   // do not claim on user behalf less of this amount. Only exception if order fulfilled. For now, = 0
        uint128 limitPice   // Do not match user if token A price less this limit. For now, = 0
    )
        external
        payable
        returns (bool)`}
                    </Highlight>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="m-t-50 align -center">
            {localStorage.getItem("account") ?
              <button
                className="get-license"
                onClick={this.uploadData}
                disabled={isloading || typeofLicense !== "Zero integration"}
              >
                {isloading ? "Cloning.." : "Get Your Own License for FREE"}
              </button>
              :
              <button
                className="get-license"
                onClick={() =>
                  metamask_connection(
                    localStorage.getItem("account"),
                    "ahrefClick"
                  )
                }
                disabled={isloading || typeofLicense !== "Zero integration"}
              >
                {"Connect wallet"}
              </button>}
          </div>
          {visitDomain && typeofLicense === "Zero integration" && (
            <div className="final-contract">
              <h1 className="align -center heading -small">
                Below is your license URL and smart contract
              </h1>
              <div className="d-flex" style={{ alignItems: "initial", flexWrap: "wrap" }}>
                <div className="clone-step v2">
                  <div className="input-box">
                    <div className="title">Your licensee sub domain</div>
                    <div className="input-area">
                      <input
                        className="input -no-data"
                        type="text"
                        value={visitDomain}
                        id="license"
                      />
                    </div>
                  </div>
                </div>
                <div className="clone-step v2">
                  {ethLicenseAddress !== "0x0000000000000000000000000000000000000000" ?
                    <div className="input-box">
                      <div className="title">Your licensee smart contract Ethereum</div>
                      <div className="input-area">


                        <input
                          className="input -no-data"
                          type="text"
                          value={ethLicenseAddress}
                          id="smartLicence"
                        />
                        <div className="small-text">
                          <a href="#" onClick={() => { this.showDepWdrwPopup("Ethereum", ethLicenseAddress, 'deposit') }}>
                            <span className="green">
                              Deposit your reimbursement TOKEN to this smart
                              contract
                            </span>{" "}
                          </a>
                          |{" "}
                          <a href="#" onClick={() => { this.showDepWdrwPopup("Ethereum", ethLicenseAddress, 'withdraw') }}>
                            <span className="red">
                              Withdraw your reimbursement tokens
                            </span>{" "}
                          </a>
                        </div>
                      </div>
                    </div>
                    : null}
                  {bscLicenseAddress !== "0x0000000000000000000000000000000000000000" ?
                    <div className="input-box">
                      <div className="title">Your licensee smart contract BSC</div>
                      <div className="input-area">


                        <input
                          className="input -no-data"
                          type="text"
                          value={bscLicenseAddress}
                          id="smartLicence"
                        />
                        <div className="small-text">
                          <a href="#" onClick={() => { this.showDepWdrwPopup("BSC", bscLicenseAddress, 'deposit') }}>
                            <span className="green">
                              Deposit your reimbursement TOKEN to this smart
                              contract
                            </span>{" "}
                          </a>
                          |{" "}
                          <a href="#" onClick={() => { this.showDepWdrwPopup("BSC", bscLicenseAddress, 'withdraw') }}>
                            <span className="red">
                              Withdraw your reimbursement tokens
                            </span>{" "}
                          </a>
                        </div>
                      </div>

                      <div className="brDragorMBX">
                        <div className="brDragorSBX01">
                          <div className="dragorInput v2">
                            <InputRange
                              maxValue={300}
                              minValue={0}
                              value={this.state.bscLicenseFees}
                              formatLabel={value => `${value / 100}%`}
                              onChange={value => this.setState({ bscLicenseFees: value })} />
                          </div>
                        </div>
                        <div className="brDragorSBX02">
                          <button onClick={() => { this.setLicenseeFee("BSC", reimbursement_contract_address_bsc, this.state.bscLicenseAddress, this.state.bscLicenseFees) }}>SAVE</button>
                        </div>
                      </div>

                    </div> : null}
                </div>

              </div>
            </div>
          )}
          {visitDomain && typeofLicense === "Smart contract integration" && (
            <div className="final-contract">
              <h1 className="align -center heading -small">
                Below is your license URL and integration instruction
              </h1>
              <div className="input-box">
                <div className="title">Your licensee sub domain</div>
                <div className="input-area">
                  <div
                    className="input-data -input-copy"
                    onClick={() => copyAffiliateLink("license1")}
                  >
                    <img src="imgs/copy.png" />
                  </div>

                  <input
                    className="input -no-data"
                    type="text"
                    value={visitDomain}
                    id="license1"
                  />
                </div>
              </div>
              <div className="input-box">
                <div className="d-flex">
                  <div className="title">
                    You need to call this function in bSWAP contract
                  </div>
                  <div>
                    <img src="imgs/copy.png" />
                  </div>
                </div>
                <div className="input-area">
                  <div
                    style={{
                      background: "#9c9600",
                      padding: 20,
                      color: "#fff",
                    }}
                  >
                    <Highlight language="javascript">
                      {`//user should approve tokens transfer before calling this function.
                          //if no licensee set it to address(0)
                          function swap(
                              address tokenA, // token that user send to swap ( address(1) for BNB, address(2) for ETH)
                              address tokenB, // token that user want to receive ( address(1) for BNB, address(2) for ETH)
                              address receiver, // address that will receive tokens on other chain (user's wallet address)
                              uint256 amountA,  // amount of tokens user sends to swap
                              address licensee,   // for now, = address(0)
                              bool isInvestment,  // for now, = false
                              uint128 minimumAmountToClaim,   // do not claim on user behalf less of this amount. Only exception if order fulfilled. For now, = 0
                              uint128 limitPice   // Do not match user if token A price less this limit. For now, = 0
                          )
                              external
                              payable`}
                    </Highlight>
                  </div>
                  <div className="m-t-10">
                    <span className="downloadLink">
                      Download ABI of smart contract file
                    </span>
                  </div>
                </div>
              </div>
              <div className="d-flex" style={{ alignItems: "initial", flexWrap: "wrap" }}>
                <div className="clone-step v2">
                  <div className="input-box">
                    <div className="title">Smart contract address BSC</div>
                    <div className="input-area">
                      <div
                        className="input-data -input-copy"
                        onClick={() => copyAffiliateLink("smartLicence2")}
                      >
                        <img src="imgs/copy.png" />
                      </div>

                      <input
                        className="input -no-data"
                        type="text"
                        value="0x084374b068Eb3db504178b4909eDC26D01226a80"
                        id="smartLicence2"
                      />
                    </div>
                  </div>

                  <div className="brDragorMBX">
                    <div className="brDragorSBX01">
                      <div className="dragorInput v2">
                        <InputRange
                          maxValue={100}
                          minValue={0}
                          value={this.state.ethLicenseFees}
                          formatLabel={value => `${value}%`}
                          onChange={value => this.setState({ ethLicenseFees: value })} />
                      </div>
                    </div>
                    <div className="brDragorSBX02">
                      <button>SAVE</button>
                    </div>
                  </div>



                </div>
                <div className="clone-step v2">
                  <div className="input-box">
                    <div className="title">Smart contract address Ethereum</div>
                    <div className="input-area">
                      <div
                        className="input-data -input-copy"
                        onClick={() => copyAffiliateLink("smartLicence1")}
                      >
                        <img src="imgs/copy.png" />
                      </div>

                      <input
                        className="input -no-data"
                        type="text"
                        value="0x084374b068Eb3db504178b4909eDC26D01226a80"
                        id="smartLicence1"
                      />
                    </div>
                  </div>
                  <div className="brDragorMBX">
                    <div className="brDragorSBX01">
                      <div className="dragorInput v2">
                        <InputRange
                          maxValue={100}
                          minValue={0}
                          value={this.state.ethLicenseFees}
                          formatLabel={value => `${value}%`}
                          onChange={value => this.setState({ ethLicenseFees: value })} />
                      </div>
                    </div>
                    <div className="brDragorSBX02">
                      <button>SAVE</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
