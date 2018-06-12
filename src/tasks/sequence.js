export default function sequence() {
    userInput.classList.remove("hidden");
    task.classList.remove('hidden');
    const taskExplanation = document.getElementById('task-explanation');
    taskExplanation.innerText = "Закончите последовательнотсь.";

    let option = ['prev','prev','prev'];
    let curOption = _.sample(option);
    let item = _.random(1,9);
    let randomItem = _.random(2,9);
    let arrSequence =[item];

    let i = 0;
    let result;

    while (i < 4) {
        switch (curOption) {
            case 'multy':
                item *= randomItem; 
                break;
            case 'prev':
                item += arrSequence[i-1]||0;
                break;
            case 'sum':
                item += randomItem;
                break;
        }
        arrSequence.push(item);
        i++
    }    
    result = arrSequence[3];
    arrSequence[3] = '...';
    task.innerText = arrSequence.join(' , ');
    return result;
}