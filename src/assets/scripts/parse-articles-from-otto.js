const isOverviewPage = document.getElementsByTagName('article').length > 0;
if (isOverviewPage) {
    parseArticlesFromOverviewPage();
} else {
    parseArticleFromDetailPage();
}

function fallBack() {
    Array.from(document.getElementsByTagName('img')).map(x => { 
        if (x.src) { 
            return { name: x.alt, imageUrl: x.src };  
        } else if(x.srcset) { 
            return { name: x.alt, imageUrl: x.srcset.split(',')[0] }; 
        } 
        return { name: '', imageUrl: ''  };  
    }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
}

function parseArticleFromDetailPage() {
    let price = "0.00 €";
    const normalPriceAmountElement = document.getElementById('normalPriceAmount');
    const reducedPiriceAmountElement = document.getElementById('reducedPriceAmount');
    if (normalPriceAmountElement) { 
        price = normalPriceAmountElement.getAttribute('content'); 
    } else if (reducedPiriceAmountElement) { 
        price = reducedPiriceAmountElement.getAttribute('content'); 
    }

    let name = "";
    const shortInfoElements = document.getElementsByClassName('prd_shortInfo__text');
    if (shortInfoElements.length > 0) {
        const h1Elements = shortInfoElements[0].getElementsByTagName('h1');
        if (h1Elements.length > 0) {
            name = h1Elements[0].innerText;
        }
    }

    let imgs = document.getElementsByTagName('img');
    let imgArray = Array.from(imgs);
    return imgArray.map(x => { 
        if (x.src) { 
            return { name: name, imageUrl: x.src, price: price };  
        } else if(x.srcset) { 
            return { name: name, imageUrl: x.srcset.split(',')[0], price: price }; 
        } 
        return { name: '', imageUrl: '', price: price  };  
    }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
}

function parseArticlesFromOverviewPage() {
    const articles = Array.from(document.getElementsByTagName('article'));
    return [articles[9], articles[10], articles[11], articles[12], articles[13]].map(article => {
        let price = '';
        const priceElements = article.getElementsByClassName('price')
        if (priceElements.length >= 1) { 
            const priceValueElements = priceElements[0].getElementsByClassName('value');
            const reducedPriceAmounts = priceElements[0].getElementsByClassName('reduced');
            if (reducedPriceAmounts.length >= 1) {
                price = reducedPriceAmounts[0].innerText;
            } else if (priceValueElements.length >= 1) {
                price = priceValueElements[0].innerText;
            } 
        }

        let imageUrl = '';
        const productImageWrapperElements = article.getElementsByClassName('productImageWrapper');
        if (productImageWrapperElements.length >= 1) {
            const productImageTags = productImageWrapperElements[0].getElementsByTagName('img');
            const productImageClasses = productImageWrapperElements[0].getElementsByClassName('productImage');
            if (productImageTags.length >= 1) {
                imageUrl = productImageTags[0].src;
            } else if (productImageClasses.length >= 1) {
                imageUrl = productImageClasses[0].src;
            } 
        } 

        let name = '';
        let productUrl = '';
        const productLinkElements = article.getElementsByClassName('productLink');
        if (productLinkElements.length >= 1) {
            productUrl = productLinkElements[0].href;
            const productNameElements =  productLinkElements[0].getElementsByClassName('name');
            if (productNameElements.length >= 1) {
                name = productNameElements[0].innerText
            }
        } 

        return { name: name, productUrl: productUrl, price: price, imageUrl: imageUrl };
    }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
}


/*function parseArticlesFromOverviewPage() {
    const articles = Array.from(document.getElementsByTagName('article'));
    return  Promise.all(articles.map(article => paseArticle(article)));
}

async function paseArticle(article) {
    let objc = {};
        
    objc.price = await parsePrice(article.getElementsByClassName('price'));
    objc.imageUrl = await parseImage(article.getElementsByClassName('productImageWrapper'));
    
    const productUrlAndName = await parseProductLinkAndName(article.getElementsByClassName('productLink'));
    objc.name = productUrlAndName.name;
    objc.productUrl = productUrlAndName.productUrl;

    /*parsePrice(article.getElementsByClassName('price')).then(priceValue => {
        objc.price = priceValue;
        parseImage(article.getElementsByClassName('productImageWrapper')).then(imageValue => {
            objc.imageUrl = imageValue;
            parseProductLinkAndName(article.getElementsByClassName('productLink')).then(productUrlAndName => {
                objc.name = productUrlAndName.name;
                objc.productUrl = productUrlAndName.productUrl;
                return objc;
            });
        });
    })
    return objc;
}

function parsePrice(priceElements) {
    if (priceElements.length >= 1) { 
        const priceValueElements = priceElements[0].getElementsByClassName('value');
        const reducedPriceAmounts = priceElements[0].getElementsByClassName('reduced');
        if (reducedPriceAmounts.length >= 1) {
            return Promise.resolve(reducedPriceAmounts[0].innerText);
        } else if (priceValueElements.length >= 1) {
            return Promise.resolve(priceValueElements[0].innerText);
        } 
    }
    return Promise.resolve('');
}

function parseImage(productImageWrapperElements) {
    if (productImageWrapperElements.length >= 1) {
        const productImageTags = productImageWrapperElements[0].getElementsByTagName('img');
        const productImageClasses = productImageWrapperElements[0].getElementsByClassName('productImage');
        if (productImageTags.length >= 1) {
            return Promise.resolve(productImageTags[0].src);
        } else if (productImageClasses.length >= 1) {
            return Promise.resolve(productImageClasses[0].src);
        } 
    } 
    return Promise.resolve('');
}

function parseProductLinkAndName(productLinkElements) {
    if (productLinkElements.length >= 1) {
        productUrl = productLinkElements[0].href;
        const productNameElements =  productLinkElements[0].getElementsByClassName('name');
        if (productNameElements.length >= 1) {
            return Promise.resolve({ productUrl: productUrl, name: productNameElements[0].innerText });
        } else {
            return Promise.resolve({ productUrl: productUrl, name: '' });
        }
    } 
    return Promise.resolve({ productUrl: '', name: '' });
}*/