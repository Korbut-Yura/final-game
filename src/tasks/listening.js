export default function listening() { 
    const taskExplanation = document.getElementById('task-explanation');
    const task = document.getElementById("task");
    const repeat = document.querySelector(".fa-redo-alt");
    userInput.classList.remove("hidden");
    task.classList.add('hidden');
    repeat.classList.remove('hidden');
    taskExplanation.innerText ='Введите прознесенное слово.';
    let result =_.sample(Object.keys(vocabulary));
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(result);
    utterThis.lang = 'en-US';
    synth.speak(utterThis);

    repeat.addEventListener('click',()=> {
        synth.speak(utterThis);
    })
    return result;
}

import {vocabulary} from "./vocabulary.js";