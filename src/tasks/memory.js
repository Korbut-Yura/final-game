export default function memory() {
    const taskExplanation = document.getElementById('task-explanation');
    taskExplanation.innerText = "Запомните и введите пятизначное число."
    task.innerText = "Нажми, чтобы увидеть число.";
    let result = String(Math.random()).slice(2,7);
    task.addEventListener('click', () => {
        task.innerText = result;
        setTimeout(()=> {
            task.classList.add('hidden');
        },1000)
    })
    return result;
}