let data;
async function getCountryJson() {
    try {
        data = await d3.json("./data/countries/countries.json");
    } catch (error) {
        console.error("Error fetching or processing countries data:", error);
    }
}
getCountryJson();

function findEnglishNameByCode (countryCode){
    const country = data.find(country => country.country_a2 === countryCode);
    
    if (country && country.i18n && country.i18n.en) {
        if (country.country_a2 === "CU" || 
            country.country_a2 === "CY" || 
            country.country_a2 === "PS" ||
            country.country_a2 === "SS") {
        return country.i18n.en;
        } else {
            return country.country_name
        };
        
    } else {
        return null;
    }
}