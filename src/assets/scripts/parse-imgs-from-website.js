Array.from(document.getElementsByTagName('img')).map(x => {
    if (x.src) {
        let imageSrcUrl = x.src;
        let imageUrl = imageSrcUrl;
        if (imageSrcUrl.match(/https/g)?.length > 1) {
            let urls = imageSrcUrl.split('https');
            urls.forEach(url => {
                url = 'https' + url;
                const urlToCheck = url.split(/[?#]/)[0];
                if (urlToCheck.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null) {
                    imageUrl = encodeURI(urlToCheck);
                }
            })
        } else if (imageSrcUrl.match(/http/g)?.length > 1) {
            let urls = imageSrcUrl.split('http');
            urls.forEach(url => {
                url = 'http' + url;
                const urlToCheck = url.split(/[?#]/)[0];
                if (urlToCheck.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null) {
                    imageUrl = encodeURI(urlToCheck);
                }
            })
        } else if(x.srcset) {
            return getFirstImageUrlFromSrcSet(x)
        } else if (imageSrcUrl.startsWith('//') && imageSrcUrl.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null) {
            imageUrl = adjustImageUrl(imageSrcUrl);
        }
        return { name: x.alt, imageUrl: imageUrl || '' };  
    } else if(x.srcset) {
        return getFirstImageUrlFromSrcSet(x)
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== "" && (x.imageUrl.startsWith('http') || x.imageUrl.startsWith('//')));

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
    return encodeURI(adjustedUrl);
}