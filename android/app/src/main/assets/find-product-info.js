(function () {
    'use strict';

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


    // images and name

    function loadProductInfoList() {
        Android.log('number of images ' + document.images.length);

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

        return Promise.resolve(produtInfoList.filter(x => x.imageUrl !== '' && (x.imageUrl.startsWith('http')))
            .filter(filterDuplicatedItems)
            .sort(sortBySvgImages));
    }

    function onHtmlImageLoadError() {
        return () => {
            handleError('Error loading ' + this.src);
        };
    }

    function createProductInfoFromSrc(htmlImage, index) {
        let imageUrl = validateUrl(htmlImage.src);
        if (htmlImage.srcset) {
            return createProductInfoFromSrcset(htmlImage, index);
        }
        return { id: index, name: getName(htmlImage.alt), imageUrl: imageUrl || '', productUrl: document.URL };
    }

    function createProductInfoFromSrcset(htmlImage, index) {
        const imageUrl = getFirstImageUrlFromSrcSet(htmlImage.srcset);
        return { id: index, name: getName(htmlImage.alt), imageUrl: imageUrl || '', productUrl: document.URL };
    }

    function onHtmlImageLoadSuccess(htmlImage, index) {
        return () => {
            Android.log('image with index ' + index + ' loaded')
            if (htmlImage.src) {
                const produtInfo = createProductInfoFromSrc(htmlImage, index);
                Android.onProductInfoLoaded(JSON.stringify(produtInfo));
            } else if (htmlImage.srcset) {
                const produtInfo = createProductInfoFromSrcset(htmlImage, index);
                Android.onProductInfoLoaded(JSON.stringify(produtInfo));
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

    // Error Handling

    function handleError(error) {
        let androidError = "Unknown JS Error";
        if (error) {
            if (typeof error === 'string') {
                androidError = error;
            } else if (typeof error === 'object' && error !== null && error.message && typeof error.message === 'string') {
                androidError = error.message;
                if (error.name && typeof error.name === 'string') {
                    androidError = error.name + ": " + androidError;
                }
            }
        }
        Android.onError(androidError)
    }

    // execution
    try {
        loadProductInfoList().then(productInfoList => {
            let price = findProductPrice();
            productInfoList.forEach(productInfo => {
                productInfo.price = price;
            });
            Android.onProductInfosLoaded(JSON.stringify(productInfoList));
        });
    } catch (error) {
        handleError(error);
    }

})();