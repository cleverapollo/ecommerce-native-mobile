Array.from(document.getElementsByTagName('img')).map(x => { 
    if (x.src) { 
        return { name: x.alt, imageUrl: x.src };  
    } else if(x.srcset) { 
        return { name: x.alt, imageUrl: x.srcset.split(',')[0] }; 
    } 
    return { name: '', imageUrl: ''  };  
}).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));