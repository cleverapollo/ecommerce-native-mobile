var ExtensionClass = function() {};

ExtensionClass.prototype = {
    run: function(arguments) {
        arguments.completionFunction({
            "title": document.title,
            "hostname": document.location.hostname,
            "favicon": this.fetchFavicon(),
            "productInfos": this.fetchProductInfos(),
            "url": document.URL
        });
    },
    fetchFavicon: function() {
        return Array.from(document.getElementsByTagName("link"))
                .filter(element => element.rel == "icon" || element.rel == "shortcut icon")
                .map(elem => elem.href)[0];
    },
    fetchProductInfos: function() {
        return Array.from(document.getElementsByTagName('img')).map(x => { 
            if (x.src) { 
                return { name: x.alt, imageUrl: x.src };  
            } else if(x.srcset) { 
                return { name: x.alt, imageUrl: x.srcset.split(',')[0] }; 
            } 
            return { name: '', imageUrl: ''  };  
        }).filter(x => x.imageUrl !== "" && x.imageUrl.startsWith('http'));
    }
};

var ExtensionPreprocessingJS = new ExtensionClass;
