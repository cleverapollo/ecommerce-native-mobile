// price

function findProductPrice() {
    let elements = document.body.getElementsByTagName('*');
    let prices = [];
    Array.prototype.forEach.call(elements, element => {
        if (element?.innerText?.includes('€')) {
            prices = prices.concat(findAllPricesInElement(element))
        }
    });

    try {
        let resultPrice = mode(prices);
        if (typeof resultPrice === 'string') {
            resultPrice = resultPrice.replace('€', '').replace(',', '.').trim();
            resultPrice = parseFloat(resultPrice);
            if (resultPrice) {
                return resultPrice;
            }
        }
        return 0.00;
    } catch (error) {
        logError(error);
        return 0.00;
    }
}

function findAllPricesInElement(element) {
    let prices = [];
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
        searchText = searchText.slice(euroIndex - 1, searchText.length - 1);
    }
    return prices;
}

function splitStringByLineBreaks(string) {
    return string.split(/\r?\n/);
}

function countNumberOfCurrencysInString(string) {
    return (string.match(/€/g) || []).length;
}

function mode(arr) {
    let result = arr.sort((a, b) =>
        arr.filter(v => v === a).length
        - arr.filter(v => v === b).length
    ).pop();

    if (!result) {
        result = "0,00";
    }

    return result;
}


// images and name

function loadProductInfoList() {
    sendCordovaInAppBrowserMessageEvent('number of images ' + document.images.length);

    let produtInfoList = [];
    let index = 0;
    for (const htmlImage of document.images) {
        let productInfo = { id: index, name: '', imageUrl: '', productUrl: document.URL };

        htmlImage.onload = onHtmlImageLoadSuccess(htmlImage, index)
        htmlImage.onerror = onHtmlImageLoadError()

        if (htmlImage.src) {
            productInfo = createProductInfoFromSrc(htmlImage, index);
        } else if (htmlImage.srcset) {
            productInfo = createProductInfoFromSrcset(htmlImage, index);
        }

        produtInfoList.push(productInfo);

        ++index;
    }

    return produtInfoList.filter(x => x.imageUrl !== '' && (x.imageUrl.startsWith('http')))
        .filter(filterDuplicatedItems)
        .sort(sortBySvgImages);
}

function onHtmlImageLoadError() {
    return () => {
        logError('Error loading ' + this.src);
    };
}

function createProductInfoFromSrc(htmlImage, index) {
    const price = findProductPrice();
    let imageUrl = validateUrl(htmlImage.src);
    if (htmlImage.srcset) {
        return createProductInfoFromSrcset(htmlImage, index);
    }
    return { id: index, name: getName(htmlImage.alt), imageUrl: imageUrl || '', productUrl: document.URL, price: price };
}

function createProductInfoFromSrcset(htmlImage, index) {
    const price = findProductPrice();
    const imageUrl = getFirstImageUrlFromSrcSet(htmlImage.srcset);
    return { id: index, name: getName(htmlImage.alt), imageUrl: imageUrl || '', productUrl: document.URL, price: price };
}

function onHtmlImageLoadSuccess(htmlImage, index) {
    return () => {
        sendCordovaInAppBrowserMessageEvent('image with index ' + index + ' loaded')
        if (htmlImage.src) {
            const produtInfo = createProductInfoFromSrc(htmlImage, index);
            sendCordovaInAppBrowserMessageEvent(JSON.stringify(produtInfo));
        } else if (htmlImage.srcset) {
            const produtInfo = createProductInfoFromSrcset(htmlImage, index);
            sendCordovaInAppBrowserMessageEvent(JSON.stringify(produtInfo));
        }
    };
}

function getName(altTagValue) {
    if (!altTagValue) {
        return document.title || '';
    }
    return altTagValue;
}

function validateUrl(url) {
    let imageUrl = url;
    if (!url.startsWith('http') && url.startsWith('//')) {
        imageUrl = 'https:' + url;
    }
    imageUrl = imageUrl.split(' ')[0];
    if (url.endsWith('.html')) {
        imageUrl = '';
    }
    return imageUrl !== '' ? encodeURI(imageUrl) : '';
}

function getFirstImageUrlFromSrcSet(srcset) {
    const imagesUrls = Array.from(srcset.split(','));
    let imageUrl = '';
    if (imagesUrls.length >= 1) {
        imageUrl = validateUrl(imagesUrls[0])
    }
    return imageUrl;
}

function sortBySvgImages(a, b) {
    const isASvgImage = a.imageUrl.indexOf('.svg') !== -1;
    const isBSvgImage = b.imageUrl.indexOf('.svg') !== -1;
    if (isASvgImage && isBSvgImage) {
        return 0;
    } else if (isASvgImage) {
        return 1;
    } else if (isBSvgImage) {
        return -1;
    }
    return 0;
}

function filterDuplicatedItems(productInfo, index, self) {
    return index === self.findIndex((p) => (
        p.imageUrl === productInfo.imageUrl
    ));
}

// execution
try {
    loadProductInfoList();
} catch (error) {
    logError(error);
}

// Error Handling

function logError(error) {
    let errorMessage = "Unknown JS Error";
    if (error) {
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (typeof error === 'object' && error !== null && error.message && typeof error.message === 'string') {
            errorMessage = error.message;
            if (error.name && typeof error.name === 'string') {
                errorMessage = error.name + ": " + errorMessage;
            }
        }
    }
    sendCordovaInAppBrowserMessageEvent(errorMessage)
}

function sendCordovaInAppBrowserMessageEvent(message) {
    if (!webkit.messageHandlers.cordova_iab) {
        alert('Cordova IAB postMessage API not found!');
        return;
    }
    webkit.messageHandlers.cordova_iab.postMessage(message);
}