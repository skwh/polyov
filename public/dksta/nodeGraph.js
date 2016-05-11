// Node Graph Classes and Methods Copyright SomekidwithHTML 2012.
var Node = function(name) { 
	this.n = name; 
	this.distance = Infinity, 
	this.visited = false, 
	this.edges = [], 
	this.pi = null; 
}
Node.prototype.setAsEdge = function(edge) { 
	this.edges.push(edge); 
}
var gNode = function(node,x,y,radius) { 
	this.node = node, 
	this.x = x, 
	this.y = y, 
	this.radius = radius; 
} 
var Edge = function(connect1, connect2, value) { 
	this.c1 = connect1; 
	this.c2 = connect2; 
	this.v = value; 
	connect1.setAsEdge(this); 
	connect2.setAsEdge(this); 
}
var gEdge = function(edge,x1,y1,x2,y2,midpoint) { 
	this.edge = edge, 
	this.endPoints = [[x1,y1],[x2,y2]], 
	this.m = midpoint;
}
var Graph = function(nodes,edges) { 
	this.nodes = nodes; 
	this.edges = edges; 
}
Graph.prototype.findEdge = function(node1,node2) {
	if (!(node1 instanceof Node) || !(node2 instanceof Node)) {
		return null;	
	}
	var edge = null;
	for (var i=0;i<node1.edges.length;i++) {
		var Edge = node1.edges[i];
		var neighborNode;
		if (Edge.c1 != node1) {
			neighborNode = Edge.c1;	
		} else {
			neighborNode = Edge.c2;
		}
		if (neighborNode == node2) {
			edge = Edge;	
		}
	}
	if (edge == null) {
		edge = "Not Connected";	
	}
	return edge;
}
Graph.prototype.loadSet = function(gS) {
	if (!(gS instanceof graphSet)) {
		return;
	}
	this.nodes = gS.nodes;
	this.edges = gS.edges;	
}
Graph.prototype.copy = function(newGraph) {
	if (!(newGraph instanceof Graph)) {
		return;	
	}
	newGraph.nodes = this.nodes;
	newGraph.edges = this.edges;
	return newGraph;	
}
var gGraph = function(graph, canvas, canvasContext) { 
	this.graph = graph; 
	this.canvas = canvas; 
	this.ctxt = canvasContext; 
	this.graphicalNodes = [], 
	this.graphicalEdges = []; 
}
gGraph.prototype.draw = function(c) {
	c.clearRect(0,0,this.canvas.width,this.canvas.height);
	c.strokeStyle = "#000000";
	c.fillStyle = c.strokeStyle;
	var NODE_RADIUS = 7;
	for (var i=0;i<this.graph.nodes.length;i++) {
		var x = Math.floor((Math.random()*(this.canvas.width-14))+14);
		var y = Math.floor((Math.random()*(this.canvas.height-14))+14);
		c.beginPath();
		c.arc(x,y,NODE_RADIUS,0,2*Math.PI);
		c.stroke();
		(this.graph.nodes[i].n > 10)?
			c.fillText(String(this.graph.nodes[i].n),x-NODE_RADIUS,y+3)
		   :c.fillText(String(this.graph.nodes[i].n),x-3,y+3);
		this.graphicalNodes.push(new gNode(this.graph.nodes[i],x,y,NODE_RADIUS));
	}
	for (var i=0;i<this.graph.edges.length;i++) {
		var x1 = this.graphicalNodes[this.graph.nodes.indexOf(this.graph.edges[i].c1)].x + NODE_RADIUS;
		var y1 = this.graphicalNodes[this.graph.nodes.indexOf(this.graph.edges[i].c1)].y + NODE_RADIUS/2;
		var x2 = this.graphicalNodes[this.graph.nodes.indexOf(this.graph.edges[i].c2)].x + NODE_RADIUS;
		var y2 = this.graphicalNodes[this.graph.nodes.indexOf(this.graph.edges[i].c2)].y + NODE_RADIUS/2;
		var m = [(x1+x2)/2,(y1+y2)/2];
		c.beginPath();
		c.moveTo(x1,y1);
		c.lineTo(x2,y2);
		c.stroke();
		c.fillText(String(this.graph.edges[i].v),m[0],m[1]);
		this.graphicalEdges.push(new gEdge(this.graph.edges[i],x1,y1,x2,y2,m));
	}
}
gGraph.prototype.drawPath = function(Path,c) {
	var NODE_RADIUS = 7;
	if (this.graphicalNodes == null || this.graphicalEdges == null) {
		alert("Oops! There was a problem with the path.");
		return;
	}
	c.strokeStyle = "#34CAF7";
	c.fillStyle = c.strokeStyle;
	for (var i=0;i<Path.length;i++) { 
		for (var j=0;j<this.graphicalNodes.length;j++) { //colorize nodes
			if (Path[i] == this.graphicalNodes[j].node) {
				var Node = this.graphicalNodes[j];
				c.beginPath();
				c.arc(Node.x,Node.y,NODE_RADIUS,0,2*Math.PI);
				c.stroke();
				(Node.node.n > 10)?
					c.fillText(String(Node.node.n),Node.x-NODE_RADIUS,Node.y+3)
				   :c.fillText(String(Node.node.n),Node.x-3,Node.y+3);
			}
		}
	}
	Path = Path.reverse();
	for (var i=0;i<Path.length-1;i++) { //colorize edges
		var edge = this.graph.findEdge(Path[i],Path[i].pi);
		for (var j=0;j<this.graphicalEdges.length;j++) {
			if (edge == this.graphicalEdges[j].edge) {
				var Edge = this.graphicalEdges[j];
				c.beginPath();
				c.moveTo(Edge.endPoints[0][0],Edge.endPoints[0][1]);
				c.lineTo(Edge.endPoints[1][0],Edge.endPoints[1][1]);
				c.stroke();	
			}
		}
	}
}
var graphSet = function(nodes, edges) {
	this.nodes = nodes;
	this.edges = edges; 
}
var Settings = new Object();
Settings.showPath = false;