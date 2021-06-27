Array.from(document.getElementsByTagName('img')).map(x => {
    if (x.src) {
        let imageUrl = validateUrl(x.src);
        if (x.srcset) {
            imageUrl = getFirstImageUrlFromSrcSet(x.srcset);
        }
        return { name: x.alt, imageUrl: imageUrl || '' };  
    } else if (x.srcset) {
        const imageUrl = getFirstImageUrlFromSrcSet(x.srcset);
        return { name: x.alt, imageUrl: imageUrl || '' };
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== '' && (x.imageUrl.startsWith('http')))
.sort(sortBySvgImages);

function validateUrl(url) {
    let imageUrl = url;
    if (!url.startsWith('http') && url.startsWith('//')) {
        imageUrl = 'https:' + url; 
    }
    imageUrl = prepareImageUrlIfNeeded(imageUrl)
    return encodeURI(imageUrl);
}

function prepareImageUrlIfNeeded(url) {
    const validImageTypes = ['.jpeg', ,'.jpg','.svg','.png','.tiff','.tif','.gif'];
    for (const type of validImageTypes) {
        const indexOfTypeString = url.indexOf(type);
        if (indexOfTypeString !== -1) {
            url = url.substring(0, indexOfTypeString + type.length);
            break;
        }
    }
    return url;
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