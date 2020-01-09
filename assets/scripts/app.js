"use strict"

const renderOutput = () => {

    getNameDayToday()
        .then(nameDayToday => {
            const dates = nameDayToday.data[0].dates;
            const namedays = nameDayToday.data[0].namedays;
            console.log(dates);
            console.log(namedays);

            let countrys = Object.keys(namedays);

            countrys.forEach(country => {
                document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item"><span>${country}:</span> ${namedays[country]}</li>
                `
            })
        })
    .catch(err => {
        console.log('getNameDayToday error: ', err)
    });
}

//make master function that calls getNameDayDate or getNameDayToday depending on input value
const renderOutputDate = (month, day, country = '') => {
    getNameDayDate(month, day, country)
        .then(data => {
            const namedays = data.data[0].namedays;
           
            let countrys = Object.keys(namedays);
    
            countrys.forEach(country => {
                document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item"><span>${country}:</span> ${namedays[country]}</li>
                `
            })
        })
    .catch(err => {
        console.log('getNameDayToday error: ', err)
    })

}

const renderOutputName = (name) => {
    getDateByName(name)
        .then(data => {
            console.log('getDateByName', data.results);
            if(data.results.length){
                data.results.forEach(date => {
                    const day = date.day
                    const month = date.month
                        
                    document.querySelector('#outputUl').innerHTML += `
                        <li class="list-group-item">${name}'s name day is ${month}/${day}</li>
                    `;  
                });

            } else {

                document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item">${name} does not exist in the database or the country 😔</li>
                `;
            }
        })
        .catch(err => {
            console.log('getNameDayToday error: ', err)
        })
}

//submit event listner
document.querySelector('#app form').addEventListener('submit', e => {
    //stop page from refreshing
    e.preventDefault();
    //contains a date or name
    let inputValue = document.querySelector('#inputField').value.trim();
    if(!inputValue.length){
        return;
    }

    //regex pattern ("4 digits" - "2 digits" - "2 digits")
    if(inputValue.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
        console.log('Date triggered:', inputValue)
        const date = new Date(inputValue)
        const day = date.getDate(); 
        const month = date.getMonth()+1; 
        renderOutputDate(month, day, 'se');
    }else if (inputValue.match(/^[a-zA-Z]+$/)) {
        console.log('Name triggered')
        renderOutputName(inputValue);
    }
});


//set input type after radiobox click
document.querySelector('#app form').addEventListener('click', (e) => {
    
    if(document.querySelector('#radioDate').checked) {
        document.querySelector('#inputField').type = 'date';
    } else if(document.querySelector('#radioName').checked) {
        document.querySelector('#inputField').type = 'text';
        document.querySelector('#inputField').placeholder = "Enter a name to seach for namesday date";
        if(e.target.id == 'radioName'){
            document.querySelector('#inputField').value = "";
            document.querySelector('#inputField').focus();
        }
    }
})


const countries = {
    Any: '',
    Austria: 'at',
    Czechia: 'cz',
    Denmark: 'dk',
    Germany: 'de',
    Spain: 'es',
    Finland: 'fi',
    France: 'fr',
    Croatia: 'hr',
    Hungary: 'hu',
    Italy: 'it',
    Poland: 'pl',
    Sweden: 'se',
    Slovakia: 'sk',
    USA: 'us'
}