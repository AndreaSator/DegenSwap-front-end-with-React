import { PARA_API_URL } from "./constant"

export const getRate = async ({
    from, to, amount, network,
    srcDecimal = 18, destDecimal = 18
}) => {
    try{
        const response = await fetch(`${PARA_API_URL}/prices?srcToken=${from}&destToken=${to}&amount=${amount}&network=${network}&srcDecimals=${srcDecimal}&destDecimals=${destDecimal}`);
        const data = await response.json();
        return data.priceRoute;
    }catch(e){
        return {};
    }
};

export const buildTransaction = async ({
    network = 1, from, to, amount
}) => {
    try{
        const userAddress = localStorage.getItem('account');
        const route = await getRate({ from, to, amount, network })


        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "srcToken": from,
            "destToken": to,
            "userAddress": userAddress,
            "priceRoute": route,
            "srcAmount": amount,
            "destAmount": route.destAmount
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://apiv5.paraswap.io/transactions/1", requestOptions)
        const data = await response.json();
        return data;
    }catch(e){
        console.log(e);
        return {};
    }
};

// DEMO CALL
// buildTransaction({
    //     from: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    //     to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    //     amount: '10000000000000'
//   });