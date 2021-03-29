function findProductPrice() {
    let elements = document.body.getElementsByTagName('*');
    let prices = [];
    Array.prototype.forEach.call(elements, element => {
        if (element?.innerText?.includes('€')) { 
            let searchText = element.innerText;
            let euroCount = countNumberOfCurrencysInString(searchText);
            for (var j = 0; j < euroCount; j++) {
                let euroIndex = searchText.indexOf('€'); 
                let substring = searchText.substring(euroIndex - 10, euroIndex + 10); 
                if (substring) {
                    substring = splitStringByLineBreaks(substring).find(v => v.indexOf('€') !== -1)
                    let price = substring.replace(/[^\d.,€ -]/g, '');
                    if (price.length > 2) {
                        let euroIndex2 = price.indexOf('€'); 
                        if (euroIndex2 == 0) {
                            price = price.substring(1);
                        } else {
                            price = price.substring(0, euroIndex2 + 1)
                        }
                        if (price.length > 2) {
                            prices.push(price);
                        }
                    }
                }
                searchText = searchText.slice(euroIndex-1, searchText.length-1);
            }
        } 
    });
    const resultPrice = mode(prices);
    return parseFloat(resultPrice.replace('€', '').replace(',', '.').trim()) ?? 0.00;
}

function splitStringByLineBreaks(string) {
    return string.split(/\r?\n/);
}

function countNumberOfCurrencysInString(string) {
    return (string.match(/€/g)||[]).length;
}

function mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}