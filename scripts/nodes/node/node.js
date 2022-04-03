// Creates node of a specified type, create location, and adds it to the database
// Watches created node properties and inputs to update the database
// Manages basic node view functionality such as node dragging, node selecting, groups, commenting
// Handles the node in/out connection stream (accepting connection, denying connection for wrong data type etc) and storing it in the node database when sucessful 

let { CreateInterface } = require("./interface.js")
var nodesSelected = []

var nodesUpdated = new RXJS.Subject()
let onNodesUpdateSubscription

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

    let setValue = (valueName, value) => {
        let beforeValue = node.properties[valueName]
        node.properties[valueName] = value

        if (!lodash.isEqual(beforeValue, value)) {
            node.valueUpdated.next()
        }

        console.log(node)
    }

    node = {
        id: Math.random(),

        setValue: setValue,
        valueUpdated: new RXJS.Subject(),

        lastNodeClickResponse: 0, // to limit the click detect rate (otherwise it become recursive)
        nodeType: type,

        properties: {}, // properyName: {valueRef: "nodePathToValue"}
        connections: [],

        position: position
    }

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


class Node extends react.Component {
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
