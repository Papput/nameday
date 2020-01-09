"use strict"
/**
 * api.abalin.net
 */

const getNameDayToday = async () => {
    const response = await fetch('https://api.abalin.net/today');
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }
    
    const data = await response.json();
    
    return data;
}

const getDateByName = async (name, country = 'se') => {
    const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=${country}`);
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }

    const data = await response.json();

    return data;
}
const getNameDayDate = async (month, day, country) => {
    
    if(!country.length){
        const response = await fetch(`https://api.abalin.net/namedays?month=${month}&day=${day}`);
        if(response.status !== 200) {
            throw `response error, statusCode: ${response.status}`
        }
        const data = await response.json();
        return data;
    }
    const response = await fetch(`https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}`);
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }
    const data = await response.json();

    return data;
}