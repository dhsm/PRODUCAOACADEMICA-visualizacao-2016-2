function zeros(dimensions) {
	var array = [];

	for (var i = 0; i < dimensions[0]; ++i) {
		array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
	}

	return array;
}


var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory20);

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody())
.force("center", d3.forceCenter(width / 2, height / 2));


var allData;

var i = 0;

var people = []
var peopleType = []

var matrix;

var graph = {

	nodes: [],
	links: []
}

d3.json("producao_academica_CCEC_2015.json", function(data) {

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
				}
			}
		}
	}


	

	//filling nodes

	for (var i = 0; i < people.length; i++) {
		
		var newObject = {
			id: people[i],
			group: peopleType[i]
		}
		
		graph.nodes.push(newObject)
	}


	for (var i = 0; i < people.length; i++) {
		
		for(var j = i ; j < people.length; j++){

			if(matrix[i][j]>0){

				var newObject = {

					source: people[i],
					target: people[j],
					value: matrix[i][j]
				}

				graph.links.push(newObject)
			}		
		}
	}

	//console.log(people);

	var link = svg.append("g")
	.attr("class", "links")
	.selectAll("line")
	.data(graph.links)
	.enter().append("line")
	.attr("stroke-width", function(d) { return Math.sqrt(d.value); })
	.attr("stroke", "grey");

	var node = svg.append("g")
	.attr("class", "nodes")
	.selectAll("circle")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("r", 5)
	.attr("fill", function(d) { return color(d.group); })
	.call(d3.drag()
		.on("start", dragstarted)
		.on("drag", dragged)
		.on("end", dragended));

	node.append("title")
	.text(function(d) { return d.id; });

	simulation
	.nodes(graph.nodes)
	.on("tick", ticked);

	simulation.force("link")
	.links(graph.links);

	function ticked() {
		link
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

		node
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
	}


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




