import TradingViewWidget, { Themes } from 'react-tradingview-widget';

export const TradeChart = (props) => {
  console.log(props)
return(
  <TradingViewWidget
  timezone = "Etc/UTC" 
  style =  "1"
  toolbar_bg = "#f1f3f6"
  enable_publishing ={ false}
  withdateranges = {true}
  range = "YTD"
  allow_symbol_change = {true}
  container_id = "tradingview_2476e"
    symbol={props.tokens.base+'-'+props.tokens.quote}
    theme={Themes.DARK}
    locale="en"
    autosize
  />
)
};
