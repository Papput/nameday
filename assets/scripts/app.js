"use strict"

getNameDayToday()
    .then(nameDayToday => {
        const dates = nameDayToday.data[0].dates;
        const namedays = nameDayToday.data[0].namedays;

        
        console.log(dates);
        console.log(namedays);
        
        const countrieCode = Object.keys(namedays);
        countrieCode.forEach(country => {
            console.log(country);
            console.log(namedays[country]);
        })
    })
.catch(err => {
    console.log('getNameDayToday error: ', err)
});


//submit event listner
document.querySelector('#app form').addEventListener('submit', e => {
    //stop page from refreshing
    e.preventDefault();

    //contains a date or name
    let inputValue = document.querySelector('#inputField').value;
    if(!inputValue.length){
        return;
    }
    console.log(inputValue.length);
});


document.querySelector('#app form').addEventListener('click', e => {
    if(e.target.id == 'radioDate') {
        document.querySelector('#inputField').type = 'date';
    }else if(e.target.id == 'radioName') {
        document.querySelector('#inputField').type = 'text';
    }
})


