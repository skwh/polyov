// Example script: 
// adding Nodes to a graph and using the gGraph methods to draw the node map.
var simpleGraph = new Graph([],[]);
var simpleGraphicalGraph;
var graph1 = new graphSet([],[]);
graph1.setUp = function() {
	this.nodes = [];
	this.edges = [];
	for (var i=0;i<6;i++) {
		this.nodes.push(new Node(i+1));	
	}
	this.edges.push(new Edge(this.nodes[0],this.nodes[5],14));
	this.edges.push(new Edge(this.nodes[0],this.nodes[2],9));
	this.edges.push(new Edge(this.nodes[0],this.nodes[1],7));
	this.edges.push(new Edge(this.nodes[1],this.nodes[2],10));
	this.edges.push(new Edge(this.nodes[1],this.nodes[3],15));
	this.edges.push(new Edge(this.nodes[2],this.nodes[5],2));
	this.edges.push(new Edge(this.nodes[2],this.nodes[3],11));
	this.edges.push(new Edge(this.nodes[3],this.nodes[4],15));
	this.edges.push(new Edge(this.nodes[5],this.nodes[4],9));	
}
var graph2 = new graphSet([],[]);
graph2.setUp = function() {
	this.nodes = [];
	this.edges = [];
	for (var i=0;i<6;i++) {
		this.nodes.push(new Node(i+1));	
	}
	this.edges.push(new Edge(this.nodes[0],this.nodes[4],20));
	this.edges.push(new Edge(this.nodes[0],this.nodes[5],13));
	this.edges.push(new Edge(this.nodes[0],this.nodes[1],5));
	this.edges.push(new Edge(this.nodes[1],this.nodes[5],3));
	this.edges.push(new Edge(this.nodes[1],this.nodes[2],2));
	this.edges.push(new Edge(this.nodes[2],this.nodes[3],2));
	this.edges.push(new Edge(this.nodes[3],this.nodes[4],3));
	this.edges.push(new Edge(this.nodes[4],this.nodes[5],5));
}
var graph3 = new graphSet([],[]);
graph3.setUp = function() {
	this.nodes = [];
	this.edges = [];
	for (var i=0;i<16;i++) {
		this.nodes.push(new Node(i+1));
	}
	this.edges.push(new Edge(this.nodes[0],this.nodes[1],5));
	this.edges.push(new Edge(this.nodes[1],this.nodes[2],10));
	this.edges.push(new Edge(this.nodes[1],this.nodes[4],7));
	this.edges.push(new Edge(this.nodes[2],this.nodes[3],5));
	this.edges.push(new Edge(this.nodes[3],this.nodes[4],5));
	this.edges.push(new Edge(this.nodes[4],this.nodes[5],5));
	this.edges.push(new Edge(this.nodes[5],this.nodes[6],3));
	this.edges.push(new Edge(this.nodes[6],this.nodes[7],10));
	this.edges.push(new Edge(this.nodes[6],this.nodes[10],2));
	this.edges.push(new Edge(this.nodes[7],this.nodes[8],4));
	this.edges.push(new Edge(this.nodes[7],this.nodes[15],20));
	this.edges.push(new Edge(this.nodes[8],this.nodes[9],3));
	this.edges.push(new Edge(this.nodes[9],this.nodes[10],6));
	this.edges.push(new Edge(this.nodes[15],this.nodes[14],3));
	this.edges.push(new Edge(this.nodes[14],this.nodes[13],5));
	this.edges.push(new Edge(this.nodes[13],this.nodes[12],7));
	this.edges.push(new Edge(this.nodes[12],this.nodes[11],20));
	this.edges.push(new Edge(this.nodes[11],this.nodes[0],6));
}
function runMe(selectedMap) {
	if (!(selectedMap instanceof graphSet)) {
		selectedMap = eval(document.getElementById('s3').value);
		if (!(selectedMap instanceof graphSet)) {
			alert("Oops! There was an error. " + typeof selectedMap + "," + selectedMap);
			return;	
		}
	}
	selectedMap.setUp();
	simpleGraph = new Graph([],[]);
	simpleGraphicalGraph;
	simpleGraph.loadSet(selectedMap);
	simpleGraphicalGraph = graphToGraphicalGraph(simpleGraph,document.getElementById('theCanvas'));
	simpleGraphicalGraph.draw(simpleGraphicalGraph.ctxt);
}
function pathMe() {
	var sMap = window[document.getElementById('s3').value];
	runMe(sMap);
	var node1 = document.getElementById('s1').value;
	var node2 = document.getElementById('s2').value;
	for (var i=0;i<simpleGraph.nodes.length;i++) {
		if (simpleGraph.nodes[i].n == node1) {
			node1 = simpleGraph.nodes[i];	
		}
		if (simpleGraph.nodes[i].n == node2) {
			node2 = simpleGraph.nodes[i];
		}
	}
	if (!(node1 instanceof Node) || !(node2 instanceof Node)) {
		alert("Oops! There was a problem with pathMe.");
		return;	
	}
	var path = pathFinder(node1,node2,simpleGraph);
	simpleGraphicalGraph.drawPath(path,simpleGraphicalGraph.ctxt);
}
function graphToGraphicalGraph(graph,canvasElement) {
	return new gGraph(graph,canvasElement,canvasElement.getContext('2d'));	
}