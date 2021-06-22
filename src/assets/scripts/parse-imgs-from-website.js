Array.from(document.getElementsByTagName('img')).map(x => { 
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
        } else if(x.srcset) {
            return getFirstImageUrlFromSrcSet(x); 
        } 
        return { name: x.alt, imageUrl: imageUrl || '' };  
    } else if(x.srcset) {
        return getFirstImageUrlFromSrcSet(x);  
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== "" && (x.imageUrl.startsWith('http') || x.imageUrl.startsWith('//')));

function getFirstImageUrlFromSrcSet(x) {
    const imagesUrls = Array.from(x.srcset.split(','))
        .filter(url => url.match(/\.(jpeg|jpg|svg|png|tiff|tif|gif)/g) != null);
    return { name: x.alt, imageUrl: imagesUrls[0] || '' };
}
