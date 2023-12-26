let allData, worldData, afData, asData, euData, naData, ocData, saData;
async function loadData() {
    allData = await d3.csv("data/cause_of_deaths.csv");

    afData = await selectContinentData("AF");
    asData = await selectContinentData("AS");
    euData = await selectContinentData("EU");
    naData = await selectContinentData("NA");
    ocData = await selectContinentData("OC");
    saData = await selectContinentData("SA");

    sumByYear_all(allData);
    sumByYear_continents(afData, "Africa", "AF");
    sumByYear_continents(asData, "Asia", "AS");
    sumByYear_continents(euData, "Europe", "EU");
    sumByYear_continents(naData, "North America", "NA");
    sumByYear_continents(ocData, "Oceania", "OC");
    sumByYear_continents(saData, "South America", "SA");

    worldData = await getWorldAndContinentsData();

    /*const geo = sessionStorage.getItem("selectedGeo");
    switch (geo) {
        case "World":
            console.log(worldData);
            break;
        case "Africa":
            console.log(afData);
            break;
        case "Asia":
            console.log(asData);
            break;
        case "Europe":
            console.log(euData);
            break;
        case "North America":
            console.log(naData);
            break;
        case "Oceania":
            console.log(ocData);
            break;
        case "South America":
            console.log(saData);
            break;
        default:
            break;
    }*/
}

export async function getData() {
    const selectedDeathCause = sessionStorage.getItem("selectedDeathCause");
    const selectedYear = sessionStorage.getItem("selectedYear");
    const selectedGeo = sessionStorage.getItem("selectedGeo");
    //console.log(selectedYear, selectedDeathCause);
    if (selectedDeathCause && selectedYear) {
        if (!allData) await loadData();
        let filteredData;
        switch (selectedGeo) {
            case "World":
                filteredData = filterData(worldData, selectedDeathCause, selectedYear);
                break;
            case "Africa":
                filteredData = filterData(afData, selectedDeathCause, selectedYear);
                break;
            case "Asia":
                filteredData = filterData(asData, selectedDeathCause, selectedYear);
                break;
            case "Europe":
                filteredData = filterData(euData, selectedDeathCause, selectedYear);
                break;
            case "North America":
                filteredData = filterData(naData, selectedDeathCause, selectedYear);
                break;
            case "Oceania":
                filteredData = filterData(ocData, selectedDeathCause, selectedYear);
                break;
            case "South America":
                filteredData = filterData(saData, selectedDeathCause, selectedYear);
                break;
            default:
                break;
        }
        console.log(filteredData);
        //console.log("Death Cause and Year are set!");
    }
}

async function selectContinentData(continent) {
    const path = `./data/countries/${continent}/${continent}-topojson.json`;
    const geojson = await d3.json(path);
    
    let codeData = geojson.objects[continent].geometries;
    let countryCode = codeData.map(feature => feature.properties.country_a3);
    
    // Your replacement mappings
    const replacements = {
        "USG": "CUB",
        "ESB": "CYP",
        "PSX": "PSE",
        "SDS": "SSD"
    };
    countryCode = countryCode.map(code => replacements[code] || code);
    
    return allData.filter(d => countryCode.includes(d.Code));
}

function sumByYear_all(data) {
    const groupedByYear = data.reduce((acc, row) => {
        const year = row["Year"];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(row);
        return acc;
    }, {});
    //console.log(groupedByYear);

    Object.keys(groupedByYear).map(year => {
        const yearGroup = groupedByYear[year];
        const summaryRow = { "Country/Territory": "World", "Code": "WD", "Year": year };

        yearGroup[0] && Object.keys(yearGroup[0]).forEach(attr => {
            if (!["Year", "Country/Territory", "Code"].includes(attr)) {
                summaryRow[attr] = yearGroup.reduce((sum, row) => sum + parseFloat(row[attr]) || 0, 0).toString();
            }
        });

        data.push(summaryRow);
    });
}

function sumByYear_continents(data, continent, code) {
    const groupedByYear = data.reduce((acc, row) => {
        const year = row["Year"];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(row);
        return acc;
    }, {});
    //console.log(groupedByYear);

    Object.keys(groupedByYear).map(year => {
        const yearGroup = groupedByYear[year];
        const summaryRow = { "Country/Territory": continent, "Code": code, "Year": year };

        yearGroup[0] && Object.keys(yearGroup[0]).forEach(attr => {
            if (!["Year", "Country/Territory", "Code"].includes(attr)) {
                summaryRow[attr] = yearGroup.reduce((sum, row) => sum + parseFloat(row[attr]) || 0, 0).toString();
            }
        });

        data.push(summaryRow);
        allData.push(summaryRow);
    });
}

async function getWorldAndContinentsData() {
    const code = ["WD", "AF", "AS", "EU", "NA", "OC", "SA"];
    return allData.filter(d => code.includes(d.Code));
}

const attr_AllCauses = [0, 1, 2, 3, 4, 5, 6, 7 ,8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
const attr_Diseases = [0, 1, 2, 3, 4, 5, 7, 10, 13, 14, 15, 16, 20, 22, 24, 25, 29, 30, 31, 33];
const attr_SUD = [0, 1, 2, 12, 17, 26];
const attr_InjuryAccident = [0, 1, 2, 8, 19, 21, 28, 32];
const attr_InjuryViolence = [0, 1, 2, 9, 18, 23];
const attr_Malnutrition = [0, 1, 2, 6, 27];

function filterData(data, selectedDeathCause, selectedYear) {    
    let header = Object.keys(allData[0]);
    switch(selectedDeathCause) {
        case "All Causes":
            header = header.filter((_, i) => attr_AllCauses.includes(i));
            break;
        case "Diseases":
            header = header.filter((_, i) => attr_Diseases.includes(i));
            break;
        case "SUD":
            header = header.filter((_, i) => attr_SUD.includes(i));
            break;
        case "Injuries(Accident)":
            header = header.filter((_, i) => attr_InjuryAccident.includes(i));
            break;
        case "Injuries(Violence)":
            header = header.filter((_, i) => attr_InjuryViolence.includes(i));
            break;
        case "Malnutrition":
            header = header.filter((_, i) => attr_Malnutrition.includes(i));
            break;
        default:
            break;
    }
    //console.log(header);
    
    const transformedData = data.map(row => {
        let newRow = {};
        header.forEach((column) => {
            newRow[column] = row[column];
        });
        return newRow;
    });

    //console.log(transformedData);

    const filteredData = transformedData.filter(d=> d.Year === selectedYear);
    return filteredData;
}


document.addEventListener("DOMContentLoaded", function() {
    getData();
});