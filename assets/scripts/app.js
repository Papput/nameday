"use strict"

/**
 * Page helper functions
 * 
 */
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

const updateTimezoneSelect = () => {
    const timeZones = [ "America/Denver", "America/Costa_Rica", "America/Los_Angeles", "America/St_Vincent", "America/Toronto", "Europe/Amsterdam", "Europe/Monaco", "Europe/Prague", "Europe/Isle_of_Man", "Africa/Cairo", "Africa/Johannesburg", "Africa/Nairobi", "Asia/Yakutsk", "Asia/Hong_Kong", "Asia/Taipei", "Pacific/Midway", "Pacific/Honolulu", "Etc/GMT-6", "US/Samoa", "Zulu", "US/Hawaii", "Israel", "Etc/GMT-2" ];

    timeZones.forEach(timezone => {
        document.querySelector('#Timezone').innerHTML += `
            <option value="${timezone}">${timezone}</option>
        `
    })
}

const clearScreen = () => {
    document.querySelector('#output').innerHTML = `
        <ul id="outputUl" class="list-group">
        </ul>
    `;
}

const dateSelectStartValue = () => {
    renderLayout(document.querySelector('#app #dateSelect').value)
}


/**
 * Page Render functions
 * 
 */

 // render layout depending on dateSelect value 
const renderLayout = (layout) => {
    const timezoneQ = document.querySelector('#Timezone');
    switch(layout) {
        case 'date':
            console.log(document.querySelector('#app #dateSelect').value);
            document.querySelector('#inputField').type = 'date';
            document.querySelector('#inputField').readOnly = false;
            //remove Timezone if rendered
            if(timezoneQ){
                document.querySelector('#Timezone').remove();
            }
            break;
            
            case 'name':
                console.log(document.querySelector('#app #dateSelect').value);
                document.querySelector('#inputField').type = 'text';
                document.querySelector('#inputField').value = "";
                document.querySelector('#inputField').placeholder = "Enter a name";
                document.querySelector('#inputField').readOnly = false;
                document.querySelector('#inputField').focus();
                
                //remove Timezone if rendered
                if(timezoneQ){
                    document.querySelector('#Timezone').remove();
                }
                break;
                
            default:
                console.log(document.querySelector('#app #dateSelect').value);
                document.querySelector('#inputField').placeholder = `${layout.toUpperCase()}`;
                document.querySelector('#inputField').type = 'text';
                document.querySelector('#inputField').value = "";
                document.querySelector('#inputField').readOnly = true;

                //render Timezone if not rendered
                if(!timezoneQ) {
                    const timezoneEl = document.createElement('select');
                    timezoneEl.classList.value = "custom-select col-6";
                    timezoneEl.id = "Timezone";
                    timezoneEl.innerHTML = `<option value="any">UTC +1h</option>`;
                    document.querySelector('#selectRow').append(timezoneEl);
                    updateTimezoneSelect();

                    //<select class="" id="Timezone">
                    //<option value="any">Timezone</option>
                    //</select>
                }

            break;
    }
}


//render api data
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

				console.log(data.searchName)
				//Render that day the person/persons has the namedays
                console.log('data: ', data);
                const result = data.data.results; 
                let day = result[0].day;
                let month = result[0].month;
                let name = result[0].name;
                
                const pEl = document.createElement('p');
                const humanDate = moment().month(month).date(day).format('D MMMM');
				
				//if serach name is same as api call return render name and date
				if(data.searchName == name){
					pEl.innerHTML += `
						${name}'s name day is: <span>${humanDate}</span>
					`;
				} else {  // else render closest name
					pEl.innerHTML += `
						Could not find ${data.searchName}. Closest name found: ${name}'s name day is: <span>${humanDate}</span>
					`;
				}
				
                document.querySelector('#output').insertBefore(pEl, document.querySelector('#outputUl'));
                    

                //render names with same date
                const h2El = document.createElement('h2');
                h2El.innerHTML = 'other names with the same name day';
                document.querySelector('#output').insertBefore(h2El, document.querySelector('#outputUl'));
                console.log('data.names.data: ', data.names.data);
                const sameNameDay = data.names.data[0].namedays;
                const sameNamedayKeys = Object.keys(sameNameDay);
                sameNamedayKeys.forEach(key => {
                        document.querySelector('#outputUl').innerHTML += `
                            <li class="list-group-item"><span>${key}:</span> ${sameNameDay[key]}</li>
                    `;
                });
            
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



/**
 *  Event listeners
 * 
 */


//submit event listner
document.querySelector('#app form').addEventListener('submit', e => {
    //stop page from refreshing
    e.preventDefault();
    //contains a date or name
    const inputValue = document.querySelector('#inputField').value.trim();
    const inputCountry = document.querySelector('#countrySelect').value;
    const inputSelectDay = document.querySelector('#app #dateSelect').value;
    
    //if timeZOne is avalible set value
    let inputTimeZone;
    if(document.querySelector('#Timezone')){
        inputTimeZone = document.querySelector('#Timezone').value;
    }

    //if input is empty and not searching by today etc.. render error message for empty input
    if(!inputValue.length && !document.querySelector('#Timezone')){
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
    } else if (inputValue.match(/^[a-zA-Z]+$/)) {
        console.log('Name triggered')
        renderOutputName(inputValue, inputCountry);
    } else if (inputSelectDay == 'today' ||
        inputSelectDay == 'tomorrow' ||
        inputSelectDay == 'yesterday') {
            console.log('timezone:', inputTimeZone);
            renderOutput(inputSelectDay, inputTimeZone, inputCountry)

    } else {
        document.querySelector('#outputUl').innerHTML += `
            <li class="alert alert-warning">${inputValue} is an Invalid input 😅</li>
        `;
    }
});


//dateSelect event listner
document.querySelector('#app #dateSelect').addEventListener('ValueChange', (e) => {
    renderLayout(e.target.value);
});


//Set Pagestart
dateSelectStartValue();
updateCountrySelect();