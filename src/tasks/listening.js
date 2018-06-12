    let synth = window.speechSynthesis;
    const repeat = document.querySelector(".fa-redo-alt");
    let utterThis;

    repeat.addEventListener('click', ()=> {
        synth.cancel();
        synth.speak(utterThis);
    })
  
export default function listening() { 
    const task = document.getElementById("task");
    const taskExplanation = document.getElementById('task-explanation');
    userInput.classList.remove("hidden");
    task.classList.add('hidden');
    repeat.classList.remove('hidden');

    taskExplanation.innerText ='Введите произнесенное слово.';
    let result =_.sample(Object.keys(vocabulary));
    utterThis = new SpeechSynthesisUtterance();
    utterThis.text = result;
    utterThis.rate = 0.5;
    utterThis.lang = 'en-US';
    utterThis.voice
    synth.speak(utterThis);

    return result;
}

import {vocabulary} from "./vocabulary.js";