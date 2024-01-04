import { findEnglishNameByCode } from "./tooltip.js";
import { getData } from "./deathData.js";
import { remove_all, present_world_data, present_info_by_continent_code } from "./data_present.js";

sessionStorage.setItem("selectedGeo", "World");

const svg = d3.select("svg");
const projection = d3.geoMiller();
const pathGenerator = d3.geoPath().projection(projection);
let options = document.querySelectorAll('.option');
let yearButtons = document.querySelectorAll('.year');
const tooltip = d3.select("#tooltip");
let color_scale;
let world_data = [];

drawMap();
function drawMap(){
    getData().then(function(data) {
        let input_data = data;
        world_data = data_preprocess(input_data);
        color_scale = d3.scaleSequential()
            .domain([d3.min(world_data, function(d) { return d["Total death"]; }), d3.max(world_data, function(d) { return d["Total death"]; })])
            .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));
        d3.json("./data/continents/continents-topojson.json").then(function(geojson) {
            present_world_data(world_data);
            const continents = topojson.feature(geojson, geojson.objects.continents);

            svg.selectAll("path").data(continents.features)
                .enter().append("path")
                .attr("class", "continent")
                .attr("d", pathGenerator)
                /*.attr("fill", function(d) {
                    // Use the continent_code property to determine the fill color
                    switch (d.properties.continent_code) {
                        case "AF": return "#808080";
                        case "AS": return "#FCB131";
                        case "EU": return "#0081C8";
                        case "NA": return "#EE334E";
                        case "OC": return "#00A651";
                        case "SA": return "#756FFC";
                        default:   return "none"; // No fill or default color
                    }
                })*/
                .attr("fill", d => fill_path_color(d.properties.continent_code))
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                            .duration(100)
                            .style("opacity", 1);
                            tooltip.text(findEnglishNameByCode(d.properties.continent_code));
                    present_info_by_continent_code(d.properties.continent_code);
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", (event.pageY) + "px")
                           .style("left", (event.pageX + 20) + "px");
                })
                .on("mouseout", function() {
                    tooltip.transition()
                        .duration(100)
                        .style("opacity", 0);
                    remove_all();
                    present_world_data(world_data);
                })
                .on("click", (event, d) => {
                    let url;
                    switch (d.properties.continent_code) {
                        case "AF": 
                            url = `AF.html`;
                            break;
                        case "AS":
                            url = `AS.html`;
                            break;
                        case "EU":
                            url = `EU.html`;
                            break;
                        case "NA":
                            url = `NA.html`;
                            break;
                        case "OC":
                            url = `OC.html`;
                            break;
                        case "SA":
                            url = `SA.html`;
                            break;
                        default: return ""; // No fill or default
                    }
                    window.location.href = url;
                });
        
        
        }).catch(function(error) {
            console.error(error + "in json()");
        });
    }).catch(function(error) {
        console.error(error + " in drawMap()");
    });

}


options.forEach(option => {
    option.addEventListener('click', function() {
        console.log("change!")    
        drawMap(); 
    });
});
yearButtons.forEach(button => {
    button.addEventListener('click', function() {
        console.log("change!")
        drawMap(); 
    });
});

const triangle = document.getElementById("draggable-triangle");
let lastPosition = { x: 0, y: 0 };
triangle.addEventListener('mousedown', function(event) {
    console.log('Triangle has been clicked');
    lastPosition = { x: event.clientX, y: event.clientY };
});

triangle.addEventListener('mousemove', function(event) {
    if (event.buttons === 1) { // 檢查滑鼠左鍵是否被按下
        if (event.clientX !== lastPosition.x || event.clientY !== lastPosition.y) {
            console.log('Triangle has moved');
            drawMap();
            lastPosition = { x: event.clientX, y: event.clientY };
        }
    }
});


function data_preprocess(data){
    let process_data = [];
    let keys = Object.keys(data[0]);
    for(let i = 0; i < data.length; i++) {
        for(let j = 0; j < keys.length; j++) {
            if(keys[j] !== "Year" && keys[j] !== "Code" && keys[j] !== "Country/Territory") {
                data[i][keys[j]] = +data[i][keys[j]];
            }
        }
    }
    for(let i = 0; i < data.length; i++) {
        let death = 0;
        if(data[i]["Code"] === "WD") {
            continue;
        }
        for(let j = 0; j < keys.length; j++) {
            if(keys[j] !== "Year" && keys[j] !== "Code" && keys[j] !== "Country/Territory") {
                death += data[i][keys[j]];
            }
        }
        process_data.push({"Code": data[i]["Code"], "Total death": death});
    }
    console.log(process_data);
    return process_data;
}

function fill_path_color(country_code) {
    // console.log(country_code);
    // find the index of the country in the country_data
    let index = world_data.findIndex(function(d) {
        return d["Code"] === country_code;
    });
    if(index === -1) {
        return "RGB(0,0,0)";
    }
    return color_scale(world_data[index]['Total death']);
    
}



/*
if (sessionStorage.getItem("selectedDeathCause") && parseInt(sessionStorage.getItem("selectedYear"))) {
    console.log(sessionStorage.getItem("selectedDeathCause"));
    console.log(parseInt(sessionStorage.getItem("selectedYear")));
}*/