import { findEnglishNameByCode } from "./tooltip.js";
import { present_info_by_country_code } from "./data_present.js";
import { getData } from "./deathData.js";

sessionStorage.setItem("selectedGeo", "Asia");

const svg = d3.select("svg");
const projection = d3.geoMiller();
const pathGenerator = d3.geoPath().projection(projection);

const tooltip = d3.select("#tooltip");
let continent_data;
let country_data = [];
let color_scale


getData().then(function(data) {
    continent_data = data;
    data_preprocess(continent_data);
    color_scale = d3.scaleThreshold()
            .domain([d3.min(country_data, function(d) { return d["Total death"]; }), d3.max(country_data, function(d) { return d["Total death"]; })])
            .range(d3.schemeBlues[4]);
    d3.json("./data/countries/AS/AS-topojson.json").then(function(geojson) {
        const countries = topojson.feature(geojson, geojson.objects.AS);
        // console.log(countries);
        svg.selectAll("path").data(countries.features)
            .enter().append("path")
            .attr("class", "countries")
            .attr("d", pathGenerator)
            .attr("fill", d => fill_path_color(d.properties.country_a3))
            .on("mouseover", function(event, d) {
                tooltip.transition()
                        .duration(100)
                        .style("opacity", 1);
                tooltip.text(findEnglishNameByCode(d.properties.country_a2));
                present_info_by_country_code(d.properties.country_a3);
    
            })
            .on("mousemove", function(event) {
                tooltip.style("top", (event.pageY) + "px")
                       .style("left", (event.pageX + 20) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(100)
                    .style("opacity", 0);
            });
    
    }).catch(function(error) {
        console.error(error);
    });
});


document.getElementById("backButton").addEventListener("click", function() {
    window.history.back();
});

function data_preprocess(data) {
    let keys = Object.keys(data[0])
    console.log(keys);
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(keys[j] !== "Year" && keys[j] !== "Code" && keys[j] !== "Country/Territory") {
                data[i][keys[j]] = +data[i][keys[j]];
            }
        }
    }
    console.log(data);
    for(let i = 0; i < data.length - 1; i++) {
        let death = 0;
        for(let j = 0; j < keys.length; j++) {
            if(keys[j] !== "Year" && keys[j] !== "Code" && keys[j] !== "Country/Territory") {
                death += data[i][keys[j]];
            }
        }
        country_data.push({"Code": data[i]["Code"], "Total death": death});
    }
    console.log(country_data);
}

function fill_path_color(country_code) {
    console.log(country_code);
    // find the index of the country in the country_data
    let index = country_data.findIndex(function(d) {
        return d["Code"] === country_code;
    });
    if(index === -1) {
        return "RGB(0,0,0)";
    }
    return color_scale(country_data[index]['Total death']);
    
}