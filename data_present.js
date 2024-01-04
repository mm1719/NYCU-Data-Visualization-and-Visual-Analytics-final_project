
import { get_country_data, getData, get_continent_data } from "./deathData.js";
const svg = d3.select("svg");
const tooltip = d3.select("#tooltip");
let continent_data;
let options = document.querySelectorAll('.option');
let yearButtons = document.querySelectorAll('.year');


function update_data() {
    getData().then(function(data) {
        continent_data = data;
        // console.log(continent_data);
    });
}




options.forEach(option => {
    option.addEventListener('click', function() {
        // console.log("change!")    
        update_data(); 
    });
});
yearButtons.forEach(button => {
    button.addEventListener('click', function() {
        // console.log("change!")
        update_data(); // 假設您有一個函數可以根據新的數據繪製地圖
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
            update_data();
            lastPosition = { x: event.clientX, y: event.clientY };
        }
    }
});
 
export function present_info_by_country_code(country_code) {
    
    let country_data; 
    country_data =  get_country_data(country_code)[0];
    //console.log(country_data);
    let presenting_data = [];
    let drawing_data = [];
    let keys = Object.keys(country_data);
    let total_deaths = 0;
    presenting_data.push({label: "Country/Territory", value: country_data["Country/Territory"]});
    presenting_data.push({label: "Total death", value: total_deaths});
    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Country/Territory" && keys[i] !== "Code" && keys[i] !== "Year") {
            presenting_data.push({label: keys[i], value: +country_data[keys[i]]});
            drawing_data.push({label: keys[i], value: +country_data[keys[i]]});
            total_deaths += +country_data[keys[i]];
        }
    }
    presenting_data[1].value = total_deaths + " ";
    for(let i = 2; i < presenting_data.length; i++) {
        presenting_data[i].value = Math.round(presenting_data[i].value / total_deaths * 10000) / 100;
    }

    // console.log(presenting_data);
    const width = 200, height = 200;
    let x = d3.scaleBand()
        .range([0, width])
        .domain(drawing_data.map(function(d) { return d.label; }))
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(drawing_data, function(d) { return d.value; })]);

    let color = d3.scaleSequential()
        .domain([d3.min(drawing_data, function(d){return d.value}), d3.max(drawing_data, function(d) { return d.value; })])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    // console.log(presenting_data);
    let min = 9999, max = -1;
    for(let i = 0; i < presenting_data.length; i++) {
        if(isNaN(presenting_data[i].value)|| presenting_data[i].label === "Total death") continue;
        else{
            if(presenting_data[i].value > max) max = presenting_data[i].value;
            if(presenting_data[i].value < min) min = presenting_data[i].value;
        }
    }
    let text_color = d3.scaleSequential()
        .domain([min, max])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));
        
    svg.selectAll("text").remove();

    svg.selectAll("text")
        .data(presenting_data)
        .enter()
        .append("text")
        .attr("x", 900) // Adjust this value to position your text
        .attr("y", function(d, i) { return 30 + i * 15; }) // Adjust this value to position your text
        .text(function(d) { return d.label + ": " + d.value + `${d.label !== "Country/Territory" ? (d.label !== "Total death" ? "%": " "): " "}`; })
        .attr("font-family", "Times New Roman")
        .attr("font-size", "15px")
        .attr("fill", function(d){return (d.label === "Country/Territory" ? "black" : (d.label === "Total death"? "RGB(200,20,20)": text_color(d.value)))})
        .attr("font-weight", "bold");

    svg.selectAll(".bar").remove();
    

    let chartGroup = svg.append("g")
                        .attr("transform", "translate(1300, 200)");

    
 
     // Add y-axis to the SVG

    svg.selectAll(".axis").remove();
    chartGroup.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

     // Add bars
    let bars = chartGroup.selectAll(".bar")
                    .data(drawing_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.label); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return isNaN(height - y(d.value)) ? 0 : height - y(d.value); })
                    .attr("fill", function(d) { return color(d.value); });

    bars.on("mouseover", function(event, d) {
        tooltip.transition()
                .duration(100)
                .style("opacity", .9);
        tooltip.text(d.label + ": " + d.value);

    })

    bars.on("mousemove", function(event) {
        tooltip.style("top", (event.pageY) + "px")
               .style("left", (event.pageX + 20) + "px");
    })

    bars.on("mouseout", function() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });

}

export function remove_all() {
    svg.selectAll("text").remove();
    svg.selectAll(".bar").remove();
    svg.selectAll(".axis").remove();
    
}

export async function present_continent_data(country_data){
    await update_data();
    // console.log(country_data);
    let presenting_data = [];
    let drawing_data = [];
    let total_deaths = 0;
    for(let i = 0; i < country_data.length - 1; i++) {
        total_deaths += country_data[i]["Total death"];
    }
    for(let i = 0; i < country_data.length - 1; i++) {
        total_deaths += country_data[i]["Total death"];
        
        presenting_data.push({label: find_country_by_code(country_data[i]["Code"]), value: country_data[i]["Total death"] / total_deaths * 100});
        drawing_data.push({label: find_country_by_code(continent_data[i]["Code"]), value: country_data[i]["Total death"]});
    }

    for(let i = 0; i < presenting_data.length; i++) {
        presenting_data[i].value = Math.round(presenting_data[i].value * 100) / 100;
    }

    // console.log(presenting_data);
    // console.log(drawing_data);
    const width = 400, height = 200;
    let x = d3.scaleBand()
        .range([0, width])
        .domain(drawing_data.map(function(d) { return d.label; }))
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(drawing_data, function(d) { return d.value; })]);
    
    let color = d3.scaleSequential()
        .domain([d3.min(drawing_data, function(d){return d.value}), d3.max(drawing_data, function(d) { return d.value; })])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    let min = 9999, max = -1;
    for(let i = 0; i < presenting_data.length; i++) {
        if(isNaN(presenting_data[i].value)|| presenting_data[i].label === "Total death") continue;
        else{
            if(presenting_data[i].value > max) max = presenting_data[i].value;
            if(presenting_data[i].value < min) min = presenting_data[i].value;
        }
    }

    let text_color = d3.scaleSequential()
        .domain([min, max])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    svg.selectAll("text").remove();
    
    svg.selectAll("text")
    .data(presenting_data)
    .enter()
    .append("text")
    .attr("x", function(d, i) { 
        return i < presenting_data.length / 2 ? 900 : 1100; 
    })
    .attr("y", function(d, i) { 
        return 10 + (i < presenting_data.length / 2 ? i : i - presenting_data.length / 2) * 15; 
    })
    .text(function(d) { return d.label + ": " + d.value +  "%" }) 
    .attr("font-family", "Times New Roman")
    .attr("font-size", "15px")
    .attr("fill", function(d) { return text_color(d.value);})
    .attr("font-weight", "bold");

    svg.selectAll(".bar").remove();
    

    let chartGroup = svg.append("g")
                        .attr("transform", "translate(1000, 400)");

    
 
     // Add y-axis to the SVG
    chartGroup.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(y));

     // Add bars
    let bars = chartGroup.selectAll(".bar")
                    .data(drawing_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.label); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return isNaN(height - y(d.value)) ? 0 : height - y(d.value); })
                    .attr("fill", function(d) { return color(d.value); });

    bars.on("mouseover", function(event, d) {
        tooltip.transition()
                .duration(100)
                .style("opacity", .9);
        tooltip.text(d.label + ": " + d.value);

    })

    bars.on("mousemove", function(event) {
        tooltip.style("top", (event.pageY) + "px")
               .style("left", (event.pageX + 20) + "px");
    })

    bars.on("mouseout", function() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });


}

export async function present_world_data(world_data) {
    await update_data();
    // console.log(country_data);
    let presenting_data = [];
    let drawing_data = [];
    let total_deaths = 0;
    for(let i = 0; i < world_data.length - 1; i++) {
        total_deaths += world_data[i]["Total death"];
    }
    for(let i = 0; i < world_data.length - 1; i++) {
        total_deaths += world_data[i]["Total death"];
        
        presenting_data.push({label: find_country_by_code(world_data[i]["Code"]), value: world_data[i]["Total death"] / total_deaths * 100});
        drawing_data.push({label: find_country_by_code(world_data[i]["Code"]), value: world_data[i]["Total death"]});
    }

    for(let i = 0; i < presenting_data.length; i++) {
        presenting_data[i].value = Math.round(presenting_data[i].value * 100) / 100;
    }

    const width = 400, height = 200;
    let x = d3.scaleBand()
        .range([0, width])
        .domain(drawing_data.map(function(d) { return d.label; }))
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(drawing_data, function(d) { return d.value; })]);
    
    let color = d3.scaleSequential()
        .domain([d3.min(drawing_data, function(d){return d.value}), d3.max(drawing_data, function(d) { return d.value; })])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    let min = 9999, max = -1;
    for(let i = 0; i < presenting_data.length; i++) {
        if(isNaN(presenting_data[i].value)|| presenting_data[i].label === "Total death") continue;
        else{
            if(presenting_data[i].value > max) max = presenting_data[i].value;
            if(presenting_data[i].value < min) min = presenting_data[i].value;
        }
    }

    let text_color = d3.scaleSequential()
        .domain([min, max])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    svg.selectAll("text").remove();
    
    svg.selectAll("text")
    .data(presenting_data)
    .enter()
    .append("text")
    .attr("x", function(d, i) { 
        return i < presenting_data.length / 2 ? 900 : 1100; 
    })
    .attr("y", function(d, i) { 
        return 10 + (i < presenting_data.length / 2 ? i : i - presenting_data.length / 2) * 15; 
    })
    .text(function(d) { return d.label + ": " + d.value +  "%" }) 
    .attr("font-family", "Times New Roman")
    .attr("font-size", "15px")
    .attr("fill", function(d) { return text_color(d.value);})
    .attr("font-weight", "bold");

    svg.selectAll(".bar").remove();
    

    let chartGroup = svg.append("g")
                        .attr("transform", "translate(1000, 400)");

    
 
     // Add y-axis to the SVG
    chartGroup.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, 0)")
        .call(d3.axisLeft(y));

     // Add bars
    let bars = chartGroup.selectAll(".bar")
                    .data(drawing_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.label); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return isNaN(height - y(d.value)) ? 0 : height - y(d.value); })
                    .attr("fill", function(d) { return color(d.value); });

    bars.on("mouseover", function(event, d) {
        tooltip.transition()
                .duration(100)
                .style("opacity", .9);
        tooltip.text(d.label + ": " + d.value);

    })

    bars.on("mousemove", function(event) {
        tooltip.style("top", (event.pageY) + "px")
               .style("left", (event.pageX + 20) + "px");
    })

    bars.on("mouseout", function() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });



}

export function present_info_by_continent_code(continent_code) {
    let continent_data = get_continent_data(continent_code)[0];
    // console.log(continent_data);

    let presenting_data = [];
    let drawing_data = [];
    let keys = Object.keys(continent_data);
    let total_deaths = 0;
    presenting_data.push({label: "Country/Territory", value: continent_data["Country/Territory"]});
    presenting_data.push({label: "Total death", value: total_deaths});
    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== "Country/Territory" && keys[i] !== "Code" && keys[i] !== "Year") {
            presenting_data.push({label: keys[i], value: +continent_data[keys[i]]});
            drawing_data.push({label: keys[i], value: +continent_data[keys[i]]});
            total_deaths += +continent_data[keys[i]];
        }
    }
    presenting_data[1].value = total_deaths + " ";
    for(let i = 2; i < presenting_data.length; i++) {
        presenting_data[i].value = Math.round(presenting_data[i].value / total_deaths * 10000) / 100;
    }
    // console.log(presenting_data);
    // console.log(drawing_data);

    const width = 200, height = 200;
    let x = d3.scaleBand()
        .range([0, width])
        .domain(drawing_data.map(function(d) { return d.label; }))
        .padding(0.1);
    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(drawing_data, function(d) { return d.value; })]);

    let color = d3.scaleSequential()
        .domain([d3.min(drawing_data, function(d){return d.value}), d3.max(drawing_data, function(d) { return d.value; })])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));

    // console.log(presenting_data);
    let min = 9999, max = -1;
    for(let i = 0; i < presenting_data.length; i++) {
        if(isNaN(presenting_data[i].value)|| presenting_data[i].label === "Total death") continue;
        else{
            if(presenting_data[i].value > max) max = presenting_data[i].value;
            if(presenting_data[i].value < min) min = presenting_data[i].value;
        }
    }
    let text_color = d3.scaleSequential()
        .domain([min, max])
        .interpolator((t) => d3.interpolateBlues(t * 0.8 + 0.3));
        
    svg.selectAll("text").remove();

    svg.selectAll("text")
        .data(presenting_data)
        .enter()
        .append("text")
        .attr("x", 900) // Adjust this value to position your text
        .attr("y", function(d, i) { return 30 + i * 15; }) // Adjust this value to position your text
        .text(function(d) { return d.label + ": " + d.value + `${d.label !== "Country/Territory" ? (d.label !== "Total death" ? "%": " "): " "}`; })
        .attr("font-family", "Times New Roman")
        .attr("font-size", "15px")
        .attr("fill", function(d){return (d.label === "Country/Territory" ? "black" : (d.label === "Total death"? "RGB(200,20,20)": text_color(d.value)))})
        .attr("font-weight", "bold");

    svg.selectAll(".bar").remove();
    

    let chartGroup = svg.append("g")
                        .attr("transform", "translate(1300, 200)");

    
 
     // Add y-axis to the SVG

    svg.selectAll(".axis").remove();
    chartGroup.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));

     // Add bars
    let bars = chartGroup.selectAll(".bar")
                    .data(drawing_data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.label); })
                    .attr("width", x.bandwidth())
                    .attr("y", function(d) { return y(d.value); })
                    .attr("height", function(d) { return isNaN(height - y(d.value)) ? 0 : height - y(d.value); })
                    .attr("fill", function(d) { return color(d.value); });

    bars.on("mouseover", function(event, d) {
        tooltip.transition()
                .duration(100)
                .style("opacity", .9);
        tooltip.text(d.label + ": " + d.value);

    })

    bars.on("mousemove", function(event) {
        tooltip.style("top", (event.pageY) + "px")
               .style("left", (event.pageX + 20) + "px");
    })

    bars.on("mouseout", function() {
        tooltip.transition()
            .duration(100)
            .style("opacity", 0);
    });

}

function find_country_by_code(country_code) {

    // console.log(country_code);
    // console.log(continent_data);
    let index = continent_data.findIndex(function(d) {
        return d["Code"] === country_code;
    });
    // console.log(index);
    if(index === -1) {
        return "RGB(0,0,0)";
    }
    return continent_data[index]["Country/Territory"];
}