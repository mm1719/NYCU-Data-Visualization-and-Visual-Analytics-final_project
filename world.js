import { findEnglishNameByCode } from "./tooltip.js";

sessionStorage.setItem("selectedGeo", "World");

const svg = d3.select("svg");
const projection = d3.geoMiller();
const pathGenerator = d3.geoPath().projection(projection);

const tooltip = d3.select("#tooltip");

d3.json("./data/continents/continents-topojson.json").then(function(geojson) {

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
        .attr("fill", "#808080")
        .on("mouseover", function(event, d) {
            tooltip.transition()
                    .duration(100)
                    .style("opacity", 1);
                    tooltip.text(findEnglishNameByCode(d.properties.continent_code));
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY) + "px")
                   .style("left", (event.pageX + 20) + "px");
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(100)
                .style("opacity", 0);
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
    console.error(error);
});

/*
if (sessionStorage.getItem("selectedDeathCause") && parseInt(sessionStorage.getItem("selectedYear"))) {
    console.log(sessionStorage.getItem("selectedDeathCause"));
    console.log(parseInt(sessionStorage.getItem("selectedYear")));
}*/