d3.select(".year_bar").attr("value",1990)
for(var i = 0 ; i < 30 ; i++){
	d3.select(".year_bar").append("rect")
	  .attr('y', 20)
	  .attr('x', i*26+2)
	  .attr('value', 1990+i)
	  .attr('select', false)
	  .attr('height', 26)
	  .attr('width', 26)
	  .attr('stroke', "black")
	  .attr("stroke-width", "3")
	  .attr("fill", "#EB455F")
	  .attr("fill-opacity", "0.0")
	  .on("mouseover",function(d){ 

		block_x = +d3.select(this).attr("x")
		block_y = +d3.select(this).attr("y")-3
		d3.select(".year_bar").append("text")
		.attr('x', block_x) //取[x]
		.attr('y', block_y) //取[Y]
		.text(d3.select(this).attr('value'))
		  .style('font-size', '0.75rem')
		.classed("MouseoverText",true);

		if(d3.select(this).attr("select") == "false"){
		  d3.select(this)
		  .attr("fill-opacity", "0.5")
		  .transition().duration(0).style('cursor', 'pointer')
		
		   /*if want mouse over to update the chart, Unblock me
		  // return value
		  return_year = d3.select(this).attr('value')
		  d3.select(".year_bar").attr("value",return_year)
		  getValue()
		  */
		}
		})

	  .on("mouseleave",function(d){ 

		d3.select(".year_bar").select(".MouseoverText").remove()

		
		if(d3.select(this).attr("select") == "false"){
		  d3.select(this)
		  .attr("fill-opacity", "0.0")
		}
		})

	  .on("click",function(d){

		d3.selectAll(".ClickText").remove()
		block_x = +d3.select(this).attr("x")
		block_y = +d3.select(this).attr("y")-3
		d3.select(".year_bar").append("text")
		.attr('x', block_x) //取[x]
		.attr('y', block_y) //取[Y]
		.text(d3.select(this).attr('value'))
		  .style('font-size', '0.75rem')
		.classed("ClickText",true);

		d3.select(".year_bar").selectAll('rect')
		.attr('select', false)
		.attr("fill-opacity", "0.0")

		

		d3.select(this)
		.attr("fill-opacity", "1.0")
		.attr('select', true)
		.transition().duration(0).style('cursor', 'pointer')
		
		
		// return value
		return_year = d3.select(this).attr('value')
		d3.select(".year_bar").attr("value",return_year)
		getValue()
	  });
}

var data_path = "https://raw.githubusercontent.com/eason758/cause_of_deaths/main/cause_of_deaths.csv";
getValue();

function getValue(){
	var d = document.getElementById("death_list").value;
	var y = d3.select(".year_bar").attr("value");
	console.log(d, y);
	document.getElementById("legend").innerHTML = "";
	document.getElementById("choropleth_map").innerHTML = "";
	document.getElementById("country_code").innerHTML = "";
	document.getElementById("line_chart").innerHTML = "";
	document.getElementById("pie_chart").innerHTML = "";
	drawDeathMap(d, y);
}

function drawDeathMap(death, year){
	d3.csv(data_path, function(data){
		var death_arr = [];
		for(var k of Object.keys(data[0]).slice(3)){
			death_arr.push(k);
		}

		// get target data
		var dataset = [];
		for(var i=0; i<data.length; i++){
			if(data[i]["Year"] != year){
			  continue;
			}
			death_sum = 0;
			for(var k of death_arr){
				death_sum += parseInt(data[i][k]);
			}
			dataset.push({'code': data[i]["Code"], 'ratio': parseInt(data[i][death])/death_sum});
		}

		// The svg
		var svg = d3.select("#choropleth_map"),
		  width = +svg.attr("width"),
		  height = +svg.attr("height");

		// Map and projection
		var path = d3.geoPath();
		var projection = d3.geoMercator()
		  .scale(120)
		  .center([0,20])
		  .translate([width / 2, height / 2]);

		// Data and color scale
		var data = d3.map();
		dataset.map(function(v){data.set(v.code, +v.ratio)});

		var lowest = dataset.reduce((previous, current) => {
			return current.ratio < previous.ratio ? current : previous;
		});
		var highest = dataset.reduce((previous, current) => {
			return current.ratio > previous.ratio ? current : previous;
		});
		var set_num = 6;
		var diff = (highest.ratio - lowest.ratio) / set_num;
		var domain_arr = []
		for(var i=1; i<set_num; i++){
			domain_arr.push(lowest.ratio + i*diff);
		}
		var colorScale = d3.scaleThreshold()
		  .domain(domain_arr)
		  .range(d3.schemeBlues[set_num]);

		// draw legend
		var horizontalLegend = d3.svg.legend()
		  .units("Rate (%)")
		  .cellWidth(80)
		  .cellHeight(20)
		  .inputScale(colorScale)
		  .cellStepping(100);
  		d3.select("#legend")
  		  .append("g")
  		  .attr("transform", "translate(10,30)")
  		  .attr("class", "legend")
  		  .call(horizontalLegend);

		// Load external data and boot
		d3.queue()
		  .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
		  .await(ready);
		function ready(error, topo) {
			let mouseOver = function(d) {
				d3.selectAll(".Country")
				  .transition()
				  .duration(200)
				  .style("opacity", .5)
				  .style("stroke", "#696969")
				d3.select(this)
				  .transition()
				  .duration(200)
				  .style("opacity", 1)
				  .style("stroke", "black")
			}

			let mouseLeave = function(d) {
				d3.selectAll(".Country")
				  .transition()
				  .duration(200)
				  .style("opacity", .8)
				  .style("stroke", "#696969")
				d3.select(this)
				  .transition()
				  .duration(200)
				  .style("stroke", "#696969")
			}

			let mouseClick = function(d) {
				console.log(d.id, typeof d.id);
				document.getElementById("country_code").innerHTML = "Country Code: " + d.id;
				document.getElementById("line_chart").innerHTML = "";
				document.getElementById("pie_chart").innerHTML = "";
				drawLineChart(d.id);
				darwPieChart(d.id);
			}

			// Draw the map
			svg.append("g")
			  .selectAll("path")
			  .data(topo.features)
			  .enter()
			  .append("path")
			  // draw each country
			  .attr("d", d3.geoPath()
			    .projection(projection)
			  )
			  // set the color of each country
			  .attr("fill", function (d) {
			    d.total = data.get(d.id) || 0;
			    return colorScale(d.total);
			  })
			  .style("stroke", "#696969")
			  .attr("class", function(d){ return "Country" } )
			  .style("opacity", .8)
			  .on("mouseover", mouseOver )
			  .on("mouseleave", mouseLeave )
			  .on("click", mouseClick);
		}
	})
}

function drawLineChart(country){
	var death = document.getElementById("death_list").value;
	// set the dimensions and margins of the graph
	var margin = {top: 10, right: 80, bottom: 30, left: 60};
	var svg = d3.select("#line_chart"),
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#line_chart")
			    .append("g")
			      .attr("transform", 
			      	    "translate(" + margin.left + "," + margin.top + ")");

	//Read the data
	d3.csv(data_path, function(data){
		var death_arr = [];
		for(var k of Object.keys(data[0]).slice(3)){
			death_arr.push(k);
		}

		// get target data
		var dataset = [];
		for(var i=0; i<data.length; i++){
			if(data[i]["Code"] != country){
				continue;
			}
			var death_sum = 0;
			for(var k of death_arr){
				death_sum += parseInt(data[i][k]);
			}
			// dataset.push({'date': data[i]["Year"], 'value': parseInt(data[i][death])/death_sum});
			dataset.push({'date':  d3.timeParse("%Y")(data[i]["Year"]), 'value': parseInt(data[i][death])/death_sum});
		}
		dataset.sort(function(b, a) {
	    	return -(a.date - b.date);
	    });
		// console.log(dataset)
		// Add X axis --> it is a date format
		var x = d3.scaleTime()
		  .domain(d3.extent(dataset, function(d) { return d.date; }))
		  .range([ 0, width ]);
		svg.append("g")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(x));
		// Add Y axis
		var y = d3.scaleLinear()
		  // .domain( [0, d3.max(dataset, function(d) { return d.value; })] )
		  .domain(d3.extent(dataset, function(d) { return d.value; }))
		  .range([ height, 0 ]);
		svg.append("g")
		  .call(d3.axisLeft(y));
		// Add the line
		svg.append("path")
		  .datum(dataset)
		  .attr("fill", "none")
		  .attr("stroke", "#69b3a2")
		  .attr("stroke-width", 1.5)
		  .attr("d", d3.line()
		    .x(function(d) { return x(d.date) })
		    .y(function(d) { return y(d.value) })
		    )
		// Add the points
		svg
		  .append("g")
		  .selectAll("dot")
		  .data(dataset)
		  .enter()
		  .append("circle")
		    .attr("cx", function(d) { return x(d.date) } )
		    .attr("cy", function(d) { return y(d.value) } )
		    .attr("r", 5)
		    .attr("fill", "#69b3a2")
	})
}

function darwPieChart(country){
	var year = "1992";

	// set the dimensions and margins of the graph
	var svg = d3.select("#pie_chart"),
		width = +svg.attr("width"),
		height = +svg.attr("height");
	var margin = 60

	// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
	var radius = Math.min(width, height) / 2 - margin
	
	// append the svg object to the div called 'my_dataviz'
	svg = d3.select("#pie_chart")
	  		.append("g")
	    	  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	d3.csv(data_path, function(data){
		var death_arr = [];
		for(var k of Object.keys(data[0]).slice(3)){
			death_arr.push(k);
		}

		// get target data
		var dataset = {};
		var top_num = 5;
		for(var i=0; i<data.length; i++){
			if(data[i]["Year"] != year || data[i]["Code"] != country){
				continue;
			}
			var death_sum = 0;
			var death_ratio = [];
			for(var k of death_arr){
				death_sum += parseInt(data[i][k]);
				death_ratio.push({'death': k, 'num': parseInt(data[i][k])});
			}
			death_ratio.sort(function(b, a) {
		    	return a.num - b.num;
		    });
		    var tmp = 0;
			for(var j=0; j<top_num; j++){
				dataset[death_ratio[j].death] = death_ratio[j].num/death_sum;
				tmp += dataset[death_ratio[j].death];
			}
			dataset["Others"] = 1-tmp;
		}
		// console.log(dataset)

		// set the color scale
		var color = d3.scaleOrdinal()
		  .domain(Object.keys(dataset))
		  .range(d3.schemeSet3);

		// Compute the position of each group on the pie:
		var pie = d3.pie()
		  .sort(null) // Do not sort group by size
		  .value(function(d) {return d.value; })
		var data_ready = pie(d3.entries(dataset))

		// The arc generator
		var arc = d3.arc()
		  .innerRadius(radius * 0.5)         // This is the size of the donut hole
		  .outerRadius(radius * 0.8)

		// Another arc that won't be drawn. Just for labels positioning
		var outerArc = d3.arc()
		  .innerRadius(radius * 0.9)
		  .outerRadius(radius * 0.9)

		// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
		svg
		  .selectAll('allSlices')
		  .data(data_ready)
		  .enter()
		  .append('path')
		  .attr('d', arc)
		  .attr('fill', function(d){ return(color(d.data.key)) })
		  .attr("stroke", "white")
		  .style("stroke-width", "2px")
		  .style("opacity", 0.7)

		// Add the polylines between chart and labels:
		svg
		  .selectAll('allPolylines')
		  .data(data_ready)
		  .enter()
		  .append('polyline')
		    .attr("stroke", "black")
		    .style("fill", "none")
		    .attr("stroke-width", 1)
		    .attr('points', function(d) {
		      var posA = arc.centroid(d) // line insertion in the slice
		      var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
		      var posC = outerArc.centroid(d); // Label position = almost the same as posB
		      var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
		      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
		      return [posA, posB, posC]
		    })

		// Add the polylines between chart and labels:
		svg
		  .selectAll('allLabels')
		  .data(data_ready)
		  .enter()
		  .append('text')
		    .text( function(d) { return d.data.key+'('+d.data.value.toFixed(2)+')' } )
		    // .text( function(d) { console.log(d.data.value) ; return d.data.key } )
		    .attr('transform', function(d) {
		        var pos = outerArc.centroid(d);
		        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
		        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
		        return 'translate(' + pos + ')';
		    })
		    .style('text-anchor', function(d) {
		        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
		        return (midangle < Math.PI ? 'start' : 'end')
		    })
		    .style('font-size', '0.625rem')
	})
}