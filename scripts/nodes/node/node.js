// Creates node of a specified type, create location, and adds it to the database
// Watches created node properties and inputs to update the database
// Manages basic node view functionality such as node dragging, node selecting, groups, commenting
// Handles the node in/out connection stream (accepting connection, denying connection for wrong data type etc) and storing it in the node database when sucessful 

let { CreateInterface } = require("./interface.js")
var nodesSelected = []

var nodesUpdated = new RXJS.Subject()
let onNodesUpdateSubscription


// start over?
// iterate until it works

// i have a better idea of the tools i need to use and how to use them
// i have more ideas on how to structure everything
// instead of having the nodes be individualized
// i should have instead made a node boilerplate and a node surface handler
// i should have made everything more modular and not overcomplicated everything
// and looked farther ahead (which i can do better now)

// createNode(nodeType: determines inputs/paths/selects) returns node id to be matched with connections


// node.CreateInput(inputType : color / number / udim2) returns connection id
// will handle saving across react updates etc
// will constrain the user input to be valid to the input type

// node.CreatePath() returns a input id
// object path handlers
// updates the node values automatically to save across react updates

// node.CreateSelect(inputid : number / universally unique identifier, selectType : event / property / math operation / etc) returns a input id
// accepts an input id and will automatically update the options depending on the path when it changes and its current state
// automatically updates the node values to save across react updates

// node.CreateConnectionPort(
//    inputId? : optional create a connection port that can link with other ports, (if omitted it is a signal dispatch + i/o depending on direction)
//    direction: number for whether it is an "in" connection or "out" connection (whether or not to send or wait to receive data)
//)
// handles rendering established connections
// handles creating connections and verifying if the current port data matches (otherwise no connection)
// handles detecting when inputs have changed and whether or not to break the connection (because the data doesnt match anymore)
// handles breaking connections manually by the user
// handles storing active connections between ports

// These functions will create dictionaries in the array node.elements
// the node will be rendered based on what is in the node.element dictionaries
// the element dictionary created by the boilerplate function will hold the data of the rendered element piece
// the other functions will reference this dictionary for data that is needed for the operability of the function in question 
// ^ based on input id & piece/function id

// build on these boilerplate functions that will work together and be more general and modular 
// have these functions save to the node automatically behind the scenes seamlessly

class Node {
    constructor(position) {
        this.id = Math.random()
        this.position = position

        this.setValue = setValue
        this.valueUpdated = new RXJS.Subject()

        this.lastNodeClickResponse = 0 // to limit the click detect rate (otherwise it become recursive)
        this.nodeType = type

        this.properties = {} // properyName: {valueRef: "nodePathToValue"}
        this.connections = []

        this.interfaces = {
            inputs: [],
            paths: [],
            selects: [],
            connectionPorts: []
        }
    }

    CreateInput() {

    }

    CreatePath() {

    }

    CreateSelect() {

    }   
    
    CreateConnectionPort() {

    }
    
    _setValue(valueName, value) {
        let beforeValue = this.properties[valueName]
        this.properties[valueName] = value

        if (!lodash.isEqual(beforeValue, value)) {
            this.valueUpdated.next()
        }
    }
}

var isClickOverNode = (x, y) => {
    let nodeElements = document.getElementsByClassName("nodeBack")

    for (let index = 0; index < nodeElements.length; index++) {
        let nodeBack = nodeElements[index]
        let rect = nodeBack.getBoundingClientRect()

        if (x < rect.left) continue
        if (y < rect.top) continue

        if (x > rect.left + rect.width) continue
        if (y > rect.top + rect.height) continue

        let fileIndex = nodeBack.getAttribute("fileindex")
        let nodeObj = openedFile[fileIndex]

        return lodash.cloneDeep(nodeObj)
    }
}

let CreateNode = (type, position) => {
    let node
    position = position || {x: 0, y: 0}

    node = new Node(position)

    openedFile.push(node)
    nodesUpdated.next()
}

let processDrag = (i, node) => {
    let up
    let nodeElement = document.getElementById(node.id)

    let offsetX = node.position.x - mouseX
    let offsetY = node.position.y - mouseY

    let moved = mouseMoved.subscribe(() => {
        node.position.x = mouseX  + offsetX
        node.position.y = mouseY + offsetY

        nodeElement.setAttribute("style", `left: ${node.position.x}px;top:${node.position.y}px`)
    })

    up = leftUp.subscribe(() => {
        up.unsubscribe()
        moved.unsubscribe()
    })
}


class NodeObject extends react.Component {
    constructor(props) {
        super(props)

        this.state = {
            isSelected: false,
            values: [],

            lastNodeClickResponse: 0
        }
    }

    componentWillUnmount() {
        if (!this.click) {
            return
        }
        
        this.click.unsubscribe()
    }

    render() {
        let setValues = (newValues) => {
            this.setState({
                values: newValues
            })
        } 

        if (this.click) {
            this.click.unsubscribe()
        }

        this.click = leftDown.subscribe(() => {
            let now = performance.now()
            let diff = now - this.state.lastNodeClickResponse

            if (diff < 50) { // less than 50 milliseconds ago we responded to a click
                return
            }

            this.setState({lastNodeClickResponse: now})
            let nodeOver = isClickOverNode(mouseX, mouseY)

            if (!nodeOver) {
                this.setState({isSelected: false})
                return
            }

            let ctrlDown = keysDown.Control
            let same = nodeOver.id == this.props.node.id

            if (same) {
                processDrag(this.props.i, this.props.node)
            }

            if (ctrlDown && same) {
                this.setState({isSelected: !this.state.isSelected})
            } else if (ctrlDown && !same) {
                this.setState({isSelected: this.state.isSelected})
            } else if (same) {
                this.setState({isSelected: true})
            } else if (!ctrlDown) {
                this.setState({isSelected: false})
            }
        })

        return (
            react.createElement("div", {
                key: this.props.node.id, 
                id: this.props.node.id, fileindex: this.props.i, isselected: this.state.isSelected ? 1 : 0, className: "nodeBack", 

                style: {
                    left: this.props.node.position.x,
                    top: this.props.node.position.y
                }
            }, 
                react.createElement(CreateInterface, {
                    key: this.props.i, i: this.props.i, values: this.state.values, setValues: setValues, node: this.props.node
                })
            )
        )
    }
}

let Nodes = () => {
    let [nodes, setNodes] = react.useState(lodash.cloneDeep(openedFile))
    
    if (onNodesUpdateSubscription) {
        onNodesUpdateSubscription.unsubscribe()
        onNodesUpdateSubscription = null
    }

    if (!nodes) {
        return null
    }

    onNodesUpdateSubscription = nodesUpdated.subscribe(() => {
        // node sure if this will work because it'll be the same array object
        setNodes(lodash.cloneDeep(openedFile))
    })

    return (
        nodes.map((node, i) => {
            return react.createElement(Node, {key: i, i: i, node: openedFile[i]})
        })
    )
}

module.exports.Nodes = Nodes
module.exports.CreateNode = CreateNode
module.exports.IsClickOverNode = isClickOverNode
