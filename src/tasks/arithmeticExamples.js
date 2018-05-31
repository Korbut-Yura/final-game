export default function arithmeticExamples() {
    let arrOper = ['+','-','/','*'];
    let oper = _.sample(arrOper);
    let a = _.random(0,100);
    let b = _.random(0,100);
    
    let task=document.getElementById("task");
    task.innerText = `${a ,oper, b}?`;
    return false;

}