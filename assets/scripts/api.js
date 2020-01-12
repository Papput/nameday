"use strict"
/**
 * api.abalin.net
 */

 //"Y"esterday "T"oday "T"omorrow 
const getNameDayByYTT = async (day, timezone, country) => {
    console.log(day, timezone, country);
    const response = await fetch(`https://api.abalin.net/${day}?timezone=${timezone}&country=${country}`);
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }
    
    const data = await response.json();
    
    return data;
}

const getDateByName = async (name, country) => {
    
    if(!country.length){
        throw `Getting Namesday date by name requiers a country`;
    }
    const response = await fetch(`https://api.abalin.net/getdate?name=${name}&country=${country}`);
    
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }

    const data = await response.json();
    //othernames that have namesday on the same day 

    //buggs when name doesn't exist in the country
    if(!data.results.length){
        throw `${name} doesnt seem to exist in that country`
    }
    console.log('Get date by name:', data.results);
    const day = data.results[0].day;
    const month = data.results[0].month;
    console.log(day, month);
    const othernames = await getNameDayDate(month, day,  '');
    return {data: data, names: othernames};
}
const getNameDayDate = async (month, day, country) => {
    let response;
    if(!country.length){
        response = await fetch(`https://api.abalin.net/namedays?month=${month}&day=${day}`);
    } else {
        response = await fetch(`https://api.abalin.net/namedays?country=${country}&month=${month}&day=${day}`);
    }
    if(response.status !== 200) {
        throw `response error, statusCode: ${response.status}`
    }
    const data = await response.json();

    return data;
}