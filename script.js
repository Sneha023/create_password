const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copybtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password="";
let passwordLength=10;
let checkCount=0;
//ste strength circlecolor to grey
setIndicator("#ccc");

handleSlider();
function handleSlider(){
    inputSlider.value= passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min =inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength - min)*100/(max - min)) + "% 100%"
                            
}
console.log("handlefunction");
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow= `0px 0px 12px 1px ${color}`;
}
 function getRanInteger(min,max){
    return Math.floor(Math.random()*(max-min)+min);
 }
 function generateRandomNumber(){
    return getRanInteger(0,9);
 }
 function generateLowerCase(){
    return String.fromCharCode(getRanInteger(97,123));   //a=97,z=123
 }
 function generateUpperCase(){
    return String.fromCharCode(getRanInteger(65,91));   //A=65,Z=91
 }
 function generateSymbol(){
    const randNum = getRanInteger(0,symbol.length);
    return symbol.charAt(randNum);
 }
 function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    if(hasUpper && hasLower && (hasNum || hasSym)&& passwordLength>=8 ){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper)&&(hasNum ||hasSym) && passwordLength>=6){
            setIndicator("#ff0");
        }
        else{
            setIndicator("#f00");
        }
    }
    async function copyContent(){
        try{
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyMsg.innerText="copied!";
        }
        catch(e){
            copyMsg.innerText="Failed";
        }
        //to make copy wala visible
        copyMsg.classList.add("active");

        setTimeout( () =>{
            copyMsg.classList.remove("active");
        },2000);
    }
    function shufflePassword(array){
        //fisher yates method
        for(let i=array.length-1;i>0;i--){
            const j=Math.floor(Math.random()*(i+1));
            const temp =array[i];
            array[i]=array[j];
            array[j]=temp;
        }
        let str ="";
        array.forEach((el) => (str+= el));
        return str;
    }
    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckBox.forEach( (checkbox) => {
            if(checkbox.checked)
                checkCount++;
        });
    
        //special condition
        if(passwordLength < checkCount ) {
            passwordLength = checkCount;
            handleSlider();
        }
    }    
    allCheckBox.forEach( (checkbox) => {
        checkbox.addEventListener('change', handleCheckBoxChange);
    })
    inputSlider.addEventListener('input',(e)=>{
        passwordLength=e.target.value;
        handleSlider();
    })
    copybtn.addEventListener('click',()=>{
        if(passwordDisplay.value){
            copyContent();
        }
    })
    generateBtn.addEventListener('click',()=>{
        //none of the checkbox are selected
        if(checkCount <=0) return;
        if(passwordLength < checkCount){
            passwordLength=checkCount;
            handleSlider();
        }
        //finding new pass
        //remove old pass
        password="";
        //putt the stuff bycheckboxes

        // if(uppercaseCheck.checked){
        //     password+= generateUpperCase();
        // }
        // if(lowercaseCheck.checked){
        //     password+= generateLowerCase();
        // }
        // if(numbersCheck.checked){
        //     password+= generateRandomNumber();
        // }
        // if(symbolsCheck.checked){
        //     password+= generateSymbol();
        // }
        let funcArr =[];
        if(uppercaseCheck.checked)
            funcArr.push(generateUpperCase);
         if(lowercaseCheck.checked)
            funcArr.push(generateLowerCase);
         if(numbersCheck.checked)
            funcArr.push(generateRandomNumber);
        if(symbolsCheck.checked)
            funcArr.push(generateSymbol);
          //compulsory addition
          for(let i=0; i<funcArr.length; i++){
            password+= funcArr[i]();
          }  
          //remaining add
          for(let i=0; i<passwordLength-funcArr.length;i++){
            let randIndex = getRanInteger(0, funcArr.length);
            password += funcArr[randIndex]();
          }
          //shuffle the password
          password=shufflePassword(Array.from(password));
          //show in UI
          passwordDisplay.value=password;

          //calsulate strength
          calcStrength();
    })


