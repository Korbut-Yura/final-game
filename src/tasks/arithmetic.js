export default function arithmetic() {
    const task = document.getElementById("task");
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