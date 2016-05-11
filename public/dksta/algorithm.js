function pathFinder(startNode,endNode,sourceGraph) {
	if (startNode == endNode) {
		return [startNode];	
	}
	var graph1 = sourceGraph.copy(new Graph([],[]));
	console.log(graph1);
	function distanceFrom(node, graph) {
		var S = []; //the set of all visited nodes
		var vS = sourceGraph.nodes; //the set of all unvisited nodes
		function initialize_single_source(graph,node) { //initializes graph, starting point, and all other nodes
			for (var v in graph.nodes) {
				if (v instanceof Node) {
					v.distance = Infinity;
					v.pi = null;
				}
			}
			node.distance = 0;
		}
		function relax(node1,node2,w) { //relaxes node
			if (node2.distance > node1.distance + w) {
				node2.distance = node1.distance + w;
				node2.pi = node1;	
			}
		}
		function Adjacent(node) { //returns an array of adjacent nodes and lines
			if (!(node instanceof Node)) { //don't want any oops
				return null;
			}
			var AdjacentNodes = [];
			var AdjacentLengths = [];
			for (var i=0;i<node.edges.length;i++) {
				var currentEdge = node.edges[i];
				var neighborNode;
				if (currentEdge.c1 != node) {
					neighborNode = currentEdge.c1;
				} else {
					neighborNode = currentEdge.c2;	
				}
				if (!neighborNode.visited) {
					AdjacentLengths.push(currentEdge.v);
					AdjacentNodes.push(neighborNode);	
				}
			}
			return [AdjacentNodes,AdjacentLengths]; //return nodes and lengths grouped into an array
		}
		initialize_single_source(graph,node);
		while (vS.length != 0) { //while there are still nodes to be sorted through
			vS = vS.sort(function(a,b) { return a.distance-b.distance; }); //sort them by distance
			var u = vS.shift(); //take the node with the least distance
			S.push(u); //add this node to the visited set
			u.visited = true; //set the internal flag to true
			if (u == endNode) {
				break;	
			}
			var a = Adjacent(u); //get the adjacent for this node
			var aN = a[0]; //split the response into two variables
			var aL = a[1];
			for (var v=0;v<aN.length;v++) {
				relax(u, aN[v], aL[v]); //relax each connected node
			}
		}
		if (Settings.showPath) console.log(S);
		return S;
	}
	var path1 = distanceFrom(startNode,graph1);
	/*
		This loop modifies the Nodes such that their Pi (predescessor) represents the node that a path would travel through to
		the given node. Now, to find the optimal path, backtrack through the S sorted array to the end node, and find the Pi's 
		of each node.
	*/
	var chNode = null; //current node
	for (var i=0;i<path1.length;i++) {
		if (path1[i] == endNode) { //find the end node
			chNode = path1[i];	
		}
	}
	var path = [chNode]; //the path includes the start and end nodes
	var finished = false; //random flag
	while (!finished) { //backtrack through the Pi's
		path.push(chNode.pi);
		if (chNode.pi == startNode) { //the algorithm is finished, this is the start node
			finished = true;
			path = path.reverse(); //reverse the path so that it progresses from the start -> finish, rather than finish -> start
			break;	
		} else {
			chNode = chNode.pi;	//if this node is not the start node, get the next Pi
		}
	}
	return path; //return the final path
}