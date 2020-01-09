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