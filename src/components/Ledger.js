import { useEffect, useState } from "react";
import _ from 'lodash';
import { API_URL } from "../common/constant";

export const Ledger = ({triggerLoad, ...props}) => {
  const [ledger, setLedger] = useState([]);
  const [groupedLedger, setGroupedLedger] = useState([]);
  const [allData, setAllData] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  
  useEffect(() => {
    getTrxDetails();
  }, [triggerLoad]);

  useEffect(() => {
    setActiveTab("all")
    setTimeout(() => {
      window.$(
        ".owl-carousel .owl-nav button.owl-next span"
      ).html = `<i class="fas fa-chevron-right"></i>`;
      window.$(
        ".owl-carousel .owl-nav button.owl-prev"
      ).html = `<i class="fas fa-chevron-left"></i>`;
    }, 100);
  }, []);
  const groupAndSort = arr => {
    const res = [];
    const grouped = _.groupBy(arr, e => (e.crossChainTrx || e.transactionHash));
    Object.values(grouped).forEach(v => {
      if(v.length < 3){
        while(v.length !== 3) v.push({ transactionType: 4 });
      }
      res.push(...v.sort((a, b) => a.transactionType - b.transactionType));
    });
    return res;
  }
  const getTrxDetails = async () => {
    try {
       // const status = "Success";
    const walletAddress = localStorage.getItem("account");
    const url = `${API_URL}api/DEGEN/getTrxDetails?walletAddress=${walletAddress}`;
    const response = await fetch(url);
    const { data } = await response.json();
    console.log(data);
    setLedger(data);
    setAllData(data);
    setGroupedLedger(groupAndSort(data || []));

    if (data && data.length) {
      props.getLedger(data.length);
    }
    } catch (error) {
      
    }
   
  };
  const tabChangeHandler = (name) => {
    
    if (name != "all") {
      const filteredData = allData.filter((e) => e.transactionStatus == name);
      setLedger(filteredData);
      setGroupedLedger(groupAndSort(filteredData));
    } else {
      setLedger(allData);
      setGroupedLedger(groupAndSort(allData));
    }
    setActiveTab(name);
  };
  const getTxsUrl = (item) => {
    let url = "javascript:void";
    if (item.chain == "eth") {
      url = `https://etherscan.io/tx/${item.transactionHash}`;
    } else if (item.chain == "bsc") {
      url = `https://bscscan.com/tx/${item.transactionHash}`;
    }
    return url;
  };

  const toFixed = (num, fixed) => {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

  return (
    <div style={{ display: allData?.length ? 'block' : 'none' }}>
      <div
        className={allData && allData.length ? "swap__ledger" : "swap__ledger"}  // display-none
      >
        <div className="swap__ledger__nav">
          <a href="javascript:void">Ledger</a>
          <i className="fas fa-caret-down" id="ledger-caret"></i>
          <div className="showviews" style={{ display: "none" }}>
            <i className="fas fa-stop gridView"></i>

            <i className="fas fa-th-list listView"></i>
          </div>
        </div>

        <div className="swap__ledger__container">
          <div className="swap__ledger__links">
            <a
              href="javascript:void"
              onClick={() => tabChangeHandler("all")}
              className={activeTab == "all" ? "active" : "not"}
            >
              All
            </a>

            <a
              href="javascript:void"
              onClick={() => tabChangeHandler("Success")}
              className={activeTab == "Success" ? "active" : "not"}
            >
              Completed
            </a>

            <a
              href="javascript:void"
              onClick={() => tabChangeHandler("pending")}
              className={activeTab == "pending" ? "active" : "not"}
            >
              Pending
            </a>
          </div>

          <div className="swap__ledger__twodivs">
            
            {/* changes here */}
            {groupedLedger.map((item, idx) => 
            
              item.transactionType == 1
              ?
              (
              <div className="swap__ledger__twodivs__sent" key={idx}>
                <h3 className="sentBEP">
                  Sent {item.token.split("/")[0]} from{" "}
                  <img height="25" src={item.token_image} alt="" />
                </h3>

                <div className="transaction">
                  <p>
                    <span className="amount_token">{item.amount}</span>
                    {"  "}
                    <span className="amount_token">{item.token.split("/")[0]}</span>
                  </p>
                  <p>{new Date(item.time).toLocaleString()}</p>
                  <i className="fas fa-check-circle"></i>
                  <h4>Transaction Submitted</h4>
                  <span> {item.transactionHash}</span>
                  <a href={getTxsUrl(item)} target="_blank">
                    View transaction
                  </a>
                </div>
              </div>
            ) 
            : 
            item.transactionType == 2
            ?
            (
              <div className="swap__ledger__twodivs__sent" key={idx}>
                <h3 className="sentBEP">
                  Received {item.token.split("/")[1]}
                  <img height="25" src={item.token_image} />
                </h3>

                <div className="transaction">
                  <p>
                    <span className="amount_token">{toFixed(Number(item.amount),8)}</span>
                    {"  "}
                    <span className="amount_token">{item.token.split("/")[1]} </span>
                  </p>
                  
                  <p>{new Date(item.time).toLocaleString()}</p>
                  <i className="fas fa-check-circle"></i>
                  <h4>Transaction Submitted</h4>
                  <span> {item.transactionHash}</span>
                  <a href={getTxsUrl(item)} target="_blank">
                    View transaction
                  </a>
                </div>
              </div>
            )        
            :
            item.transactionType == 3  
            ?
            (
              <div key={idx} className="swap__ledger__twodivs__receivedreward">
              <h3 className="ReceivedERC20">Eligible DEGEN reward <img src="imgs/icon-reciev-degen.png" alt="" />
              </h3>
              <div className="transaction">
                <p>{toFixed(Number(item.amount),8)}</p>
                <p>{new Date(item.time).toLocaleString()}</p>
                <p style={{wordBreak:"break-all",marginBottom: "67px"}}> {item.transactionHash}</p>
                


              </div>
              </div>
            )
            : <div key={idx} className={([0, 1].includes(idx % 3)) ? 'swap__ledger__twodivs__sent' : "swap__ledger__twodivs__receivedreward"} />
            )}

            {/* <div className="swap__ledger__twodivs__received">
              <h3 className="ReceivedERC20">Sent BEP20 from <img src="imgs/sentfrombnb.png" alt="" />
              </h3>
              <div className="transaction">
                <p>2 bSWAP v2</p>
                <p>February 2, 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
            </div>

            <div className="swap__ledger__twodivs__received">
              <h3 className="ReceivedERC20">Received ERC20 from <img src="imgs/icon-reciev-er20.png" alt="" />
              </h3>
              <div className="transaction">
                <p>1 ETH</p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
            </div> */}
            {/* <div className="swap__ledger__twodivs__receivedreward">
              <h3 className="ReceivedERC20">Eligible DEGEN reward <img src="imgs/icon-reciev-degen.png" alt="" />
              </h3>
              <div className="transaction">
                <p>125.36</p>
                <p>Feb 2. 2019, 9:21am PST</p>
                
                {/*
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4> 
                 <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a> */}

                {/* <button className="clamBTN">Claim Your Reward</button>


              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
              <div className="transaction" style={{ display: 'none' }}>
                <p>1 ETH <span>($389)</span></p>
                <p>Feb 2. 2019, 9:21am PST</p>
                <i className="fas fa-check-circle"></i>
                <h4>Transaction Submitted</h4>

                <span> X0456c19d5A61AeA886E6D657EsEF8849565</span>
                <a href="javascript:void">View transaction</a>
              </div>
            </div> */} 
             

             
             
             
             

             
             
          </div>
        </div>

        <div className="swap__ledger__container2">
          <table className="tableLedger" style={{ display: "none" }}>
            <thead>
              <tr>
                <th>
                  <span>sent</span>
                </th>
                <th>
                  <span>receive</span>
                </th>
                <th>
                  <span>reward</span>
                </th>
              </tr>
            </thead>
            <tbody className="thead2">
              <tr>
                <td>
                  <span>time</span>
                  <span>Asset</span>
                  <span>Proof</span>
                </td>
                <td>
                  <span>Time</span>
                  <span>Asset</span>
                  <span>Percentage</span>
                  <span>Proof</span>
                </td>

                <td>
                  <span>time</span>
                  <span>Asset</span>
                  <span>Proof</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>2 bSWAP v2</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>1 ETH</span>
                  <span>100%</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>125.36</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>1 BNB</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>1 ETH</span>

                  <span>37.47%</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>{" "}
                    <i className="fas fa-caret-down icondropdown"></i>
                  </span>
                  <ul className="dropdown">
                    <li>
                      <span></span>
                      <span>0.173ETH</span>
                      <span>17.3%</span>
                      <span>
                        <a href="javascript:void" className="viewTrans">
                          View transaction
                        </a>
                      </span>
                    </li>
                    <li>
                      <span></span>
                      <span>0.2017ETH</span>
                      <span>20.17%</span>
                      <span>
                        <a href="javascript:void" className="viewTrans">
                          View transaction
                        </a>
                      </span>
                    </li>
                    <li>
                      <span></span>
                      <span>0.6253ETH</span>
                      <span>62.53%</span>
                      <span>
                        Pending{" "}
                        <a href="javascript:void" style={{ color: "#fd0352" }}>
                          [Cancel and redeem to wallet]
                        </a>
                      </span>
                    </li>
                  </ul>
                </td>

                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span>125.36</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span></span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST{" "}
                  </span>
                  <span>1 ETH</span>
                  <span>100%</span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
                <td>
                  <span className="dateSpan">
                    February 2. 2019. <br /> 9:21am PST
                  </span>
                  <span></span>
                  <span>
                    <a href="javascript:void" className="viewTrans">
                      View transaction
                    </a>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="view2">
            <div className="sent">
              <div className="title">
                <h4>Sent</h4>
              </div>
              <div className="row1">
                <span>time</span>
                <span>Asset</span>

                <span>Proof</span>
              </div>
              <div className="row2">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span> 2 bSWAP v2</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
              <div className="row3">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span> 1 BNB</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
              <div className="row4">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span></span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
            </div>

            <div className="receive">
              <div className="title">
                <h4>Receive</h4>
              </div>
              <div className="row1">
                <span>time</span>
                <span>Asset</span>
                <span>Percentage</span>
                <span>Proof</span>
              </div>
              <div className="row2">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span>1 ETH</span>
                <span>100%</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
              <div className="row3">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span>1 ETH</span>
                <span>37.47%</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                  <div className="btn-drop">
                    <i className="fas fa-caret-down icondropdown"></i>
                  </div>
                </span>

                <div className="dropdownrow">
                  <div className="part1">
                    <span></span>
                    <span>0.173 ETH</span>
                    <span>17.30%</span>
                    <span>
                      <a href="javascript:void" className="viewTrans">
                        View transaction
                      </a>
                    </span>
                  </div>
                  <div className="part2">
                    <span></span>
                    <span>0.2017 ETH</span>
                    <span>20.17%</span>
                    <span>
                      <a href="javascript:void" className="viewTrans">
                        View transaction
                      </a>
                    </span>
                  </div>
                  <div className="part3">
                    <span></span>
                    <span>0.6253 ETH</span>
                    <span>62.53%</span>
                    <span>
                      <a href="javascript:void" className="viewTrans">
                        Pending{" "}
                        <span className="cancelredeem">
                          [Cancel and redeem to wallet]
                        </span>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div className="row4">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span>1 ETH</span>
                <span>100%</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
            </div>

            <div className="reward">
              <div className="title">
                <h4>Reward</h4>
              </div>
              <div className="row1">
                <span>time</span>
                <span>Asset</span>

                <span>Proof</span>
              </div>
              <div className="row2">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span> 125.36</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
              <div className="row3">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span> 125.36</span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
              <div className="row4">
                <span>
                  February 2. 2019.
                  <br />
                  9:21am PST
                </span>
                <span></span>
                <span>
                  <a href="javascript:void" className="viewTrans">
                    View transaction
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: "40px" }}></div>
    </div>
  );
};
