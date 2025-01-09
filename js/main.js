import { handleSearch } from './dom.js';

const search = document.querySelector('.search-bar--button');
const changeTemp = document.querySelector('.search-bar--tempChange');
changeTemp.style.pointerEvents = 'none'; // Disable temperature change button initially
let tempState = 'C'; // Default temperature state is Celsius

// Event listener for search button
search.addEventListener('click', () => {
    handleSearch();
    changeTemp.style.pointerEvents = 'auto'; // Enable temperature change button after search
});

// Function to convert temperature between Celsius and Fahrenheit
function convertTemperature(unit, temp) {
    let convertedTemp;
    const numericTemp = parseFloat(temp); // Ensure the input is a number

    if (isNaN(numericTemp)) {
        throw new Error("Invalid temperature input. Please provide a valid number.");
    }

    if (unit.toUpperCase() === 'C') {
        // Convert Celsius to Fahrenheit
        convertedTemp = (numericTemp * 9 / 5) + 32;
    } else if (unit.toUpperCase() === 'F') {
        // Convert Fahrenheit to Celsius
        convertedTemp = (numericTemp - 32) * 5 / 9;
    } else {
        throw new Error("Invalid unit. Please use 'C' for Celsius or 'F' for Fahrenheit.");
    }

    return Math.round(convertedTemp); // Round the result
}

// Function to extract numeric temperature value from a string
function extractTemperatureValue(tempString) {
    // Extract the numeric value using a regular expression
    const match = tempString.match(/-?\d+(\.\d+)?/);
    if (match) {
        return parseFloat(match[0]);
    }
    throw new Error("Invalid temperature format in the DOM.");
}

// Function to update all temperature values in the DOM
function updateTemperatures(unit) {
    try {
        // Convert and update main temperature
        const mainTempElem = document.querySelector('.temperature--temperature');
        const mainTempValue = extractTemperatureValue(mainTempElem.textContent);
        const convertedMainTemp = convertTemperature(unit, mainTempValue);
        mainTempElem.textContent = `Temp: ${convertedMainTemp} °${unit === 'C' ? 'C' : 'F'}`;

        // Convert and update "Feels Like" temperature
        const feelsLikeElem = document.querySelector('.temperature--feels-like');
        const feelsLikeValue = extractTemperatureValue(feelsLikeElem.textContent);
        const convertedFeelsLike = convertTemperature(unit, feelsLikeValue);
        feelsLikeElem.textContent = `Feels Like: ${convertedFeelsLike} °${unit === 'C' ? 'C' : 'F'}`;

        // Convert and update forecast temperatures
        const forecastTempElems = document.querySelectorAll('.weather--temperature');
        forecastTempElems.forEach(elem => {
            const forecastTempValue = extractTemperatureValue(elem.textContent);
            const convertedForecastTemp = convertTemperature(unit, forecastTempValue);
            elem.textContent = `${convertedForecastTemp}° ${unit === 'C' ? 'C' : 'F'}`;
        });
    } catch (error) {
        console.error("Error updating temperatures:", error);
    }
}

// Event listener for temperature change button
changeTemp.addEventListener('click', () => {
    if (tempState === 'C') {
        // Convert all temperatures to Fahrenheit
        tempState = 'F';
        changeTemp.textContent = '°C'; // Update button text
        updateTemperatures('F');
    } else {
        // Convert all temperatures back to Celsius
        tempState = 'C';
        changeTemp.textContent = '°F'; // Update button text
        updateTemperatures('C');
    }
});

