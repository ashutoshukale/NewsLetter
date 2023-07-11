const clr=document.querySelector('button');
const inputs=document.querySelectorAll('input');

clr.addEventListener('click',(e)=>{
    inputs.forEach(input=> input.value = "");
})

