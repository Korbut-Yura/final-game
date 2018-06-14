let resourceCache ={};
let loading =[];
let readyCallbacks =[];

export default function resources(urlOrArray) {
    if (urlOrArray instanceof Array) {
        urlOrArray.forEach((url) => resources.load(url));
    }
    else {
        resources.load(urlOrArray);
    }
}

resources.load = function(url) { 
    if (resourceCache[url]) {
        return resourceCache[url];
    }
    else {
        let img = new Image();
        img.onload = () => {
            resourceCache[url] = img;
            if(resources.isReady()) {
                readyCallbacks.forEach(function(func) { func()});
            }
        }
        resourceCache[url] = false;
        img.src = url;
    }
}

resources.get = function (url) {
    return resourceCache[url];
}

resources.isReady = function() {
    var ready = true;
    for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) &&
            !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

resources.onReady = function(func) {
    readyCallbacks.push(func);
}
