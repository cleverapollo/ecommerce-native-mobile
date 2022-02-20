// Price

function findPrice() {
    let elements = document.body.getElementsByTagName('*');
    let prices = [];
    Array.prototype.forEach.call(elements, element => {
        if (element && element.innerText && element.innerText.includes('€')) {
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
        handleError(error);
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

//

function loadImages() {
    console.log('number of images ' + document.images.length);

    let webImages = [];
    let index = 0;
    for (const htmlImage of document.images) {
        htmlImage.onload = onHtmlImageLoadSuccess(htmlImage, index);
        htmlImage.onerror = onHtmlImageLoadError(index);

        const src = htmlImage.currentSrc || htmlImage.src;
        const name = htmlImage.alt || "";
        if (src) {
            webImages.push({
                id: index,
                name: name,
                url: src
            })
        } else if (htmlImage.srcset) {
            urls.push({
                id: index,
                name: name,
                url: getFirstImageUrlFromSrcSet(htmlImage.srcset)
            });
        }
        ++index;
    }

    return webImages
        .filter(filter)
        .sort(sortBySvgImages)
}

function onHtmlImageLoadSuccess(htmlImage, index) {
    return () => {
        const src = htmlImage.currentSrc || htmlImage.src;
        const name = htmlImage.alt || "";
        if (src) {
            const webImage = {
                id: index,
                name: name,
                url: src
            }
            console.debug(JSON.stringify(webImage));
        } else if (htmlImage.srcset) {
            const webImage = {
                id: index,
                name: name,
                url: getFirstImageUrlFromSrcSet(htmlImage.srcset)
            }
            console.debug(JSON.stringify(webImage));
        }
    };
}

function getFirstImageUrlFromSrcSet(srcset) {
    const imagesUrls = Array.from(srcset.split(','));
    let imageUrl = '';
    if (imagesUrls.length >= 1) {
        imageUrl = validateUrl(imagesUrls[0])
    }
    return imageUrl;
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

function onHtmlImageLoadError(index) {
    return () => {
        const message = 'Error loading image with id: '+ index + ' url: ' + this.src;
        handleError(message);
    };
}

// filter

function filter(webImage, index, self) {
    return filterInvalidUrls(webImage) &&
        filterDuplicatedItems(webImage, index, self) &&
        filterTracker(webImage);
}

function filterInvalidUrls(webImage) {
    return webImage.url && webImage.url.startsWith('http');
}

function filterDuplicatedItems(webImage, index, self) {
    return index === self.findIndex((wi) => (
        wi.url === webImage.url
    ));
}

function filterTracker(webImage) {
    return webImage.url.indexOf('.bing.com') === -1;
}

// sort

function sortBySvgImages(a, b) {
    const isASvgImage = a.url.indexOf('.svg') !== -1;
    const isBSvgImage = b.url.indexOf('.svg') !== -1;
    if (isASvgImage && isBSvgImage) {
        return 0;
    } else if (isASvgImage) {
        return 1;
    } else if (isBSvgImage) {
        return -1;
    }
    return 0;
}

// error handling

function handleError(error) {
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
    console.error(errorMessage)
}

// 

function fetchAppInfo() {
    return {
        "title": document.title,
        "hostname": document.location.hostname,
        "images": loadImages(),
        "price": findPrice(),
        "url": document.URL
    }
}

fetchAppInfo()