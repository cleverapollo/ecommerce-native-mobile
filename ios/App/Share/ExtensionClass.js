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
                let imageSrcUrl = x.src;
                let imageUrl = imageSrcUrl;
                if (imageSrcUrl.match(/https/g)?.length > 1) {
                    let urls = imageSrcUrl.split('https');
                    urls.forEach(url => {
                        url = 'https' + url;
                        const urlToCheck = url.split(/[?#]/)[0];
                        if (urlToCheck.match(/(jpeg|jpg|svg|png|tiff|tif|gif)$/) != null) {
                            imageUrl = url;
                        }
                    })
                } else if (imageSrcUrl.match(/http/g)?.length > 1) {
                    let urls = imageSrcUrl.split('http');
                    urls.forEach(url => {
                        url = 'http' + url;
                        const urlToCheck = url.split(/[?#]/)[0];
                        if (urlToCheck.match(/(jpeg|jpg|svg|png|tiff|tif|gif)$/) != null) {
                            imageUrl = url;
                        }
                    })
                } 
                return { name: x.alt, imageUrl: imageUrl || '' };  
            } else if(x.srcset) {
                const imagesUrls = Array.from(x.srcset.split(','))
                    .filter(url => url.match(/(jpeg|jpg|svg|png|tiff|tif|gif)$/) != null)
                return { name: x.alt, imageUrl: imagesUrls[0] || '' }; 
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
