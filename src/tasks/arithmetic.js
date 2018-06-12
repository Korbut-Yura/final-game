export default function arithmetic() {
    userInput.classList.remove("hidden");
    const taskExplanation = document.getElementById('task-explanation');
    const repeat = document.querySelector(".fa-redo-alt");
    task.classList.remove('hidden');
    repeat.classList.add('hidden');
    taskExplanation.innerText ='Решите данное выражение.'
    let arrOper = ['+','-','/','*'];
    let oper = _.sample(arrOper);
    let a = _.random(1,50);
    let b = _.random(1,50);
    let result;
       
    switch(oper) {
        case '+':  
            result = a+b;
            break;
        case '-':  
            result = a-b;
            break;
        case '*':  
            result = a*b;
            break;
        case '/':  
            a=a*b;
            result = a/b;
            break;
      }
      task.innerText = `${a} ${oper} ${b}?`;
      return result;
}