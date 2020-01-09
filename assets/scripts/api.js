"use strict"
/**
 * api.abalin.net
 */

const getNameDayToday = async () => {
    const response = await fetch('https://api.abalin.net/today');
    const data = await response.json();
    console.log(data);
}