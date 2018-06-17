let resourceCache ={};
let readyCallbacks =[];

export default function resources(urlOrArray) {
    if (urlOrArray.every(i => resourceCache[i])) {

        readyCallbacks.forEach(function(func) { func()})
    }
    else {
        urlOrArray.forEach((url) => resources.load(url));    
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
    let ready = true;
    for(let k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

resources.onReady = function(func) {
    readyCallbacks =[];
    readyCallbacks.push(func);
}
