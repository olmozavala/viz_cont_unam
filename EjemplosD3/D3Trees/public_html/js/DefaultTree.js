/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var m = [20, 120, 20, 120];
var w = $(window).width()-20;
var h = $(window).height()-20;
var topMargin = Math.min(20,h/10);
var i = 0, root;
var maxDepth = 4;

var tree = d3.layout.tree()
    .size([w, h]);

var diagonal = d3.svg.diagonal();

var svgNode = d3.select("div").append("svg")
		.attr("class","mytree")
		.attr("width", w)
		.attr("height", h)
		.append("g")
		.attr("transform", "translate(" + 0 + "," + topMargin + ")");


// Toggle children.
function toggle(d){
	if(d.depth >= 1){
		d.parent.children.forEach(function(d){
			if (d.children) {
				d._children = d.children;
				d.children = null;
			}
		});
	}
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		//This is a leaf
		if(d.children === undefined){
			dispTooltip(d);
		}else{
			d.children = d._children;
			d._children = null;
		}
	}
}

function dispTooltip(d){
	d3.select("#tooltip")
			.text(toolTipText)
			.style("display","block")
			.style("opacity",1)
			.style("left", (d3.event.pageX + 20) + "px")
			.style("top", (d3.event.pageY - 10) + "px");
	var toolTipText = addTextTooltip(d);
}

function addTextTooltip(obj){
	var tooltip = d3.select("#tooltip");

	tooltip.append("h3").append("a")
			.attr("href",obj.link)
			.attr("target","_blank")
			.text(obj.name);

	var t = tooltip.append("table");
	var props = d3.entries(obj.props);
	t.append("tbody").selectAll("tr")
			.data(props)
			.enter()
			.append("tr")
			.each(function(d,i){
				console.log(d);
				d3.select(this).append("td").append("b").text(d.key);
				if(d.value.substring(0,4) === "http"){
					d3.select(this).append("td").append("a")
						.attr("href",d.value)
						.attr("target","_blank")
						.text(d.value);
				}else{
					d3.select(this).append("td").text(d.value);
				}
			});
}

function toggleAll(d) {
	if (d.children) {
		d.children.forEach(toggleAll);
		toggle(d);
	}
}

//Creates the tree from json file
d3.json("MedicalImaging.json", function (json) {
	root = json;
	root.x0 = 0;
	root.y0 = h;
	
	
	// Initialize the display to show a few nodes.
	root.children.forEach(toggleAll);
	
	update(root);
});

function update(source) {
	var duration = d3.event && d3.event.altKey ? 1000 : 100;
	
	// Compute the new tree layout.
	var nodes = tree.nodes(root).reverse();
	
	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * (h/(2*maxDepth)); });
	
	// Update the nodes…
	var node = svgNode.selectAll("g.node")
			.data(nodes, function(d) { return d.id || (d.id = ++i); });
	
	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
			.attr("class", "node")
	//Moves text to the right position
			.attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
			.on("click", function(d) { toggle(d); update(d); });
	
	nodeEnter.append("circle")
			.attr("r", 1e-6)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
	
	nodeEnter.append("svg:text")
			.attr("x", function(d) { return d.depth === 0 ? -20 : -15; })// X Position of text
			.attr("dy", function(d) { return d.depth === 0 ? "0em": "0em"; }) // Y position of text
			.attr("text-anchor", function(d) { return "end"; })
			.text(function(d) { return d.name; })
			.style("fill-opacity", 1e-6);
	
	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
	// Draws the circle for each node
	nodeUpdate.select("circle")
			.attr("r", 10.5)
			.style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
	
	nodeUpdate.select("text")
			.style("fill-opacity", 1);
	
	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
			.remove();
	
	nodeExit.select("circle")
			.attr("r", 1e-6);
	
	nodeExit.select("text")
			.style("fill-opacity", 1e-6);
	
	// Update the links…
	var link = svgNode.selectAll("path.link")
			.data(tree.links(nodes), function(d) { return d.target.id; });
	
	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", function(d) {
				var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
	});
	
	// Transition links to their new position.
	link.transition()
			.duration(duration)
			.attr("d", diagonal);
	
	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
			.duration(duration)
			.attr("d", function(d) {
				var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
	})
			.remove();
	
	// Stash the old positions for transition.
	nodes.forEach(function(d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}
