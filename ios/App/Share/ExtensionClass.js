var ExtensionClass = function() {};

ExtensionClass.prototype = {
    run: function(arguments) {
        arguments.completionFunction({
            "title": document.title,
            "hostname": document.location.hostname,
            "favicon": this.fetchFavicon(),
            "productInfos": this.fetchProductInfos(),
            "price": this.fetchPrice(),
            "url": document.URL
        });
    },
    fetchFavicon: function() {
        return Array.from(document.getElementsByTagName("link"))
                .filter(element => element.rel == "icon" || element.rel == "shortcut icon")
                .map(elem => elem.href)[0];
    },
    fetchProductInfos: function() {
        return Array.from(document.getElementsByTagName('img')).map(x => { 
            if (x.src) { 
                return { name: x.alt, imageUrl: x.src };  
            } else if(x.srcset) { 
                return { name: x.alt, imageUrl: x.srcset.split(',')[0] }; 
            } 
            return { name: '', imageUrl: ''  };  
        }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
    },
    fetchPrice: function() {
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
                        substring = substring.replace(/[^\d,€-]/g, '');
                        let price = substring.trim();
                        if (price.length > 2) {
                            price = price.substring(0, price.indexOf("€")+1)
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
        return parseFloat(resultPrice.replace('€', '').replace(',', '.').trim());
    }
};

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

var ExtensionPreprocessingJS = new ExtensionClass;
