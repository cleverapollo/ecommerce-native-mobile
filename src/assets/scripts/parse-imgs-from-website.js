Array.from(document.getElementsByTagName('img')).map(x => {
    if (x.src) {
        let imageUrl = validateUrl(x.src);
        if (imageUrl === '' && x.srcset) {
            imageUrl = getFirstImageUrlFromSrcSet(x.srcset);
        }
        return { name: x.alt, imageUrl: imageUrl || '' };  
    } else if (x.srcset) {
        const imageUrl = getFirstImageUrlFromSrcSet(x.srcset);
        return { name: x.alt, imageUrl: imageUrl || '' };
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== '' && (x.imageUrl.startsWith('http')));

function validateUrl(url) {
    let imageUrl = url;
    if (!url.startsWith('http') && url.startsWith('//')) {
        imageUrl = 'https:' + url; 
    }
    return encodeURI(imageUrl);
}

function getFirstImageUrlFromSrcSet(srcset) {
    const imagesUrls = Array.from(srcset.split(','));
    let imageUrl = '';
    if (imagesUrls.length >= 1) {
        imageUrl = validateUrl(imagesUrls[0])
    }
    return imageUrl;
}
