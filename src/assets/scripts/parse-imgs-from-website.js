Array.from(document.getElementsByTagName('img')).map(x => { 
    if (x.src) { 
        let imageSrcUrl = x.src;
        let imageUrl = '';
        console.log(imageSrcUrl);
        if (imageSrcUrl.match(/https/g)?.length === 1 || imageSrcUrl.match(/http/g)?.length === 1) {
            const urlToCheck = imageSrcUrl.split(/[?#]/)[0];
            if (urlToCheck.match(/(jpeg|jpg|svg|png|tiff|tif|gif)$/) != null) {
                imageUrl = imageSrcUrl;
            }
        } else if (imageSrcUrl.match(/https/g)?.length > 1) {
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