export default function memory() {
    const repeat = document.querySelector(".fa-redo-alt");
    const taskExplanation = document.getElementById('task-explanation');
    task.classList.remove('hidden');
    userInput.classList.add('hidden');
    repeat.classList.add('hidden');
    taskExplanation.innerText = "Запомните и введите пятизначное число."
    task.innerText = "Нажми, чтобы увидеть число.";
    let result = String(Math.random()).slice(2,8);
    task.addEventListener('click', () => {
        task.innerText = result;
        setTimeout(()=> {
            task.classList.add('hidden');
            userInput.classList.remove('hidden');
        },1000)
    })
    return result;
}