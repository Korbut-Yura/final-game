const preloader = document.querySelector('.preloaderWrapper');
let resourceCache ={};
let readyCallbacks =[];

export default function resources(urlOrArray) {
    if (urlOrArray.every(i => resourceCache[i])) {
        readyCallbacks.forEach(function(func) { func()})
    }
    else {
        preloader.classList.remove('hidden');
        urlOrArray.forEach((url) => resources.load(url));      
    }
}

resources.load = function(url) { 
    if (resourceCache[url]) {
        return resourceCache[url];
    }
    else {
        if (/.(png|jpg)/.test(url)) {
            let img = new Image();
            img.onload = () => {
                resourceCache[url] = img;
                if(resources.isReady()) {
                    preloader.classList.add('hidden');
                    readyCallbacks.forEach(function(func) { func()});
                }
            }
            resourceCache[url] = false;
            img.src = url;
        }
        if (/.(ogg|wav)/.test(url)) {
            let audio = new Audio();
            audio.oncanplaythrough = () => {
                resourceCache[url] = audio;
                if(resources.isReady()) {
                    preloader.classList.add('hidden');
                    readyCallbacks.forEach(function(func) { func()});
                }
            }
            resourceCache[url] = false;
            audio.src = url;
        } 
       
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
