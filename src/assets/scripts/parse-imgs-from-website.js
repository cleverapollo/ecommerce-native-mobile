Array.from(document.getElementsByTagName('img')).map(x => {
    if (x.src) {
        let imageSrcUrl = x.src;
        let imageUrl = getPathFromUrl(imageSrcUrl);
        if (imageSrcUrl.match(/https/g)?.length > 1) {
            imageUrl = validateImageUrl(imageSrcUrl, 'https');
        } else if (imageSrcUrl.match(/http/g)?.length > 1) {
            imageUrl = validateImageUrl(imageSrcUrl, 'http');
        } else if(x.srcset) {
            return getFirstImageUrlFromSrcSet(x)
        } else if (imageSrcUrl.startsWith('//')) {
            imageSrcUrl = 'https' + imageSrcUrl;
            imageUrl = validateImageUrl(imageSrcUrl, 'https');
        }
        return { name: x.alt, imageUrl: imageUrl || '' };  
    } else if(x.srcset) {
        return getFirstImageUrlFromSrcSet(x)
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== "" && (x.imageUrl.startsWith('http') || x.imageUrl.startsWith('//')));

function validateImageUrl(imageSrcUrl, protocol) {
    let imageUrl = imageSrcUrl;
    let urls = imageSrcUrl.split(protocol);
    urls.forEach(url => {
        const urlToCheck = protocol + url;
        if (urlToCheck.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null) {
            imageUrl = encodeURI(urlToCheck);
        } else {
            imageUrl = '';
        }
    });
    return imageUrl;
}

function getFirstImageUrlFromSrcSet(x) {
    const imagesUrls = Array.from(x.srcset.split(','))
        .filter(url => url.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null);
    let imageUrl = '';
    if (imagesUrls.length >= 1) {
        imageUrl = adjustImageUrl(imagesUrls[0])
    }
    return { name: x.alt, imageUrl: imageUrl };
}

function adjustImageUrl(imageUrl) {
    let adjustedUrl = imageUrl.split(' ')[0];
    if (adjustedUrl.startsWith('//')) {
        adjustedUrl = 'https:' + adjustedUrl;
    }
    adjustedUrl = getPathFromUrl(adjustedUrl);
    return encodeURI(adjustedUrl);
}

function getPathFromUrl(url) {
    return url.split("?")[0];
  }