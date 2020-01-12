"use strict"

//remove????
const renderOutput = (day, timezone, country) => {

    getNameDayByYTT(day, timezone, country)
        .then(nameDay => {
            const dates = nameDay.data[0].dates;
            const namedays = nameDay.data[0].namedays;
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
        document.querySelector('#outputUl').innerHTML += `
            <li class="alert alert-warning">Oppsi! ${err}</li>
        `;
    });
};

//make master function that calls getNameDayDate or getNameDayToday depending on input value
const renderOutputDate = (month, day, country = '') => {
    getNameDayDate(month, day, country)
        .then(data => {
            const namedays = data.data[0].namedays;
           
            let countrys = Object.keys(namedays);
    
            countrys.forEach(country => {
                document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item"><span>${country}:</span> ${namedays[country]}</li>
                `;
            })
        })
    .catch(err => {
            document.querySelector('#outputUl').innerHTML += `
            <li class="alert alert-warning">Oppsi! ${err}</li>
        `;
    })

};

const renderOutputName = (name, country) => {
    getDateByName(name, country)
        .then(data => {
            if(data.data.results.length){

                //Render that day the person has the nameday
                const day = data.data.results[0].day
                const month = data.data.results[0].month
                const pEl = document.createElement('p');
                    
                pEl.innerHTML += `
                    ${name}'s name day is: <span>${month}/${day}</span>
                `;
                
                document.querySelector('#app section').insertBefore(pEl, document.querySelector('#outputUl'));

                
                if(data.names.data.length) {
                    
                    const h2El = document.createElement('h2');
                    h2El.innerHTML = 'other names with the same nameday';
                    document.querySelector('#app section').insertBefore(h2El, document.querySelector('#outputUl'));
                    
                    const sameNameDay = data.names.data[0].namedays;

                    const sameNamedayKeys = Object.keys(sameNameDay);

                    sameNamedayKeys.forEach(key => {
                            document.querySelector('#outputUl').innerHTML += `
                                <li class="list-group-item"><span>${key}:</span> ${sameNameDay[key]}</li>
                        `;
                    });
                }
                //Render the other ppl that has the same nameday

            } else {

                document.querySelector('#outputUl').innerHTML += `
                    <li class="alert alert-warning">${name} does not exist in the database or the country 😔</li>
                `;
            }
        })
        .catch(err => {
            document.querySelector('#outputUl').innerHTML += `
                    <li class="alert alert-warning">Oppsi! ${err}</li>
                `;
        })
};

const updateCountrySelect = () => {
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
        Slovakia: 'sk',
        Sweden: 'se',
        USA: 'us'
    }

    const CountryNames = Object.keys(countries);
    CountryNames.sort();

    CountryNames.forEach(countryName => {
        document.querySelector('#countrySelect').innerHTML += `
            <option value="${countries[countryName]}">${countryName}</option>
        `;
    })


};

const clearScreen = () => {
    document.querySelector('#outputUl').innerHTML = '';
}
//submit event listner
document.querySelector('#app form').addEventListener('submit', e => {
    //stop page from refreshing
    e.preventDefault();
    //contains a date or name
    let inputValue = document.querySelector('#inputField').value.trim();
    let inputCountry = document.querySelector('#countrySelect').value;
    console.log(inputCountry);
    if(!inputValue.length){
        clearScreen();
        document.querySelector('#outputUl').innerHTML += `
            <li class="alert alert-warning">Oppsi! inputfield is empty 😅</li>
        `;
        return;
    }

    //clear screen before search
    clearScreen();

    //regex pattern ("4 digits" - "2 digits" - "2 digits")
    if(inputValue.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
        console.log('Date triggered:', inputValue)
        const date = new Date(inputValue)
        const day = date.getDate(); 
        const month = date.getMonth()+1; 
        renderOutputDate(month, day, inputCountry);
    }else if (inputValue.match(/^[a-zA-Z]+$/)) {
        console.log('Name triggered')
        renderOutputName(inputValue, inputCountry);
    }
});


//set input type after radiobox click -> set input after selection
document.querySelector('#app form').addEventListener('click', (e) => {
    
    if(document.querySelector('#radioDate').checked) {
        document.querySelector('#inputField').type = 'date';
    } else if(document.querySelector('#radioName').checked) {
        document.querySelector('#inputField').type = 'text';
        document.querySelector('#inputField').placeholder = "Enter a name";
        if(e.target.id == 'radioName'){
            document.querySelector('#inputField').value = "";
            document.querySelector('#inputField').focus();
        }
    }
});

updateCountrySelect();

const timeZones = [ "America/Denver", "America/Costa_Rica", "America/Los_Angeles", "America/St_Vincent", "America/Toronto", "Europe/Amsterdam", "Europe/Monaco", "Europe/Prague", "Europe/Isle_of_Man", "Africa/Cairo", "Africa/Johannesburg", "Africa/Nairobi", "Asia/Yakutsk", "Asia/Hong_Kong", "Asia/Taipei", "Pacific/Midway", "Pacific/Honolulu", "Etc/GMT-6", "US/Samoa", "Zulu", "US/Hawaii", "Israel", "Etc/GMT-2" ]