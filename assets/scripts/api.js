"use strict"
/**
 * api.abalin.net
 */

 //"Y"esterday "T"oday "T"omorrow 
const getNameDayByYTT = async (day, timezone, country) => {
    let response;
    if(country === ''){
        if(timezone === 'any'){
            //no spesific timezone or country
            response = await fetch(`https://api.abalin.net/${day}`);
        }else {
            //no spesific country
            response = await fetch(`https://api.abalin.net/${day}?timezone=${timezone}`);
        }
    }else if(timezone === 'any'){
        if(country === ''){
            //no spesific timezone or country
            response = await fetch(`https://api.abalin.net/${day}`);
        }else{
            //no spesific timezone only country
            response = await fetch(`https://api.abalin.net/${day}?country=${country}`);
        }
    }else{
        response = await fetch(`https://api.abalin.net/${day}?timezone=${timezone}&country=${country}`);
    }
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
    
    return {data: data, searchName: name};
}

const getNameDayDate = async (month, day, country) => {
    let response;
    if(country == ''){
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