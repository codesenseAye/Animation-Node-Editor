// Handles listening to right clicks on the document and creating a context menu with specific actions relevant to where the user clicked
// Handles keycombinations (paste, cut, copy, etc) and triggers other module functions 

let contextSubscriptions = []
let {IsClickOverNode, CreateNode} = require("./nodes/node/node.js")

let copyNode = () => {

}

let cutNode = () => {
    
}

let pasteNode = () => {
    
}

let deleteNode = () => {
    
}

let createNode = (nodeType) => {
    return () => {
        CreateNode(nodeType, {x: mouseX, y: mouseY})
    }
}

let ContextItem = (action, text) => {
    return (
        react.createElement("button", {className: "contextItem", key: Math.random(), onMouseDown: (e) => {
            e.stopPropagation()
            action()
        }}, ... text)
    )
}

let ContextMenu = () => {
    let clickX = mouseX
    let clickY = mouseY

    contextSubscriptions.map((subscription) => {
        subscription.unsubscribe()
    })
    
    let [isOpen, setOpen] = react.useState(false) 
    let [nodeOver, setNode] = react.useState(false)

    contextSubscriptions.push(rightDown.subscribe(() => {
        let nodeOver = IsClickOverNode(mouseX, mouseY)

        if (nodeOver) {
            setOpen(true)
            setNode(nodeOver)

            return
        } else setNode()

        if (isOpen && Math.abs(clickX - mouseX) == 0) {
            return
        } 

        if (isOpen && Math.abs(clickY - mouseY) == 0) {
            return
        }

        setOpen(!isOpen)
    }))

    contextSubscriptions.push(leftDown.subscribe(() => {
        setOpen(false)
    }))

    let contextActions = nodeOver ? [
        ContextItem(copyNode, [
            react.createElement("div", {className: "contextTitle"}, "COPY"),
            react.createElement("div", {className: "contextShortcut"}, "Ctrl+C")
        ]),

        ContextItem(cutNode, [
            react.createElement("div", {className: "contextTitle"}, "CUT"),
            react.createElement("div", {className: "contextShortcut"}, "Ctrl+X")
        ]),

        ContextItem(pasteNode, [
            react.createElement("div", {className: "contextTitle"}, "PASTE"),
            react.createElement("div", {className: "contextShortcut"}, "Ctrl+V")
        ]),
    
        ContextItem(deleteNode, [
            react.createElement("div", {className: "contextTitle"}, "DELETE"),
            react.createElement("div", {className: "contextShortcut"}, "Ctrl+D")
        ])
    ] : [
        ContextItem(createNode("OBJECT EVENT"), [react.createElement("div", {className: "contextTitle"}, "OBJECT EVENT")]),
        ContextItem(createNode("GLOBAL EVENT"), [react.createElement("div", {className: "contextTitle"}, "GLOBAL EVENT")]),

        react.createElement("div", {key: Math.random(), className: "contextMenuSeparator"}),

        ContextItem(createNode("CHANGE"), [react.createElement("div", {className: "contextTitle"}, "CHANGE")]),
        ContextItem(createNode("VARIABLE"), [react.createElement("div", {className: "contextTitle"}, "VARIABLE")]),
        
        react.createElement("div", {key: Math.random(), className: "contextMenuSeparator"}),

        ContextItem(createNode("MODIFY"), [react.createElement("div", {className: "contextTitle"}, "MODIFY")]),
        ContextItem(createNode("SET"), [react.createElement("div", {className: "contextTitle"}, "SET")]),
    ]

    return (
        react.createElement("div", {className: "contextMenu", inview: isOpen ? "1" : "0", style: {
            visibility: isOpen ? "visible" : "hidden",
            top: mouseY,
            left: mouseX
        }}, contextActions)
    )
}

document.onmousedown = (e) => {
    if (e.buttons == 1) {
        leftDown.next()
    } else if (e.buttons == 2) {
        rightDown.next()
    }
}

document.onmouseup = (e) => {
    if (e.buttons == 0) {
        leftUp.next()
    } else if (e.buttons == 2) {
        rightUp.next()
    }
}

document.onmousemove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    mouseMoved.next()
}

module.exports.ContextMenu = ContextMenu