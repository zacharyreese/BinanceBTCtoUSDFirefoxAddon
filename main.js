//Global variables
var currentBTCUSDTPrice = 0;

//Since window.onload is blocked for security reasons, wait for elements to load by interval polling
var checkExist = setInterval(function () {
    if (document.querySelectorAll("div[data-type='table-td']").length > 0) {

        main();

        //Stop execution
        clearInterval(checkExist);
    }
}, 100); // check every 100ms

//Sets up assets and calls other functions
function main() {
    //Get asset list container
    var container = document.querySelectorAll("div[data-type='list-table']");

    //Get rows of each asset as well as the title row
    var rows = container[0].childNodes;

    //Replace 'BTC Value' with 'USD Value'
    var titleText = rows[0].childNodes[0].childNodes[4].childNodes[0].childNodes[0];
    titleText.innerHTML = 'USD Value';

    //Convert value from BTC to USD and replace DOM value
    getBTCPrice(rows);
}

//Query BTC price from binance API for conversion
//After query completes, call main function to do conversions
function getBTCPrice(rows) {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            currentBTCUSDTPrice = myJson.price;
            convertFromBTCToUSD(rows);
        });

}

//Main function to convert value of BTC to USD and replace HTML value
function convertFromBTCToUSD(rows) {
    //Parse through each row to get the BTC value from HTML, then replace HTML value with USD value
    //Skip first value since it is the title row
    for (i = 1; i < rows.length; i++) {
        var assetBTCValue = getAssetBTCValue(rows[i]);
        var assetUSDValue = getAssetUSDValue(assetBTCValue);
        //Replace HTML BTC value with new USD value
        replaceBTCWithUSD(rows[i], assetUSDValue);
    }
}


//Get the row div of the asset and extract BTC price from the DOM
function getAssetBTCValue(div) {
    var assetBTCPrice = div.childNodes[0].childNodes[4].childNodes[0].data;
    return assetBTCPrice;
}

//Convert BTC to USD
function getAssetUSDValue(assetValue) {
    if (assetValue == 0 || assetValue == '$0.00' || assetValue == '$0') {
        return 0;
    }
    var assetUSDValue = (currentBTCUSDTPrice * assetValue).toFixed(2);
    return assetUSDValue;
}

//Update the HTML in the DOM
function replaceBTCWithUSD(div, usdValue) {
    if (usdValue == 0) {
        div.childNodes[0].childNodes[4].childNodes[0].data = '$0.00';
        return;
    }
    div.childNodes[0].childNodes[4].childNodes[0].data = '$' + usdValue;
    return;
}


//Set event listeners to rerun function when sorting or changing pages
var addListeners = setInterval(function () {
    if (document.querySelectorAll("div[data-type='table-td']").length > 0) {

        //Add event listeners to rerun script when sorting or paging is called
        var btns = document.querySelectorAll("div[data-bn-type='text']");
        for (i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", main);
        }

        var pages = document.querySelectorAll("button[data-bn-type='button']");
        for (i = 0; i < pages.length; i++) {
            pages[i].addEventListener("click", main);
        }

        var links = document.querySelectorAll("a[data-bn-type='link']");
        for (i = 0; i < links.length; i++) {
            links[i].addEventListener("click", main);
        }

        //Stop execution
        clearInterval(addListeners);
    }
}, 100); // check every 100ms