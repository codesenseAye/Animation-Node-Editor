// Handles listening to right clicks on the document and creating a context menu with specific actions relevant to where the user clicked
// Handles keycombinations (paste, cut, copy, etc) and triggers other module functions 

let contextSubscriptions = []
let {isClickOverNode} = require("./nodes/node/interface.js")

let ContextItem = (text) => {
    return (
        react.createElement("div", {className: "contextItem", key: Math.random()}, ... text)
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
        let nodeOver = isClickOverNode(mouseX, mouseY)

        if (nodeOver) {
            setOpen(true)
            setNode(nodeOver)

            return
        }

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

    return (
        react.createElement("div", {className: "contextMenu", inview: isOpen ? "1" : "0", style: {
            visibility: isOpen ? "visible" : "hidden",
            top: mouseY,
            left: mouseX
        }}, [
            ContextItem(["COPY", react.createElement("div", {className: "contextShortcut"}, "Ctrl+C")]),
            ContextItem(["CUT", react.createElement("div", {className: "contextShortcut"}, "Ctrl+X")]),
            ContextItem(["PASTE", react.createElement("div", {className: "contextShortcut"}, "Ctrl+V")]),
            ContextItem(["DELETE", react.createElement("div", {className: "contextShortcut"}, "Ctrl+D")]),

            //react.createElement("div", {key: Math.random(), className: "contextMenuSeparator"}),
        ])
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