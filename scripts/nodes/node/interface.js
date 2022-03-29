// Creates node of a specified type, create location, and adds it to the database
// Watches created node properties and inputs to update the database
// Manages basic node view functionality such as node dragging, node selecting, groups, commenting
// Handles the node in/out connection stream (accepting connection, denying connection for wrong data type etc) and storing it in the node database when sucessful 

let { Field , AddPropertyButton } = require("./field.js")
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
    position = position || {x: 0, y: 0}

    openedFile.push({
        id: Math.random(),

        lastNodeClickResponse: 0, // to limit the click detect rate (otherwise it become recursive)
        type: type,

        properties: {}, // properyName: {valueRef: "nodePathToValue"}
        connections: [],

        position: position
    })

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


let Node = (i, node) => {
    let [isSelected, setSelected] = react.useState(false)

    let click = leftDown.subscribe(() => {

        let now = performance.now()
        let diff = now - node.lastNodeClickResponse

        if (diff < 50) { // less than 50 milliseconds ago we responded to a click
            return
        }

        let nodeOver = isClickOverNode(mouseX, mouseY)

        if (!nodeOver) {
            isSelected = false
            setSelected(isSelected)
            return
        }
        
        node.lastNodeClickResponse = now

        let ctrlDown = keysDown.Control
        let same = nodeOver.id == node.id

        if (same) {
            console.log("dasda")
            processDrag(i, node)
        }

        if (ctrlDown && same) {
            isSelected = !isSelected
            setSelected(isSelected)
        } else if (ctrlDown && !same) {
            setSelected(isSelected)
        } else if (same) {
            isSelected = true
            setSelected(isSelected)
        } else if (!ctrlDown) {
            isSelected = false
            setSelected(isSelected)
        }
    })

    react.useEffect(() => {
        return () => click.unsubscribe()
    })

    return (
        react.createElement("div", {key: node.id, id: node.id, fileindex: i, isselected: isSelected ? 1 : 0, className: "nodeBack", style: {
            left: node.position.x,
            top: node.position.y
        }}, 
            Field("PATH"),
            Field("VALUE"),
            Field("VALUE"),
            Field("VALUE"),
            Field("VALUE"),
            Field("VALUE"),
            Field("VALUE"),
            AddPropertyButton()
        )
    )
}

let Nodes = () => {
    let [nodes, setNodes] = react.useState(openedFile)
    
    if (onNodesUpdateSubscription) {
        onNodesUpdateSubscription.unsubscribe()
        onNodesUpdateSubscription = null
    }

    if (!nodes) {
        return null
    }

    onNodesUpdateSubscription = nodesUpdated.subscribe(() => {
        // node sure if this will work because it'll be the same array object
        setNodes(openedFile)
    })

    return (
        nodes.map((node, i) => {
            return Node(i, node)
        })
    )
}


CreateNode("Variable", {x: 25, y: 50})
CreateNode("Variable", {x: 400, y: 50})

module.exports.Nodes = Nodes
module.exports.isClickOverNode = isClickOverNode
