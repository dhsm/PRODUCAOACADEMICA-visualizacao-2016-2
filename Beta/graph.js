function draw_connection_graph(name,data) {
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
    var zoom = d3.behavior.zoom().scaleExtent([0.1, 5]).on("zoom", zoomed);

    var width = $("#vis2").width()
    var height = $("#vis2").height()

    var svg = d3.select("#vis2").select("svg").attr("width", width).attr("height", height)

    console.log(svg)

    var color = ["#80cbc4", "#000000",  "#00695c", "#f57f17"]

    var force = d3.layout.force()
        .gravity(2)
        .distance(50)
        .charge(-1000)
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

//    d3.json("producao_academica_CCEC.json", function(data) {

        console.log(data);





        var newDesiredNode = {
    			name: name,
    			group: 1,
    			customId: -1
    		}
        graph.nodes.push(newDesiredNode)
        var k = 1;
        for (var i = 0; i < data.length; i++) {
          console.log(data[i])
          var cor = -1
          if (data[i][1] == "Discente") {
              cor = 0;
          } else if (data[i][1] == "Docente") {
              cor = 1;
          } else if (data[i][1] == "Participante Externo") {
              cor = 2;
          } else {
              cor = 3;
          }

          var newObjectNode = {
              name: data[i][0],
              group: cor,
              customId: data[i][2]
          }

          var newObjectLink = {

              source: 0,
              target: k,
              value: data[i][3]
          }

          graph.links.push(newObjectLink);
          graph.nodes.push(newObjectNode);
          k = k + 1;
        }


		var personIndex = 200
		//filling nodes
		var desiredNode = {
			name: people[personIndex],
			group: peopleType[personIndex],
			customId: personIndex
		}
		//graph.nodes.push(desiredNode)


        var personIndex = 4
            //filling nodes
        var desiredNode = {
            name: people[personIndex],
            group: peopleType[personIndex],
            customId: personIndex
        }
        //graph.nodes.push(desiredNode)


        var length = graph.nodes.length;
        //Go though all the other nodes and check connection



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
            .attr("stroke-width", function(d) {
                return Math.sqrt(d.value/2);
            })
            .attr("stroke", "grey");

        var node = container.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", function(d) {
                return color[d.group];
            })
            .call(force.drag)
            .attr("data-position", "top")
            .attr("data-delay", "50")
            .attr("data-tooltip", function(d) {
                return d.name
            })
            .attr("class", "tooltipped");

        force.on("tick", function() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });

        $('.tooltipped').tooltip({
            delay: 50
        });
  //  });

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
