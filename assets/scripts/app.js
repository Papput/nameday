"use strict"

/**
 * 1. Page helper functions
 * 2. Page Render functions
 * 3. Event listeners
 * 4. Page load
 */

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
    document.querySelector('#output').innerHTML = ``;
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
	console.log(layout);
    switch(layout) {
        case 'date':
            document.querySelector('#inputField').type = 'date';
            document.querySelector('#inputField').readOnly = false;
            //remove Timezone if rendered
            if(timezoneQ){
                document.querySelector('#Timezone').remove();
            }
            break;
            
            case 'name':
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
                }

            break;
    }
}

const renderAccordion = (cardList) => {
	//render accordionWrapper
	const accordionEl = document.createElement('div');
	accordionEl.className = 'accordion';
	accordionEl.id = 'accordionWrapper';
	document.querySelector('#output').append(accordionEl);
	
	//Render accordion cards
	cardList.forEach((cardObject, index) => {
		const humanDate = moment().month(cardObject.month).date(cardObject.day).format('D MMMM');
		const cardEl = document.createElement('div');
		cardEl.className = 'card';
		cardEl.innerHTML = `
			<div class="card-header collapsed" id="heading${index}" type="button" data-toggle="collapse" data-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
				<h2>${cardObject.name}'s name day is ${humanDate}.</h2>
			</div>

			<div id="collapse${index}" class="collapse" aria-labelledby="heading${index}" data-parent="#accordionWrapper">
				<div class="card-body">
					<h3>Other ${humanDate} name day names</h3>
					<ul id="outputUl${index}" class="list-group">
						
					</ul>
				</div>
			</div>
		`
	document.querySelector('#accordionWrapper').append(cardEl);

	//render sameName dates
	getNameDayDate(cardObject.month, cardObject.day, '')
		.then(data => {
			data.data.forEach(result => {
				let countrys = Object.keys(result.namedays);
				countrys.forEach(country => {
					document.querySelector(`#outputUl${index}`).innerHTML += `
                    	<li class="list-group-item"><span>${country}:</span> ${result.namedays[country]}</li>
                	`;
				})
			
			})
		})
	});
}
//render api data
const renderOutputDay = (day, timezone, country) => {

    getNameDayByYTT(day, timezone, country)
        .then(nameDay => {
            const namedays = nameDay.data[0].namedays;
            let countrys = Object.keys(namedays);

			document.querySelector('#output').innerHTML = `
				<ul id="outputUl" class="list-group"></ul>
			`
            countrys.forEach(country => {
                document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item"><span>${country}:</span> ${namedays[country]}</li>
                `
            })
        })
    .catch(err => {
        document.querySelector('#output').innerHTML += `
            <p class="alert alert-warning">Oppsi! ${err}</p>
        `;
    });
};

const renderOutputDate = (month, day, country = '') => {
    getNameDayDate(month, day, country)
        .then(data => {
            const namedays = data.data[0].namedays;
           
            let countrys = Object.keys(namedays);
			
			document.querySelector('#output').innerHTML = `
				<ul id="outputUl" class="list-group"></ul>
			`
            countrys.forEach(country => {
				document.querySelector('#outputUl').innerHTML += `
                    <li class="list-group-item"><span>${country}:</span> ${namedays[country]}</li>
                `;
            })
        })
    .catch(err => {
            document.querySelector('#output').innerHTML += `
            <p class="alert alert-warning">Oppsi! ${err}</p>
        `;
    })
};

const renderOutputName = (name, country) => {
    getDateByName(name, country)
        .then(data => {
            if(data.data.results.length){
				renderAccordion(data.data.results);
            } else {
                document.querySelector('#output').innerHTML += `
                    <p class="alert alert-warning">${name} does not exist in the database or the country 😔</p>
                `;
            }
        })
        .catch(err => {
            document.querySelector('#output').innerHTML += `
                    <p class="alert alert-warning">Oppsi! ${err}</p>
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
        document.querySelector('#output').innerHTML += `
            <p class="alert alert-warning">Oppsi! inputfield is empty 😅</p>
        `;
        return;
    }

    //clear screen before search
    clearScreen();

    //regex pattern ("4 digits" - "2 digits" - "2 digits")
    if(inputValue.match(/^\d{4}\-\d{2}\-\d{2}$/)) {
        const date = new Date(inputValue)
        const day = date.getDate(); 
        const month = date.getMonth()+1; 
        renderOutputDate(month, day, inputCountry);
    } else if (inputValue.match(/^[a-zA-Z]+$/)) {
        renderOutputName(inputValue, inputCountry);
    } else if (inputSelectDay == 'today' ||
        inputSelectDay == 'tomorrow' ||
        inputSelectDay == 'yesterday') {
            renderOutputDay(inputSelectDay, inputTimeZone, inputCountry);

    } else {
        document.querySelector('#output').innerHTML += `
            <p class="alert alert-warning">${inputValue} is an Invalid input 😅</p>
        `;
    }
});


//dateSelect event listner
document.querySelector('#app #dateSelect').addEventListener('ValueChange', (e) => {
	console.log('helloooo google?????')
    renderLayout(e.target.value);
});

/**
 * Page load
 */

//Set Pagestart
dateSelectStartValue();
updateCountrySelect();