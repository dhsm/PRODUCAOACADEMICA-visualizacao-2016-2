function draw_connection_graph() {
	function zeros(dimensions) {
		var array = [];

		for (var i = 0; i < dimensions[0]; ++i) {
			array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
		}

		return array;
	}

	var container;

	function zoomed() {
			container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			d3.event.sourceEvent.stopPropagation();
	}
	//var zoom = d3.behavior.zoom().x(x).y(y).on("zoom", zoomed);
	var zoom = d3.behavior.zoom().scaleExtent([0.1,5]).on("zoom", zoomed);

	var width = $("#vis2").width()
	var height = $("#vis2").height()

	var svg = d3.select("#vis2").select("svg").attr("width", width).attr("height", height)

	console.log(svg)

	var color = d3.scale.category20();

	var force = d3.layout.force()
	    .gravity(0.05)
	    .distance(50)
	    .charge(-300)
	    .size([width, height]);


	var allData;

	var i = 0;

	var people = []
	var peopleType = []

	var matrix;

	var graph = {

		nodes: [],
		links: []
	}

	d3.json("producao_academica_CCEC.json", function(data)  {

		console.log(data);

		for (var i = 0; i < data.length; i++) {
			//Adding all colaborator

			for (var j = 0; j < data[i].authors.length; j++) {
				//Verify if exists otherwise add to array

				if(people.indexOf(data[i].authors[j].name.toLowerCase()) <= -1){

					people.push(data[i].authors[j].name.toLowerCase());

					if(data[i].authors[j].category=="Discente"){
						peopleType.push(0) //Azul escuro
					}else if(data[i].authors[j].category=="Docente"){
						peopleType.push(1) //Azul claro
					}else if(data[i].authors[j].category=="Participante Externo"){
						peopleType.push(2) //Laranja
					}else{
						peopleType.push(3) //rosinha claro
					}
				}
			}

		}

		matrix = zeros([people.length,people.length] )

		for (var i = 0; i < data.length; i++) {

			for (var j = 0; j < data[i].authors.length; j++) {
				
				for(var k = 0; k < data[i].authors.length; k++){

					if(k!=j){

						indexAuthor1 = people.indexOf(data[i].authors[j].name.toLowerCase())
						indexAuthor2 = people.indexOf(data[i].authors[k].name.toLowerCase())

						matrix[indexAuthor1][indexAuthor2] = matrix[indexAuthor1][indexAuthor2]+1
						matrix[indexAuthor2][indexAuthor1] = matrix[indexAuthor2][indexAuthor1]+1
					}
				}
			}
		}

		//filling nodes
		var desiredNode = {
			name: people[4],
			group: peopleType[4]
		}
		graph.nodes.push(desiredNode)

		var k = 1;
		for (var i = 0; i < people.length; i++) {
			

			if(matrix[4][i]>0){

				var newObjectNode = {
					name: people[i],
					group: peopleType[i]
				}
				
				var newObjectLink = {

						source: 0,
						target: k,
						value: matrix[0][i]
				}

				graph.links.push(newObjectLink);
				graph.nodes.push(newObjectNode);
				k = k + 1;
				console.log(k)
			}
		}

		console.log(graph)


		// for (var i = 0; i < people.length; i++) {
			
		// 	for(var j = i ; j < people.length; j++){

		// 		if(matrix[i][j]>0){

		// 			var newObject = {

		// 				source: i,
		// 				target: j,
		// 				value: matrix[i][j]
		// 			}

		// 			graph.links.push(newObject)
		// 		}		
		// 	}
		// }

		var tooltip = d3.select("body")
			.append("div")
			.attr("data-position", "top")
			.attr("data-delay", "50")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden")
			.style("background", "#000")
			.style("color", "white")
			.style("font-size", "12px")
			.text("name");


		force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();

		//   // var link = svg.selectAll(".link")
		//   //     .data(graph.links)
		//   //   .enter().append("line")
		//   //     .attr("class", "link");

		//   // var node = svg.selectAll(".node")
		//   //     .data(json.nodes)
		//   //   .enter().append("g")
		//   //     .attr("class", "node")
		//   //     .call(force.drag);

		container = svg.append("g").call(zoom);

		var link = container.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(graph.links)
		.enter().append("line")
		.attr("stroke-width", function(d) { return Math.sqrt(d.value*2); })
		.attr("stroke", "grey");

		var node = container.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(graph.nodes)
		.enter().append("circle")
		.attr("r", 5)
		.attr("fill", function(d) { return color(d.group); })
		.call(force.drag)
		.on("mouseover", function(d){tooltip.text(d.name); return tooltip.style("visibility", "visible");})
		.on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
		.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
		//.on("click", function(d){
	    //	container.attr("transform", "translate(" + (d.x -100) + "," + (d.y-100) + ")");
	    //});

		force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	  	});

	});

	function dragstarted(d) {
		if (!d3.event.active) simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragended(d) {
		if (!d3.event.active) simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}
}


