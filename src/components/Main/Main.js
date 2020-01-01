import React, { Component } from 'react'
import PriorityQueue from "../../PriorityQueue/PriorityQueue";
import Node from '../Node/Node';
import PathNode from '../Node/PathNode';
import WallNode from "../Node/WallNode";
import VisitedNode from "../Node/VisitedNode";
import "./Main.css"

const GRID_ROWS = 20;
const GRID_COL = 20;
const CAPACITY = GRID_ROWS * GRID_COL;

const createGrid = () => {

    // initialize 1D grid with length
    var grid = new Array(GRID_ROWS);

    // populate grid with column arrays
    for (var col = 0; col < GRID_COL; col++) {

        grid[col] = new Array(GRID_COL);

    }

    // return the grid
    return grid;

}

export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {

            isStart: true,
            nodeTotal: [],
            adjList: {},
            visNode: [],
            visNum: null,
            ncList: [],
            toPath: [],
            pathLength: [],
            wallNodes: [],
            isWall: false,
            time: null,
            sideBar: true,

        }
    }

    gridComponent() {
        
        let componentGrid = createGrid();
        let graphGrid = createGrid();

        let k = 0
        for (let i = 0; i < componentGrid.length; i++) {
            for (let j = 0; j < componentGrid[i].length; j++) {
                let e = <Node testid={k} className={"node " + k} handleClick={this.handleClick}></Node>
                componentGrid[i][j] = e
                k++;
            }
        }

        for (let i = 0; i < CAPACITY; i++) {
            this.addNode(`node ${i}`);
        }

        let inc = 0
        for (let i = 0; i < graphGrid.length; i++) {
            for (let j = 0; j < graphGrid[i].length; j++) {
                graphGrid[i][j] = inc;
                inc++;
            }
        }

        for (let i = 0; i < graphGrid.length - 1; i++) {
            for (let j = 0; j < graphGrid.length; j++) {
                this.addEdge(`node ${graphGrid[j][i]}`, `node ${graphGrid[j][i + 1]}`, 2)
            }
        }

        for (let i = 0; i < graphGrid.length; i++) {
            for (let j = 0; j < graphGrid.length - 1; j++) {
                this.addEdge(`node ${graphGrid[j + 1][i]}`, `node ${graphGrid[j][i]}`, 2)
            }
        }

        this.setState({
            ncList: componentGrid,
            wallNodes: [],
            toPath: [],
            visNode: [],
            visNum: null,
            isWall: false,
            time: null,
        })


    }

    addNode(node) {

        let nt = this.state.nodeTotal;
        let al = this.state.adjList;

        nt.push(node);
        al[node] = [];

        this.setState({
            nodeTotal: nt,
            adjList: al,
        })

    }

    addEdge(n1, n2, weight) {

        let newAdjList = this.state.adjList;

        newAdjList[n1].push({ connection: n2, weight: weight })
        newAdjList[n2].push({ connection: n1, weight: weight })


        this.setState({
            adjList: newAdjList
        })

    }

    addWall() {

        let test = this.state.wallNodes
        let list = this.state.adjList;

        Object.keys(list).forEach((node) => {
            if (test.find((e) => e === node)) {
                Object.keys(list[node]).forEach((c) => {
                    list[node][c].weight = Infinity;
                })
            }
        })

        this.setState({
            adjList: list
        })

    }

    handleClick = (node) => {

        let chosenNodes = this.state.toPath;
        let wallNodes = this.state.wallNodes;
        let nodeList = this.state.ncList;

        if (this.state.isWall === true) {

            wallNodes.push(node.props.className)

            let newNodeList = []
            let tList = []

            nodeList.forEach((e) => {
                e.forEach((element) => {
                    if (wallNodes.find((e) => element.props.className === e)) {
                        element = <WallNode testid={element.props.testid} className={`wallNode`}></WallNode>
                        newNodeList.push(element)
                    } else {
                        newNodeList.push(element)
                    }
                })
            })

            while (newNodeList.length) tList.push(newNodeList.splice(0, GRID_COL))

            this.setState({
                ncList: tList,
                wallNodes: wallNodes
            })

        } else {
            if (chosenNodes.length === 2) {
                return;
            } else {
                
                chosenNodes.push(node.props.className)

                let newNodeList = []
                let tList = []

                nodeList.forEach((e) => {
                    e.forEach((element) => {
                        if(element.props.className !== "wallNode" && node.props.className === element.props.className){
                            element = <PathNode testid = {<div className = "flag"><i class="fab fa-font-awesome-flag"></i></div>} className = {element.props.className}></PathNode>
                            newNodeList.push(element)
                        } else {
                            newNodeList.push(element)
                        }
                    })
                })

                while (newNodeList.length) tList.push(newNodeList.splice(0, GRID_COL))

                this.setState({
                    ncList: tList,
                    toPath: chosenNodes 
                })
            }
        }


    }

    handleAlg = (algorithm) => {

        this.addWall();

        switch(algorithm){
            case "dijkstra":
                this.dijkstras(this.state.toPath[0], this.state.toPath[1]);
                this.setState({
                    toPath: [],
                })
                break;
            case "BFS":
                this.BFS(this.state.toPath[0], this.state.toPath[1]);
                this.setState({
                    toPath: [],
                })
                break;
            case "GBFS":
                this.GBFS(this.state.toPath[0], this.state.toPath[1]);
                this.setState({
                    toPath: [],
                })
                break; 
            case "Astar":
                this.Astar(this.state.toPath[0], this.state.toPath[1]);
                this.setState({
                    toPath: [],
                })
                break;
            default:
                break;

        }

    }

    toggleWall = (e) => {

        this.setState(prev => ({
            isWall: !prev.isWall
        }))

    }

    BFS(start, end){
        
        let backtrace = {};

        let pq = new PriorityQueue();

        let vis = new Set();

        let adjList = this.state.adjList;
        let visNodes = this.state.visNode;

        let t0 = performance.now()

        pq.insert(start, 0);
        visNodes.push(start);

        while (!pq.isEmpty()) {

            let min = pq.remove();

            if(min === end){
                return;
            } else {
                
                let crawlIdx = min.element;

                adjList[crawlIdx].forEach(neighbor => {

                    if(!vis.has(neighbor.connection) && neighbor.weight !== Infinity){
                        vis.add(neighbor.connection)
                        pq.insert(neighbor.connection)
                        backtrace[neighbor.connection] = crawlIdx;

                        if (!visNodes.includes(end)) {
                            visNodes.push(crawlIdx)
                        }
                    }

                })

            }

        }

        let t1 = performance.now();
        let time = Math.trunc(t1-t0)

        let path = [end];
        let lastNode = end;

        while (lastNode !== start) {

            path.unshift(backtrace[lastNode]);
            lastNode = backtrace[lastNode];

        }


        this.setState({
            visNode: visNodes,
            time: time,
            pathLength: path.length
        })

        this.animateVis(path)


    }

    dijkstras(start, end) {

        let distances = {};

        let backtrace = {};

        let pq = new PriorityQueue();

        let t0 = performance.now()

        distances[start] = 0;

        const totalNodes = this.state.nodeTotal;
        let adjList = this.state.adjList;
        let visNodes = this.state.visNode;

        totalNodes.forEach(node => {

            if (node !== start) {
                distances[node] = Infinity;

            }

        })

        pq.insert(start, 0);
        visNodes.push(start);

        while (!pq.isEmpty()) {

            let min = pq.remove();

            let crawlIdx = min.element;

            adjList[crawlIdx].forEach(neighbor => {

                    let dist = distances[crawlIdx] + neighbor.weight;

                    if (dist < distances[neighbor.connection]) {

                        distances[neighbor.connection] = dist;

                        backtrace[neighbor.connection] = crawlIdx;

                        pq.insert(neighbor.connection, dist);

                        if (!visNodes.includes(end) && !visNodes.includes(crawlIdx)) {
                            visNodes.push(crawlIdx)
                        }

                    }

            })


        }

        let t1 = performance.now()

        let time = Math.trunc(t1 - t0)

        let path = [end];
        let lastNode = end;

        while (lastNode !== start) {

            path.unshift(backtrace[lastNode]);
            lastNode = backtrace[lastNode];

        }

        this.setState({
            visNode: visNodes,
            time: time,
            pathLength: path.length
        })

        this.animateVis(path)

    }

    GBFS(start, end){
        
        let backtrace = {};

        let pq = new PriorityQueue();

        let t0 = performance.now()

        let adjList = this.state.adjList;
        let visNodes = this.state.visNode;


        pq.insert(start, 0);
        visNodes.push(start);

        let endx;
        let endy;

        for(let k = 0; k < GRID_COL; k++){
            for(let j = 0; j < GRID_ROWS; j++){
                if(this.state.ncList[k][j].props.className === end){
                    endx = k;
                    endy = j;
                }
            }
        }

        while(!pq.isEmpty()){

            let min = pq.remove();
            
            let crawlIdx = min.element;

            adjList[crawlIdx].forEach(neighbor => {

                if(!Object.keys(backtrace).includes(neighbor.connection) && neighbor.weight !== Infinity){
                    
                    let priority = this.diagonalHeuristic(endx, endy, neighbor);
    
                    backtrace[neighbor.connection] = crawlIdx;
    
                    pq.insert(neighbor.connection, priority);
    
                    if (!visNodes.includes(end) && !visNodes.includes(crawlIdx)) {
                        visNodes.push(crawlIdx)
                    }
                    
                }

            })

        }

        let t1 = performance.now()

        let time = Math.trunc(t1 - t0)

        let path = [end];
        let lastNode = end;

        while (lastNode !== start) {

            path.unshift(backtrace[lastNode]);
            lastNode = backtrace[lastNode];

        }

        this.setState({
            visNode: visNodes,
            time: time,
            pathLength: path.length
        })

        this.animateVis(path)

    }

    Astar(start, end){
      
        let distances = {};

        let backtrace = {};

        let pq = new PriorityQueue();

        let t0 = performance.now()

        distances[start] = 0;

        const totalNodes = this.state.nodeTotal;
        let adjList = this.state.adjList;
        let visNodes = this.state.visNode;

        totalNodes.forEach(node => {

            if (node !== start) {
                distances[node] = Infinity;
            }

        })

        pq.insert(start, 0);
        visNodes.push(start);

        let endx;
        let endy;

        for(let k = 0; k < GRID_COL; k++){
            for(let j = 0; j < GRID_ROWS; j++){
                if(this.state.ncList[k][j].props.className === end){
                    endx = k;
                    endy = j;
                }
            }
        }

        while (!pq.isEmpty()) {

            let min = pq.remove();

            let crawlIdx = min.element;

            adjList[crawlIdx].forEach(neighbor => {

                if(!Object.keys(backtrace).includes(neighbor.connection) && neighbor.weight !== Infinity){

                    let dist = distances[crawlIdx] + neighbor.weight;

                    let priority = this.diagonalHeuristic(endx,endy,neighbor);

                    let hcost = dist + priority;

                    if (dist < distances[neighbor.connection]) {

                        distances[neighbor.connection] = dist;

                        backtrace[neighbor.connection] = crawlIdx;

                        pq.insert(neighbor.connection, hcost);

                        if (!visNodes.includes(end)) {
                            visNodes.push(crawlIdx)
                        }

                    }
                }

            
            })


        }

        let t1 = performance.now()

        let time = Math.trunc(t1 - t0)

        let path = [end];
        let lastNode = end;

        while (lastNode !== start) {

            path.unshift(backtrace[lastNode]);
            lastNode = backtrace[lastNode];

        }

        this.setState({
            visNode: visNodes,
            time: time,
            pathLength: path.length
        })

        this.animateVis(path)

    }

    diagonalHeuristic(endx,endy,neighbor){

        let nx;
        let ny;

        for(let k = 0; k < GRID_COL; k++){
            for(let j = 0; j < GRID_ROWS; j++){
                if(this.state.ncList[k][j].props.className === neighbor.connection){
                    nx = k;
                    ny = j;
                }
            }
        }

        return Math.max(Math.abs(nx - endx),Math.abs(ny - endy));
    }

    animate(path) {

        const nodeList = this.state.ncList;
        let newNodeList = []
        let tList = []
        let timer = 0;

        nodeList.forEach((e) => {
            e.forEach((element) => {
                if (path.find((e) => element.props.className === e)) {
                    element = <PathNode testid={element.props.testid} className={`pathNode`} wait={timer}></PathNode>
                    newNodeList.push(element)
                    timer = timer + 80;
                } else {
                    newNodeList.push(element)
                }
            })
        })

        while (newNodeList.length) tList.push(newNodeList.splice(0, GRID_COL))

        this.setState({
            ncList: tList
        })

    }

    animateVis(path) {

        let visitedNodes = this.state.visNode;
        let filtered = {}
        let nodeComponentList = this.state.ncList
        let nodeList= []
        let newNodeList = []
        let tList = []
        let timer = 0;
        let animatedVisitedNodes = []

        visitedNodes.forEach((i) => {
            if (!filtered[i]) {
                filtered[i] = true;
            }
        })

        for (let i = 0; i < GRID_COL; i++) {
            for (let j = 0; j < GRID_COL; j++) {
                nodeList.push(nodeComponentList[i][j])
            }
        }

        Object.keys(filtered).forEach((e) => {
            nodeList.forEach((n) => {
                if (e === n.props.className) {
                    n = <VisitedNode testid={n.props.testid} className={n.props.className} wait={timer}></VisitedNode>
                    newNodeList.push(n)
                    timer = timer + 40;
                }
            })
        })

        nodeComponentList.forEach((g) => {
            g.forEach((y) => {
                if (newNodeList.find((node) => y.props.className === node.props.className)) {
                    let node = newNodeList.find((node) => y.props.className === node.props.className)
                    y = node
                    animatedVisitedNodes.push(y)
                }
                else if (y.props.className === "wallNode") {
                    y = <WallNode testid={y.props.testid}></WallNode>
                    animatedVisitedNodes.push(y)
                }
                else {
                    y = <Node testid={y.props.testid} className={y.props.className} handleClick={() => null}></Node>
                    animatedVisitedNodes.push(y)
                }
            })
        })

        while (animatedVisitedNodes.length) tList.push(animatedVisitedNodes.splice(0, GRID_COL))

        this.setState({
            ncList: tList,
            visNum: Object.keys(filtered).length
        })

        setTimeout(() => {
            this.animate(path)
        }, timer + 500)

    }

    closeSide = () => {
        if(this.state.sideBar === true){
            document.getElementById("sideBar").style.width = "100px"
            
            this.setState({
                sideBar: false
            })
        } else {
            document.getElementById("sideBar").style.width = "480px"
            document.getElementById("clearBtn").style.marginLeft = "20"
            this.setState({
                sideBar: true
            })
        }
    }

    componentDidMount = async () => {

        await this.gridComponent();

        window.jQuery('#dijkstra').popover();
        window.jQuery('#dijkstra').click((e) => {
            window.jQuery('#dijkstra').popover('hide');
        })

        window.jQuery('#BFS').popover();
        window.jQuery('#BFS').click((e) => {
            window.jQuery('#BFS').popover('hide');
        })

        window.jQuery('#GBFS').popover();
        window.jQuery('#GBFS').click((e) => {
            window.jQuery('#GBFS').popover('hide');
        })

        window.jQuery('#Astar').popover();
        window.jQuery('#Astar').click((e) => {
            window.jQuery('#Astar').popover('hide');
        })

        window.jQuery('#myModal').modal()


    }

    render() {

        let wallButton;
        let dButton;
        let bButton;
        let gButton;
        let aButton;
        let timeInfo;
        let menu;

        if (this.state.isWall === true) {
            wallButton = <button className="btn wallToggle" onClick={e => this.toggleWall()}><i class="fas fa-toggle-on"></i> Add Wall</button>
        } else {
            wallButton = <button className="btn wallToggleOff" onClick={e => this.toggleWall()}><i class="fas fa-toggle-off"></i> Add Wall</button>
        }

        if (this.state.toPath.length < 2) {
            if(this.state.sideBar === true){
                dButton = <button className="btn wallToggleOff " id="dijkstra" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-cogs'></i> <b>Dijkstra's Shortest Path</b>" data-content="Dijkstra's Shortest Path Algorithm is a <b>weighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm will only visit neighboring nodes that have the <b>shortest distance</b> between the starting node<br/>" onClick={() => this.handleAlg("dijkstra")} disabled><i class="fas fa-cogs"></i> Dijkstra</button>
                bButton = <button className="btn wallToggleOff " id="BFS" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-cog'></i> <b>Breadth First Search</b>" data-content="Breadth First Search is an <b>unweighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm will visit <b>all neighboring nodes</b> sequentually until the end node is found<br/>" onClick={() => this.handleAlg("BFS")} disabled><i class="fas fa-cog"></i> BFS</button>
                gButton = <button className="btn wallToggleOff " id="GBFS" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-map-marker'></i> <b>Greedy Best First Search</b>" data-content="Greedy Best First Search is an <b>unweighted</b> <b>greedy</b> algorithm that <b>does not guarantee</b> the shortest path between two nodes in a graph <br/> The algorithm uses a <b>diagonal heuristic</b> (a prediction as to where the goal node is located) to trace a path<br/>" onClick={() => this.handleAlg("GBFS")} disabled><i class="fas fa-map-marker"></i> GBFS</button>
                aButton = <button className="btn wallToggleOff " id="Astar" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-map-marker-alt'></i> <b>A*</b>" data-content="A* Search is a <b>weighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm uses a <b>diagonal heuristic</b> (a prediction as to where the goal node is located) in conjunction with node distances to trace a path<br/>" onClick={() => this.handleAlg("Astar")} disabled><i class="fas fa-map-marker-alt"></i> A*</button>
            } else {
                dButton = <button className="btn wallToggleOff "  style = {{marginLeft: '0px', width: '100px'}} onClick={() => this.handleDijkstra()} disabled>Dijkstra</button>
                bButton = <button className="btn wallToggleOff "  style = {{marginLeft: '0px', width: '100px'}} onClick={() => this.handleBFS()} disabled>BFS</button>
            }
            
        } else {
            if(this.state.sideBar === true){
                dButton = <button className="btn wallToggleOff " id="dijkstra" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-cogs'></i> <b>Dijkstra's Shortest Path</b>" data-content="Dijkstra's Shortest Path Algorithm is a <b>weighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm will only visit neighboring nodes that have the <b>shortest distance</b> between the starting node<br/>" onClick={() => this.handleAlg("dijkstra")} ><i class="fas fa-cogs"></i> Dijkstra</button>
                bButton = <button className="btn wallToggleOff " id="BFS" data-toggle="tooltip" data-trigger="hover" data-placement="bottom" data-html="true" title="<i class='fas fa-cog'></i> <b>Breadth First Search</b>" data-content="Breadth First Search is an <b>unweighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm will visit <b>all neighboring nodes</b> sequentually until the end node is found<br/>" onClick={() => this.handleAlg("BFS")}><i class="fas fa-cog"></i> BFS</button>
                gButton = <button className="btn wallToggleOff " id="GBFS" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-map-marker'></i> <b>Greedy Best First Search</b>" data-content="Breadth First Search is an <b>unweighted</b> <b>greedy</b> algorithm that <b>does not guarantee</b> the shortest path between two nodes in a graph <br/> The algorithm uses a <b>diagonal heuristic</b> (a prediction as to where the goal node is located) to trace a path<br/>" onClick={() => this.handleAlg("GBFS")}><i class="fas fa-map-marker"></i> GBFS</button>
                aButton = <button className="btn wallToggleOff " id="Astar" data-toggle="tooltip" data-trigger="hover" data-placement="top" data-html="true" title="<i class='fas fa-fa-map-alt'></i> <b>A*</b>" data-content="A* Search is a <b>weighted</b> <b>greedy</b> algorithm that <b>guarantees</b> the shortest path between two nodes in a graph <br/> The algorithm uses a <b>diagonal heuristic</b> (a prediction as to where the goal node is located) in conjunction with node distances to trace a path<br/>" onClick={() => this.handleAlg("Astar")} ><i class="fas fa-map-marker-alt"></i> A*</button>
            } else {
                dButton = <button className="btn wallToggleOff "  style = {{marginLeft: '0px', width: '100px'}} onClick={() => this.handleDijkstra()}>Dijkstra</button>
                bButton = <button className="btn wallToggleOff "  style = {{marginLeft: '0px', width: '100px'}} onClick={() => this.handleBFS()}>BFS</button>
            }
            
        }

        if(this.state.time !== null){
            timeInfo = 
            <div className = "card infoCard">
                <p class="card-title card-header performance"><i class="fas fa-tachometer-alt"></i> Algorithm Performance</p>
                <div className = "card-body">    
                    <p><b>{this.state.pathLength}</b> nodes in path</p>
                    <p><b>{this.state.visNum}</b> nodes visited</p>
                </div>
            </div>
        } else {
            timeInfo = null;
        }

        if(this.state.sideBar === true){
            menu = 
            <nav id="sideBar">
                <p id="sideBarTitle"><i class="fas fa-wrench"></i> Instructions:</p>
                <p id="bar">______________________________________________________________________________</p>
                <ul>
                    <li id="sText">Click on any 2 nodes on the grid to pathfind</li>
                    <div id="pathNodes">
                        <p id="pathText"> Selected Nodes: </p>
                        <p id="pathText">{this.state.toPath[0]} {this.state.toPath[1]}</p>
                    </div>
                    <p id="bar">_____________________</p>
                    <div id="infoBox">
                        <div id="textBox">
                            <li id="sText">Add Barriers on the grid using the "Add Wall" button below or clear the grid using the "Clear Grid" button</li>
                            <br />
                            {wallButton}
                            <button className="btn wallToggleOff clear" id = "clearBtn" onClick={() => this.gridComponent()}><i class="fas fa-border-all"></i> Clear Grid</button>
                            <br />
                            <br />
                            <li id="sText">When you're ready, click an algorithm to visualize!</li>
                            <br />
                            {bButton}
                            {dButton}
                            {gButton}
                            {aButton}
                            <br />
                            <br />
                            {timeInfo}
                            <br />
                        </div>
                    </div>
                </ul>
            </nav>
        } else {
            menu = 
            <nav id="sideBar">
                <button onClick = {(e) => this.closeSide()}>close</button>
                <br/>
                <br/>
                {wallButton}
                <br/>
                <br/>
                <button className="btn wallToggleOff clear" id = "clearBtn" style = {{marginLeft: '0px', width: '100px'}}onClick={() => this.gridComponent()}>Clear Grid</button>
                <br/>
                <br/>
                <p id="bar">_____________________</p>
                <br/>
                <br/>
                {bButton}
                <br/>
                <br/>
                {dButton}
            </nav>
        }


        return (
            <div>

                <div className="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h4 className="modal-title"><i class="fab fa-react"></i> React Pathfinder</h4>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Welcome to the <b>React Pathfinder!</b> <br /><br /> This application <b>visualizes pathfinding algorithms</b> on an interactive grid. <br /><br />Click on any 2 nodes on the grid and watch the pathfinder animate the path between them! <br /><br /> You can even <b>create barriers</b> between the nodes using the "Add Wall" button!</p>
                                <br />
                                <h1 className="text-center diagram"><i className="fas fa-project-diagram"></i></h1>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="navbar">
                    <span className="navbar-brand mb-0 h1 title"><i className="fab fa-react"></i> React Pathfinder</span>
                    <span className="navbar-brand mb-0 name">Sasank G</span>
                </nav>

                {menu}

                <div className="grid">
                    {this.state.ncList}
                </div>

            </div>

        )
    }
}



