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
        console.log('getNameDayToday', err)
    })