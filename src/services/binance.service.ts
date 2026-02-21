import WebSocket from 'ws';

const symbol = "btcusdt"
const url = `wss://stream.binance.com:9443/ws/${symbol}@trade`;

let latestPrice:number = 0;

export function startBinanceStream(){
    const wss = new WebSocket(url);
    
    wss.onopen = ()=>{
        console.log("connection open");
    }

    wss.onmessage = (e) =>{
        latestPrice = JSON.parse(e.data.toString()).p;
        //console.log(latestPrice);
    }
    
    wss.onclose = ()=>{
        console.log("connection closed!!");
    }
}

export function getLatestPrice():number{
    return latestPrice;
}
startBinanceStream();
