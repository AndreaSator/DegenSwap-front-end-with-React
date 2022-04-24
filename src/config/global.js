import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::after {
   // background :${({ theme }) => theme.header_bg}; 
  }

  *::before {
    //box-sizing: border-box;
   // background :${({ theme }) => theme.header_bg}; 
  }

  body {
    background :${({ theme }) => theme.hero_bg};
    color: ${({ theme }) => theme.text}; 
  }
  
  p,h1,h2,h3,h4,h5,h6 {
    color: ${({ theme }) => theme.heading};
 
  }
  .header {
    display:flex; 
    align-items:center; 
    background :${({ theme }) => theme.header_bg}; 
    flex-wrap:wrap; 
    justify-content:space-between;
  }

  /* .hero { 
    background :${({ theme }) => theme.hero_bg};
  } */

footer .footerbottom {
  background :${({ theme }) => theme.footer_bg};
}
.presalesmartswap {
  color:${({ theme }) => theme.presalesmartswap_hover};
}
.swap__ledger__nav a {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__links a.not{
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs h3 {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs .transaction > p:first-of-type {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs .transaction > p:nth-of-type(2) {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs .transaction > span {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs .transaction i {
  color: ${({ theme }) => theme.heading};
}
.swap__ledger__twodivs .transaction {
 // color: ${({ theme }) => theme.heading};
  border-bottom:1px solid ${({ theme }) => theme.heading};
}

table, th, td {
  border: 1px solid red;
}
.swap__ledger__container2 .view2 .receive .row1,.swap__ledger__container2 .view2 .reward .row1,.swap__ledger__container2 .view2 .sent .row1 {
   border-top:2px solid ${({ theme }) => theme.heading}; 
   border-bottom:2px solid ${({ theme }) => theme.heading}; 
}
  .swap__ledger__container2 .view2 .receive .row1,.swap__ledger__container2 .view2 .receive .row2,.swap__ledger__container2 .view2 .receive .row3,.swap__ledger__container2 .view2 .receive .row4,.swap__ledger__container2 .view2 .reward .row1,.swap__ledger__container2 .view2 .reward .row2,.swap__ledger__container2 .view2 .reward .row3,.swap__ledger__container2 .view2 .reward .row4,.swap__ledger__container2 .view2 .sent .row1,.swap__ledger__container2 .view2 .sent .row2,.swap__ledger__container2 .view2 .sent .row3,.swap__ledger__container2 .view2 .sent .row4 {
      border-right:1px solid ${({ theme }) => theme.heading};  
  }  
  .swap__ledger__container2 .view2 .receive .row2,.swap__ledger__container2 .view2 .receive .row3,.swap__ledger__container2 .view2 .receive .row4,.swap__ledger__container2 .view2 .reward .row2,.swap__ledger__container2 .view2 .reward .row3,.swap__ledger__container2 .view2 .reward .row4,.swap__ledger__container2 .view2 .sent .row2,.swap__ledger__container2 .view2 .sent .row3,.swap__ledger__container2 .view2 .sent .row4 {
    border-bottom:1px solid ${({ theme }) => theme.heading}; 
  }
  .mainBtn ,.swap-advanced p {
    color: ${({ theme }) => theme.heading};
  }
  .right-sidemenu {
    background :${({ theme }) => theme.header_bg}; 
  }
  .Gas-price .content-slippage,.slippage-tolerance .content-slippage {color: ${({
  theme,
}) => theme.heading};}
.Gas-price .content-slippage span,.slippage-tolerance .content-slippage span {color: ${({
  theme,
}) => theme.heading};}
.Gas-price .content-slippage span:nth-child(1),.slippage-tolerance .content-slippage span:nth-child(1) {color: ${({
  theme,
}) => theme.heading};}
.Gas-price .content-slippage p span:nth-child(1),.slippage-tolerance .content-slippage p span:nth-child(1) {color: ${({
  theme,
}) => theme.heading};}
.Gas-price .content-slippage p span:nth-child(2),.slippage-tolerance .content-slippage p span:nth-child(2) {color: ${({
  theme,
}) => theme.heading};}
.Gas-price .content-slippage p span:nth-child(2).rotate,.slippage-tolerance .content-slippage p span:nth-child(2).rotate {color: ${({
  theme,
}) => theme.heading};}

.liquidiy-resource .liquid-content {color: ${({ theme }) => theme.heading};}
.liquidiy-resource .liquid-content > span {color: ${({ theme }) =>
    theme.heading};}
.liquidiy-resource .liquid-content p span {color: ${({ theme }) =>
    theme.heading};}
.liquidiy-resource .liquid-content p span:nth-child(1) {color: ${({ theme }) =>
    theme.heading};}
.liquidiy-resource .liquid-content p span:nth-child(2) {color: ${({ theme }) =>
    theme.heading};}  
.powered-by-menu h2 {color: ${({ theme }) => theme.heading};}

.powered-by-menu p ,.copyright-menu p {color: ${({ theme }) => theme.heading};}

.powered-by-menu .donate ,.list-info ul li a {color: ${({ theme }) =>
    theme.heading};}

.custom-token .custom-content, .owl-carousel .owl-nav button.owl-next span {color: ${({
      theme,
    }) => theme.heading};}
.custom-token .custom-content > span {color: ${({ theme }) => theme.heading};}
.custom-token .custom-content > span i {color: ${({ theme }) => theme.heading};}
.custom-token .custom-content p span {color: ${({ theme }) => theme.heading};}
.custom-token .custom-content p span:nth-child(1) {color: ${({ theme }) =>
    theme.heading};}
.custom-token .custom-content p span:nth-child(2) {color: ${({ theme }) =>
    theme.heading};}
.library .dropdownlibrary, .library , .library > p , .library > p span ,  .library > p span.rotate  {color: ${({
      theme,
    }) => theme.heading};}
.library .dropdownlibrary.slide, .About ,.About > p ,.About > p span , .About > p span.rotate , .About .dropdownAbout , .About .dropdownAbout.slide , .About .dropdownAbout a , .About .dropdownAbout a i  {color: ${({
      theme,
    }) => theme.heading};}
.library .dropdownlibrary a, .commuity, .commuity > p, .commuity > p span, .commuity > p span.rotate,.commuity .dropdowncommuity, .commuity .dropdowncommuity.slide, .commuity .dropdowncommuity a, .commuity .dropdowncommuity a i {color: ${({
      theme,
    }) => theme.heading};}
// .liquidiy-resource .liquid-group > div {
//   color: ${({ theme }) => theme.heading};
// }
.liquidiy-resource .liquid-group .AAVE-Liq {
  color: ${({ theme }) => theme.heading};
}
#blackimg {
  /* background: ${({ theme }) => theme.footer_bg1}; */
}
.swap__ledger__container2 .tableLedger tbody tr td .viewTrans{
  color: ${({ theme }) => theme.viewTrans};
}
// footer .footertop {
//   background-image:url(${({ theme }) => theme.footerto_bg});
// }
.fa-chevron-left:before {
  color: ${({ theme }) => theme.heading};
}
.owl-carousel .owl-nav button.owl-next i {
  color: ${({ theme }) => theme.heading};
}
.hero__content--logos a p , .hero__content--form .input-logos i {
  color: ${({ theme }) => theme.heading};
}
.hero__content--form{
  background: ${({ theme }) => theme.popup};
}
.hero__content--form .connect-wallet {
  background-color:${({ theme }) => theme.connect_wallet}; 
}
.hero__content--form .input-group input {
  background: ${({ theme }) => theme.popup}; 
}
.hero__content--form .input-group .BEP , .hero__content--form .input-group .bSWAP{
  color: ${({ theme }) => theme.heading};
}
.popup::after { 
  background-color: ${({ theme }) => theme.popup_after};
  
}
.popup .wrap {
  background: ${({ theme }) => theme.popup_modal};
}
.popup .wrap .inputgroup input{
  background: ${({ theme }) => theme.popup_modal};
}
.popup .wrap .tokenlist ul li , .popup .wrap .havetrouble a{
  color:${({ theme }) => theme.heading};
}
#inputID::placeholder {
  color:${({ theme }) => theme.heading};
  opacity: 1;
}
#inputID::-webkit-input-placeholder {
  color:${({ theme }) => theme.heading};
  opacity: 1;
}
input[type="text"] , input[type="number"] , input[type="checkbox"] {    
  color:${({ theme }) => theme.heading};
 
}
.hero__content--form .input-group input, .popup .wrap .inputgroup  {
  border: 2px solid ${({ theme }) => theme.input_boder};
}
<<<<<<< src/config/global.js
 .bottom-imgs {
  cursor: pointer;
}
 .modal-paper{
  color:  ${({ theme }) => theme.heading};
  background-color: ${({ theme }) => theme.popup_modal};
  border:none;
  padding: 0px 0px 20px 0px;
  border-radius: 10px;
 }
 .chain-popup .chain-wrap{
   background-color :${({ theme }) => theme.popup_modal};
   color:  ${({ theme }) => theme.heading};
   border: 2px solid ${({ theme }) => theme.heading};
 }
 .chain-popup .chain-wrap .chain-list ul li{
  color:  ${({ theme }) => theme.heading};
 }
 .chain-popup .chain-wrap .inputgroup input{
  background-color :${({ theme }) => theme.popup_modal};
 }
 .havetrouble a{
  color:  ${({ theme }) => theme.heading};

 }
 .wrap{
  background-color :${({ theme }) => theme.popup_modal};
  color:  ${({ theme }) => theme.heading};
  border: 2px solid ${({ theme }) => theme.heading};
}
.chain-popup .chain-wrap .select-token .popupspan{
  background-color :${({ theme }) => theme.popup_modal};
  color:  ${({ theme }) => theme.heading};
}
.popup .wrap .select-token .popupspan{
  background-color :${({ theme }) => theme.popup_modal};
  color:  ${({ theme }) => theme.heading};
}
input::placeholder{
  color:  ${({ theme }) => theme.heading};
}
label{
  color:  ${({ theme }) => theme.heading};

}
.custom-values #inputID{
  background-color: ${({ theme }) => theme.popup_modal};
  color:  ${({ theme }) => theme.heading};
}
// .liquidiy-resource .liquid-group .smart{
//   color:  ${({ theme }) => theme.heading};
// }
// .liquidiy-resource .liquid-group .inchlp-mig{
//   color:  ${({ theme }) => theme.heading};
// }
// .liquidiy-resource .liquid-group .inchlp{
//   color:  ${({ theme }) => theme.heading};
// }

.alert-popup-header{
  height: 45px;
    background: #FEC402;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center;
    padding: 3px;
}
.b-alert-close{
  background: #fff70024;
    color: #fec402;
    font-weight: 700;
    border-radius: 16px;
}
#transition-modal-title{
  display: flex;
    align-items: center;
    margin: 8px 0px 0px 10px;
}
.display-none{
  display: none;
}

//  custom style
.bg_main{
  background: ${({ theme }) => theme.bg_main};
}

.custom-table .table-head .cus-th {
  color:${({ theme }) => theme.text_color};
}
.table-body .cus-td{
  color:${({ theme }) => theme.text_color};
}
.light-text{
  color:${({ theme }) => theme.light_text};
}
.cus-select select {
  /* background:${({ theme }) => theme.select_primary}; */
}

.cus-select .select {
  /* background:${({ theme }) => theme.select_primary}; */

}
.cus-select select {
  color:${({ theme }) => theme.heading};
  font-weight:500;
}
/* Arrow */
.cus-select .select::after {
  background:${({ theme }) => theme.select_primary};
}
/* Transition */
.cus-select .select:hover::after {
  color: #000;
}

.modal-wrap .modal-paper {
  background:${({ theme }) => theme.cus_modal};
}

.modal-wrap .modal-paper .MuiButton-contained {
  background:${({ theme }) => theme.primary_btn};
}

.modal-wrap .modal-paper .MuiButton-contained:hover{
  background:${({ theme }) => theme.primary_btn_hover};
}

.modal-wrap .modal-paper .MuiOutlinedInput-input {
  color:${({ theme }) => theme.input_color};
}
.chain-popup::after{
  background:${({ theme }) => theme.hero_bg};
  opacity:0.9;
}
#blackimg {
  /* background: ${({ theme }) => theme.footer_bg1}; */
}
.swap__ledger__container2 .tableLedger tbody tr td .viewTrans{
  color: ${({ theme }) => theme.viewTrans};
}
// footer .footertop {
//   background-color:${({ theme }) => theme.hero_bg};
// }
footer .footertop::before {
  background-image:url(${({ theme }) => theme.footerto_bg});
}
.fa-chevron-left:before {
  color: ${({ theme }) => theme.heading};
}
.owl-carousel .owl-nav button.owl-next i {
  color: ${({ theme }) => theme.heading};
}
.hero__content--logos a p , .hero__content--form .input-logos i {
  color: ${({ theme }) => theme.heading};
}
.hero__content--form{
  background: ${({ theme }) => theme.popup};
}
.hero__content--form .connect-wallet {
  background-color:${({ theme }) => theme.connect_wallet}; 
}
.hero__content--form .input-group input {
  background: ${({ theme }) => theme.popup};
}
.hero__content--form .input-group .BEP , .hero__content--form .input-group .bSWAP{
  color: ${({ theme }) => theme.heading};
}
.popup::after { 
  background-color: ${({ theme }) => theme.popup_after};
  opacity:0.9;
  
}
.popup .wrap {
  background: ${({ theme }) => theme.popup_modal};
}
.popup .wrap .inputgroup input{
  background: ${({ theme }) => theme.popup_modal};
}
.popup .wrap .tokenlist ul li , .popup .wrap .havetrouble a{
  color:${({ theme }) => theme.heading};
}
#inputID::placeholder {
  color:${({ theme }) => theme.heading};
  opacity: 1;
}
#inputID::-webkit-input-placeholder {
  color:${({ theme }) => theme.heading};
  opacity: 1;
}
input[type="text"] , input[type="checkbox"] {    
  color:${({ theme }) => theme.heading};
}

.subdomain .connect-wallet{
  background:transparent;
}

.subdomain .primary-btn::before{
  background: ${({ theme }) => theme.footer_bg};
}
.subdomain .swap-btn::before{
  background: ${({ theme }) => theme.swapButtonColor};
}
.subdomain.light .primary-text{
  color:${({ theme }) => theme.hero_bg} !important;
  filter: brightness(0.3) !important;
}
.subdomain .primary-text{
  color:#fff !important;
}
.subdomain.light .hero__content .beforeUsing p:not(:last-child)::after{
  background-color: ${({ theme }) => theme.footer_bg} !important;
}
.subdomain .hero__content .beforeUsing p:not(:last-child)::after{
  background-color: #fff !important;
}
.subdomain.light footer .footerbottom .list-nav1 > li:hover a{
  color: ${({ theme }) => theme.footer_bg} !important;
  filter: brightness(2);
}
.subdomain footer .footerbottom .list-nav1 > li:hover a{
  color: #fff !important;
  filter: brightness(0.8);
}
.subdomain.light footer .column{
  background-color: ${({ theme }) => theme.footer_bg} !important;
  filter: brightness(2);
}
.subdomain footer .column{
  background-color: #fff !important;
  filter: brightness(0.8);
}

.subdomain .liquidiy-resource .liquid-group > div{
  background: none;
  border-color: ${({ theme }) => theme.primary_bg};
  color:#fff;
}

.subdomain .swap-advanced .five-logos > div.active, .subdomain .liquidiy-resource .liquid-group > div.active{
  background-color: ${({ theme }) => theme.primary_bg};
  border-color: ${({ theme }) => theme.primary_bg};
  filter: brightness(1.5);
  color: #000;
}
.subdomain .swap-advanced .five-logos > div.active{
  background-color: #fff;
  border-color: #fff;
}

.subdomain.light .swap-advanced .five-logos > div{
  border-color: ${({ theme }) => theme.footer_bg};
  background-color: transparent;
  color:${({ theme }) => theme.footer_bg} !important;
}
.subdomain.light .liquidiy-resource .liquid-group > div{
  background: none;
  border-color: ${({ theme }) => theme.footer_bg};
  color:${({ theme }) => theme.footer_bg} !important
}
.subdomain.light .liquidiy-resource .liquid-group > div.active{
  background-color: ${({ theme }) => theme.footer_bg};
  border-color: ${({ theme }) => theme.footer_bg};
  color:#000 !important
}
.subdomain .Gas-price .values .selectvalue, .subdomain .slippage-tolerance .values .selectvalue, .subdomain .Gas-price .values .custom-values input, .subdomain .slippage-tolerance .values .custom-values input{
  border-color: ${({ theme }) => theme.primary_bg};
  background-color: transparent;
}
.subdomain .Gas-price .values .selectvalue span, .subdomain .slippage-tolerance .values .selectvalue span{
  color:#ffffff
}
.subdomain .Gas-price .values .selectvalue span.active, .subdomain .slippage-tolerance .values .selectvalue span.active{
  color:#000000
}
.subdomain .Gas-price .values .selectvalue span.active, .subdomain .slippage-tolerance .values .selectvalue span.active{
  background-color: ${({ theme }) => theme.primary_bg};
  filter: brightness(1.5);
}
.subdomain.light .Gas-price .values .selectvalue, .subdomain.light .slippage-tolerance .values .selectvalue, .subdomain.light .Gas-price .values .custom-values input, .subdomain.light .slippage-tolerance .values .custom-values input{
  border-color: ${({ theme }) => theme.footer_bg};
  background-color: transparent;
}
.subdomain.light .Gas-price .values .selectvalue span, .subdomain.light .slippage-tolerance .values .selectvalue span{
  color:#000000 
}
.subdomain.light .Gas-price .values .selectvalue span.active, .subdomain.light .slippage-tolerance .values .selectvalue span.active{
  background-color: ${({ theme }) => theme.footer_bg};
  filter: brightness(1.5);
}

.subdomain.light .swap-advanced .five-logos > div.active{
  background-color: ${({ theme }) => theme.footer_bg} !important;
}
.subdomain.light .liquidiy-resource .liquid-group .AAVE-Liq{
  background: none;
}
.subdomain.light .right-sidemenu.slide{
  background: none;
}
.subdomain.light .right-sidemenu:before{
  background-color: ${({ theme }) => theme.primary_bg} !important;
  filter: brightness(1.2);
  content: "";
  position: fixed;
  width: inherit;
  height: inherit;
  right: 0;
  top: 0;
  z-index: -1;
  left: auto;
  transition: 0.3s;
  right: -600px;
}

.liquidiy-resource .liquid-group > div{ color:${({ theme }) => theme.heading}; }

.brDragorMBX{ width:100%; display:flex; margin-top:25px; align-items: center; justify-content:center; }
.brDragorSBX01{width:calc(100% - 200px); padding-right:10px;   }
.brDragorSBX02{ width:200px; padding:0 0 0 32px;  }
.brDragorSBX02 button{ display:block; background-color:#fcf302; padding:12px 10px; border-radius:10px; width:100%; font-size:16px; font-weight:700; color:#000; font-family: "Comic"; border:0;   }
.brDragorSBX02 button:hover{ filter:brightness(0.9);}


.DTabMbx{ width: 100%; margin:0 0 55px 0; display:flex; align-items:center; justify-content:center;}
.DTabMbx a{ width:50%; display: flex; align-items:center; justify-content:center; padding:12px 8px; color:#16191E; border-bottom:3px solid #16191E; font-size:20px; font-weight:700; }

.DTabMbx a:hover, .DTabMbx a.active{ color:#FD0352; border-color:#FD0352;}
.DTabformBX{ width:100%; max-width:680px; margin:20px auto 20px auto; display:flex; align-items:center; justify-content:center; flex-wrap:wrap;}

.DTformMBX01{ width:100%; display: flex; align-items:center; justify-content:center; flex-wrap:wrap; margin-bottom:36px; max-width: 600px;}
.DTformMBX01 input{ width: 100%; padding: 1rem 1.5rem; font-size: 18px; font-weight: bold; border-radius: 10px;
background: ${({ theme }) => theme.popup};   border: 2px solid ${({ theme }) => theme.input_boder} !important; }

.DTformMBX01 label{ width: 100%; padding:6px; font-size:16px; text-align:left}
.DTformMBX01 .smlText{ width: 100%; padding:6px; font-size:11px; text-align:left}









@media (max-width: 600px) {
  .brDragorMBX{ flex-wrap: wrap;}
  .brDragorSBX01{width:100%; padding-right:0;   }
  .brDragorSBX02{ width:100%; padding:15px 0 0 0;  } 
}



.subdomain.light .right-sidemenu.slide:before{
  right: 0;
  left: auto;
}
.subdomain .list-info ul li a:hover{
color:#fff;
}
.subdomain.light .list-info ul li a:hover{
color:${({ theme }) => theme.footer_bg}
}
.subdomain .mainBtn span, .subdomain .header__control .right-menu-btn .dotspan{
  background-color: #fff;
}
.subdomain.light .mainBtn span, .subdomain.light .header__control .right-menu-btn .dotspan{
  background-color: ${({ theme }) => theme.footer_bg} !important;
}

.hero__content--form .input-group input, .popup .wrap .inputgroup, .dropdownERC  {
  border: 2px solid ${({ theme }) => theme.input_boder} !important;
}
.subdomain.light .swap__ledger__links a.active{
  color:${({ theme }) => theme.footer_bg}
}

.showviews.show{
  color:${({ theme }) => theme.hero_bg} !important;
  filter: brightness(0.3) !important;
}
.showviews.show .active{
  color:${({ theme }) => theme.footer_bg}
}
body{
  font-family: "Comic";
}
// #CloneForm{
//   background: ${({ theme }) => theme.hero_bg} !important;
// }
.input-data, .color-box, .clone-line{
  background: ${({ theme }) => theme.clone_border} !important;
}
.input, .md-radio label:before{
  border-color: ${({ theme }) => theme.clone_border} !important;
}
.input-box fieldset, .custom-check-box label span::before{
  border-color: ${({ theme }) => theme.clone_border} !important;
}

{/* Theme style start */}
// .owl-stage .item a{
//   background: ${({ theme }) => theme.popup_modal};
// }
.owl-stage .item p{
  color: ${({ theme }) => theme.txt_color};
} 
.twologos .logo-color img, .twologos .logo-dull img{
  filter:${({ theme }) => theme.filter_value} !important;
}
.header__info a{
  color:${({ theme }) => theme.btn_color};
  background:${({ theme }) => theme.btn_bg};
}
.logo-txt{
  color:${({ theme }) => theme.btn_txt};
}
.hero{
  // background:url(${({ theme }) => theme.bg_image}) no-repeat;
  // background-size: cover;
  // position:relative;
  // z-index: 2;
  // filter:${({ theme }) => theme.grey_scale};
}
// .hero::before{
//   filter:${({ theme }) => theme.grey_scale};
//   content:${({ theme }) => theme.content_dark};
//   width:100%;
//   height:100%;
//   position:absolute;
//   background: #0c0c0c;
//   opacity: 0.7;
//   top:0;
//   z-index: -1;
// }
.overlay-bg{
  //background:url(${({ theme }) => theme.bg_image}) no-repeat;
  filter:${({ theme }) => theme.grey_scale};
  background-size: cover;
  position:fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  width: 100vw;
  height:100vh;
  z-index: -1;
  opacity:${({ theme }) => theme.block_opacity};
  height: 100vh;
  object-fit: cover;
}
.hero__content .beforeUsing p{
  color:${({ theme }) => theme.primarytxt_color};
}
.hero__content .beforeUsing p:not(:last-child)::after{
  background:${({ theme }) => theme.primarytxt_color};
}
.hero__content--logos a{
  background:${({ theme }) => theme.round_bg};
}

{/* Theme style end */}

@media (max-width: 767px) {
  .header__title { background :${({ theme }) => theme.hero_bg}; }

 `;
