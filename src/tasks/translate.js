import {vocabulary} from "./vocabulary.js";


export default function translate() {
    const task = document.getElementById("task");
    let keys = Object.keys(vocabulary);
    let randomKey = keys[_.random(0, keys.length-1)];
    let answer = vocabulary[randomKey][0];
    task.innerText = `${randomKey}`;
    return answer;
}

