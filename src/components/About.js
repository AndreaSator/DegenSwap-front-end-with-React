import React, { PureComponent } from "react";
import "./AboutPopup.css";
export default class About extends PureComponent {
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
        <div className="main-box" style={{ marginTop: 100 }}>
          <h1 className="align -center">Meet the DEGEN Team</h1>
          <section id="team-Block">
            <div class="advisor-team-Box">
              <div class="wrapper">
                <div class="s20TeamContainer clearfix" id="our_advisor">
                  <div class="s20Teambox01 clearfix">
                    <div class="s20ttextbox02">Our Advisors</div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="mailto:dee@jointer.io"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-02.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/4/t2-ss_nNs3qoe.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/4/t2-ss_nNs3qoe.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Dee Hock</span>Founder and former CEO of Visa Credit
                      Card Association
                    </div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="mailto:david@jointer.io"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-03.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-03.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/5/t3-ss_X2yzDCr.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/5/t3-ss_X2yzDCr.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>David Weild IV</span>V. Chairman at NASDAQ and the
                      “father” of the JOBS Act
                    </div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="mailto:mike@jointer.io"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-04.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-04.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/6/t4-ss_cODnYZo.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/6/t4-ss_cODnYZo.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span> Mike Lorrey</span>CTO Advisor
                      <br />
                      The co-creator of the prototype of Bitcoin
                    </div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="mailto:ken@jointer.io"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-06.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-06.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/8/t6-ss_PqgnxCI.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/8/t6-ss_PqgnxCI.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Ken Goldman</span>Former Chief Financial Officer of
                      Yahoo!{" "}
                    </div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/bourgi87/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-08.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-08.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/10/sam_burgin_icon_HVcCc9e.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/10/sam_burgin_icon_HVcCc9e.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span> Sam Bourgi</span> Chief Editor Hacked.com
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-105500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-106500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/koen-maris-3791811/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/33/koen.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/33/koen.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/33/01_cT0OyEA_6fmgSuE.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/33/01_cT0OyEA_6fmgSuE.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Koen Maris</span>IOTA Advisor Cybersecurity
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-106000-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-107000-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/alongoren/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/alon.jpg"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/alon.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Alon Goren</span>Founding Partner at Goren Holm
                      Ventures
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-106500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-107500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/robertneivert/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/robert.jpg"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/robert.jpg"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/36/500-logo.png"
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/36/500-logo.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Robert Neivert</span>Venture Partner at 500 Startups
                      Head of blockchain program
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="previous-advisor-team-Box">
              <div class="wrapper">
                <div class="s20TeamContainer clearfix" id="previous_advisor">
                  <div
                    class="s20Teambox01 clearfix"
                    data-102500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-103500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20ttextbox02">PREVIOUS Advisors</div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-103000-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-104000-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="# "
                          target="_blank"
                          rel="noopener noreferrer"
                          class="teamLinkIcon"
                        >
                          {" "}
                        </a>
                        <div class="teamImgNPbox">
                          <img
                            class="lozad mCS_img_loaded" alt=""
                            src="imgs/teamICO-01.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          class="lozad mCS_img_loaded" alt=" "
                          src="imgs/teamSubICO-01.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Professor Eric S. Maskin</span>Harvard University
                      Nobel Memorial Prize in Economics Mechanism Design Expert{" "}
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="# "
                          target="_blank"
                          class="teamLinkIcon"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <div class="teamImgNPbox">
                          <img
                            class="lozad mCS_img_loaded" alt=""
                            src="imgs/teamICO-02.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                      <img
                          class="lozad mCS_img_loaded" alt=" "
                          src="imgs/teamSubICO-01.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Professor Alvin E. Roth</span>Stanford University
                      Nobel Memorial Prize in Economics Market Design expert
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-104500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-105500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com"
                          target="_blank"
                          class="teamLinkIcon"
                          rel="noopener noreferrer"
                        >
                          {" "}
                        </a>
                        <div class="teamImgNPbox">
                        <img
                            class="lozad mCS_img_loaded" alt=""
                            src="imgs/teamICO-03.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                      <img  class="lozad mCS_img_loaded" alt=" "  src="imgs/teamSubICO-01.png"  />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Chris Cox</span>Former Chairman of the U.S.
                      Securities and Exchange Comission [SEC] former U.S.
                      Congress Member{" "}
                    </div>
                  </div>
                  <div class="s20Teambox01 clearfix">
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/daniel-p-ahn-7283967/"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="teamLinkIcon"
                        >
                          {" "}
                        </a>
                        <div class="teamImgNPbox">
                          <img
                            class="lozad mCS_img_loaded"
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-05.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-05.png"
                          />
                        </div>
                      </div>
                      <div class="afterLogo">
                        <img
                          class="lozad mCS_img_loaded"
                          data-src="https://www.elementzero.network/api/private/mainSite/teamMember/7/t5-ss.png"
                          alt=""
                          src="https://www.elementzero.network/api/private/mainSite/teamMember/7/t5-ss.png"
                        />{" "}
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Daniel P. Ahn PhD</span>Chief Economist
                      <br />
                      U.S. Department of State{" "}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="management-team-Box">
              <div class="wrapper">
                <div class="s20TeamContainer clearfix npSMfix01" id="managment">
                  <div class="s20Teambox01 clearfix">
                    <div class="s20ttextbox02">Management</div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-123000-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-124000-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/jude-g-regev-09110214/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-18.png"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/team-18.png"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>
                      Yoda G Regev
                        <br />
                        CEO & CTO
                      </span>
                      Serial Entrepreneur with 5 Startups and 3 exits
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-122500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-123500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="https://www.linkedin.com/in/kylewhitepr/"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/operations01.jpg"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/operations01.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>
                        Kyle White
                        <br />
                        COO
                      </span>
                      Award Winning VC totaling over $16B market cap
                    </div>
                  </div>

                  
                </div>
              </div>
            </div>
            <div class="operation-team-Box">
              <div class="wrapper">
                <div class="s20TeamContainer clearfix " id="operations">
                  <div
                    class="s20Teambox01 clearfix"
                    data-116000-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-117000-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20ttextbox02">Operations</div>
                  </div>

                  <div class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a href="#" target="_blank" class="teamLinkIcon"  ></a>
                        <div class="teamImgNPbox">
                          <img alt="" src="imgs/teamICO-04.png" />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Amber Urquhart</span>Investment LP
                    </div>
                  </div> 

                  <div class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a href="#" target="_blank" class="teamLinkIcon"  ></a>
                        <div class="teamImgNPbox">
                          <img alt="" src="imgs/teamICO-05.png" />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Dan Mahoney</span>Fundraising Manager
                    </div>
                  </div> 

                  <div class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a href="#" target="_blank" class="teamLinkIcon"  ></a>
                        <div class="teamImgNPbox">
                          <img alt="" src="imgs/teamICO-06.png"/>
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Max Dier</span>PDO DAO Manager
                    </div>
                  </div>

                  <div class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a href="#" target="_blank" class="teamLinkIcon"  ></a>
                        <div class="teamImgNPbox">
                          <img alt="" src="imgs/teamICO-07.png" />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Ahmad Bancin</span>Community Admin
                    </div>
                  </div>

                  <div class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a href="#" target="_blank" class="teamLinkIcon"  ></a>
                        <div class="teamImgNPbox">
                          <img alt="" src="imgs/teamICO-08.png" />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Joe Meinen</span>Social Specialist
                    </div>
                  </div> 
                  <div
                    class="s20Teambox01 clearfix" >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="#!"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/corlynne.jpg"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/corlynne.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Corlynne O’Sullivan</span>Crypto Marketing
                    </div>
                  </div>
                  <div
                    class="s20Teambox01 clearfix"
                    data-112500-start="opacity:0; transform: scale(1.3) translate(0px, 0px);"
                    data-113500-start="opacity:1; transform: scale(1) translate(0px, 0px);"
                  >
                    <div class="s20tImgbox ani-5">
                      <div class="s20RotaterBox">
                        <a
                          href="#!"
                          target="_blank"
                          class="teamLinkIcon"
                        ></a>
                        <div class="teamImgNPbox">
                          <img
                            data-src="https://www.elementzero.network/api/private/mainSite/teamMember/None/joyce.jpg"
                            alt=""
                            src="https://www.elementzero.network/api/private/mainSite/teamMember/None/joyce.jpg"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="s20ttextbox">
                      {" "}
                      <span>Joyce Hanson</span>Writer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="VPMainBX">
            <div className="VPSubBX01">
              <div className="ventureBXTitle01">License PARTNERS </div>
            </div>

            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-012.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-044.png" alt="" />{" "}
            </div>
          </div>



          <div className="VPMainBX">
            <div className="VPSubBX01">
              <div className="ventureBXTitle01">Venture Partners </div>
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-01.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-02.png" alt="" /> Hassan (Hatu) Sheikh{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-03.png" alt="" />
              
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-04.png" alt="" />Michael Terpin{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-05.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-06.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-07.png" alt="" /> Andrea
              Castiglione{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-08.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-09.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-010.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-011.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-012.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-013.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-014.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-015.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-016.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-017.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-018.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-019.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-020.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-021.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-022.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-023.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-024.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-025.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-026.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-027.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-028.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-029.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-030.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-031.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-032.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-033.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-034.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-035.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-036.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-037.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-038.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-039.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-040.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-041.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-042.png" alt="" />{" "}
            </div>
            <div className="VPSubBX01">
              {" "}
              <img src="imgs/venture-partners/VP-ICO-045.png" alt="" />{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
