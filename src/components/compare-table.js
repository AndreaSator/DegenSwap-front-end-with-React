import { orderBy, sortBy } from "lodash";
import React,{ useEffect, useState } from "react"
import { API_URL } from "../common/constant";
import { getDecimal, uptoTwo } from "../service/degen_function";

const DEFAULT_INFO = { 'Uniswap': true, 'Sushiswap': true, '1Inch': true };
export const CompareTable = ({binaryStr, toChain, fromChain, chains, amt, tokenAddressArr ,...props}) => {
    const [tableData, setTableData] = useState([]);
    const [enableInfo, setEnableInfo] = useState(DEFAULT_INFO);

    const [decimal, setDecimal] = useState(18);
    const [toDecimal, setToDecimal] = useState(18);

    // useEffect(() => {
    //     getTableData();
    // }, [])
    useEffect(() => {
        let info;
        const isDouble = chains.base !== 'TK' && chains.quote !== 'TK' && fromChain !== toChain;
        let onlyPan = fromChain === 'bsc';
        if(toChain === 'eth' && ![chains.base, chains.quote].includes('TK')) onlyPan = false; 
        if(isDouble){
            info = {
                'Pancakeswap/Uniswap': binaryStr[4] === '0', 
                'Pancakeswap/Sushiswap': binaryStr[3] === '0', 
                // 'Pancakeswap/1Inch': binaryStr[2] === '0',
                // 'Pancakeswap/Curve': binaryStr[0] === '0',
                // 'Pancakeswap/Paraswap': binaryStr[1] === '0'
            }
        }else{
            info = { 
                'Uniswap': binaryStr[4] === '0', 
                'Sushiswap': binaryStr[3]   === '0', 
                // '1Inch': binaryStr[2] === '0',
                // 'Curve': binaryStr[0] === '0',
                // 'Paraswap': binaryStr[1] === '0',
                'Pancakeswap': true
            };
        }
        setEnableInfo(info);
        getTableData(info, isDouble, onlyPan);
    }, [binaryStr, chains]);

    useEffect(() => {

        getDecimal(tokenAddressArr.to).then( setToDecimal ).catch(e => setToDecimal(18));
        getDecimal(tokenAddressArr.from).then( setDecimal ).catch(err => setDecimal(18))

    }, [tokenAddressArr])

    const getTableData = async(info = {}, isDouble, onlyPan) => {
        let Api_Response = {};
        if(toChain === 'eth' && fromChain === 'eth'){
            const response = await fetch(`${API_URL}api/DEGEN/getIndividualExpectedValue?fromToken=${props.address.from}&toToken=${props.address.to}&amount=${+props.amount * Math.pow(10, toDecimal)}&orderType=2&crossOrderType=2`);
            Api_Response = await response.json();
        }else if(fromChain === 'eth' && toChain === 'bsc'){
            const response = await fetch(`${API_URL}api/DEGEN/getCrossChainIndividualExpectedValue?fromToken=${props.address.from}&toToken=${props.address.to}&amount=${+props.amount * Math.pow(10, toDecimal)}&orderType=2&crossOrderType=2`);
            Api_Response = await response.json();
        }else if(fromChain === 'bsc' && toChain === 'eth'){
            const response = await fetch(`${API_URL}api/DEGEN/getBSCCrossChainIndividualExpectedValue?fromToken=${props.address.from}&toToken=${props.address.to}&amount=${+props.amount * Math.pow(10, toDecimal)}&orderType=2&crossOrderType=2`);
            Api_Response = await response.json();
        };
        if ((Api_Response && Api_Response.status == 'true') || (fromChain === 'bsc' && toChain === 'bsc' && amt)) {
            let tempArray;
           if((fromChain === 'bsc' && toChain === 'bsc') || Api_Response.pancakeAmount || Api_Response.amount){
                tempArray = [
                    { name: 'Pancakeswap', value: amt, icon: 'imgs/dexlogo/pancakeswap.svg', bestMatch: '' }
                ]; 
           }else if(!onlyPan && (Api_Response.uniAmount || Api_Response.pan_uniAmount)){
               tempArray = [
                    { name: `${isDouble ? 'Pancakeswap/' : ''}Sushiswap`,icon:'imgs/dexlogo/sushiswap.svg', value: isDouble ? Api_Response.pan_sushiAmount : Api_Response.sushiAmount, bestMatch: '' },
                    { name: `${isDouble ? 'Pancakeswap/' : ''}Uniswap`,icon:'imgs/dexlogo/uniswap.svg', value: isDouble ? Api_Response.pan_uniAmount : Api_Response.uniAmount, bestMatch: '' },
                    { name: `${isDouble ? 'Pancakeswap/' : ''}1Inch`, icon:'imgs/dexlogo/1inch.svg', value: isDouble ? Api_Response.pan_inchAmount : Api_Response.inchAmount , bestMatch: ''},
                    { name: `${isDouble ? 'Pancakeswap/' : ''}Curve`, icon:'imgs/dexlogo/curve.jpg', value: isDouble ? Api_Response.pan_CurveAmount : Api_Response.CurveAmount , bestMatch: ''},
                    { name: `${isDouble ? 'Pancakeswap/' : ''}Paraswap`, icon:'imgs/dexlogo/paraswap.svg', value: isDouble ? Api_Response.pan_ParaSwapAmount : Api_Response.ParaSwapAmount , bestMatch: ''},
                    // { name: `Pancake`, icon: '', value: Api_Response.pancakeAmount, bestMatch: '' }
                ].filter(el => info[el.name]);
           }else if(onlyPan && !Api_Response.uniAmount){
               tempArray = [
                   { name: 'Pancakeswap', value: Api_Response.pancakeAmount, icon: 'imgs/dexlogo/pancakeswap.svg', bestMatch: '' }
               ];
           }else{
            tempArray = [
                { name: `${isDouble ? 'Pancakeswap/' : ''}Sushiswap`,icon:'imgs/dexlogo/sushiswap.svg', value: isDouble ? Api_Response.pan_sushiAmount : Api_Response.sushiAmount, bestMatch: '' },
                { name: `${isDouble ? 'Pancakeswap/' : ''}Uniswap`,icon:'imgs/dexlogo/uniswap.svg', value: isDouble ? Api_Response.pan_uniAmount : Api_Response.uniAmount, bestMatch: '' },
                { name: `${isDouble ? 'Pancakeswap/' : ''}1Inch`, icon:'imgs/dexlogo/1inch.svg', value: isDouble ? Api_Response.pan_inchAmount : Api_Response.inchAmount , bestMatch: ''},
                { name: `${isDouble ? 'Pancakeswap/' : ''}Curve`, icon:'imgs/dexlogo/curve.jpg', value: isDouble ? Api_Response.pan_CurveAmount : Api_Response.CurveAmount , bestMatch: ''},
                { name: `${isDouble ? 'Pancakeswap/' : ''}Paraswap`, icon:'imgs/dexlogo/paraswap.svg', value: isDouble ? Api_Response.pan_ParaSwapAmount : Api_Response.ParaSwapAmount , bestMatch: ''},
                // { name: `Pancake`, icon: '', value: Api_Response.pancakeAmount, bestMatch: '' }
            ].filter(el => info[el.name]);
           };
        //    let res;
        //    let arrayWithBestMatch = [];
        //    tempArray.forEach((e) =>{
        //     res =  await getBestMatch(tempArray);
        //     arrayWithBestMatch.push(res);
        //    })
            let res =  await getBestMatch(tempArray);
        //    res = orderBy(res,['value'], ['desc'])
            res.sort((a, b) => b.value - a.value);
            setTableData(res);
       }
    }
     const getBestMatch = async(data) =>{
        try {
            const max = Math.max(...data.map(el => el.value));
            return data.map(el => ({
                ...el, 
                bestMatch: max - el.value === 0 ? 'BEST' : (max - el.value) / max * 100
            }));
        } catch (error) {
            console.log(error);
            return data;
        }
        
    }
    // const getBestMatch = async(data) =>{
    //     if (data.inchAmount > data.sushiAmount &&  data.inchAmount > data.uniAmount) {
    //         data['inchBestMatch'] = 'best';
    //         data['sushiBestMatch'] = (data.inchAmount - data.sushiAmount) / data.inchAmount * 100;
    //         data['uniBestMatch'] = (data.inchAmount - data.uniAmount) / data.inchAmount * 100
    //         return data;
    //     }else if (data.sushiAmount > data.inchAmount &&  data.inchAmount > data.uniAmount) {
    //         data['inchBestMatch'] = (data.sushiAmount - data.inchAmount) / data.sushiAmount * 100;
    //         data['sushiBestMatch'] = 'best';
    //         data['uniBestMatch'] = (data.sushiAmount - data.uniAmount) / data.sushiAmount * 100
    //         return data;            
    //     }else if (data.uniAmount) {
    //         data['inchBestMatch'] = (data.uniAmount - data.inchAmount) / data.uniAmount * 100;
    //         data['sushiBestMatch'] = (data.uniAmount - data.sushiAmount) / data.uniAmount * 100
    //         data['uniBestMatch'] = 'best';
    //         return data; 
            
    //     }else{
    //         return data;
    //     }
    // }
 
    return (
        <>
            <div className="wrapper bg_main">
                {/* <div className='price-compare-table'>
                    <table>
                        <thead>
                            <tr>
                            <th>
                                    NAME
                            </th>
                            <th>
                                {props.chains.base}/{props.chains.quote}
                            </th>
                            <th>
                                    Diff
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((data) => {
                                return (
                                    <tr>
                                        <td>
                                            {data.name}
                                        </td>
                                        <td>
                                            {data.value}
                                        </td>
                                        <td className={isNaN(data.bestMatch) ? 'green-text' : 'red-text'}>
                                            {data.bestMatch}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div> */}
                <div className="custom-table">
                    <div className="table-head" style={{padding: '30px 40px 0px 0px'}}>
                        <div className="cus-tr">
                            <div className="cus-th light-text">
                                Name
                            </div>
                            <div className="cus-th">
                            {chains.base}/{chains.quote}
                            </div>
                            <div className="cus-th light-text">
                                Diff
                            </div>
                        </div>
                    </div>
                    <div className="table-body">
                    {tableData.map((data, idx) => {
                        console.log(data);
                                return enableInfo[data.name] ? (
                        <div className="cus-tr" key={idx}>
                            <div className="cus-td" style={{display: 'flex', alignItems: 'center'}}>
                                <img className="coin-ico" src={data.icon} alt="coin"></img>
                                <span className="coin-title"> {data.name}</span>
                            </div>
                            <div className="cus-td">
                                <span className="data">{(+data.value === 0 ? data.value : (data.value / Math.pow(10, decimal)).toFixed(8)) || '-'}</span>
                            </div>
                            <div className="cus-td">
                            <span  className={isNaN(data.bestMatch) ? 'token-desc shade-bg blue-shade' : 'token-desc shade-bg-down down'} >{!(isNaN(data.bestMatch)) ? '-' + ( +data.bestMatch % 1 !== 0 ? uptoTwo(data.bestMatch) : +data.bestMatch ) + '%' : data.bestMatch }</span>
                            </div>
                        </div>
                         ) : <></>})}
                        {/* <div className="cus-tr">
                            <div className="cus-td">
                                <img src="javascript:void(0)" alt="coin"></img>
                                <span className="coin-title">LTC</span>
                            </div>
                            <div className="cus-td">
                                <span className="data">1911.935854246802</span>
                            </div>
                            <div className="cus-td">
                                <span className="token-desc shade-bg-green">MATCH</span>
                            </div>
                        </div>
                        <div className="cus-tr">
                            <div className="cus-td">
                                <img className="coin-ico" src="javascript:void(0)" alt="coin"></img>
                                <span className="coin-title">LTC</span>
                            </div>
                            <div className="cus-td">
                                <span className="data">1911.935854246802</span>
                            </div>
                            <div className="cus-td">
                                <span className="token-desc shade-bg-up up">+01</span>
                            </div>
                        </div>
                        <div className="cus-tr">
                            <div className="cus-td">
                                <img className="coin-ico" src="javascript:void(0)" alt="coin"></img>
                                <span className="coin-title">LTC</span>
                            </div>
                            <div className="cus-td">
                                <span className="data">1911.935854246802</span>
                            </div>
                            <div className="cus-td">
                                <span className="token-desc shade-bg-down down">-23%</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
};
