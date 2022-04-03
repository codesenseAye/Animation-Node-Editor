// Handles rendering/animating/reconnecting/disconnecting on click for node lines
// Does a wiggle animation when a connection is established
// Click to disconnect
// Click on end to drag to new connection

// Transmits value, stores value (for modify/set compute), and dispatches signal

const startLine = new RXJS.Subject()
const endLine = new RXJS.Subject()

let startConnectionLine = (direction, nodeIndex) => {
    console.log(direction, nodeIndex)
    
    // insert into array as available connections
    // poll connections when dragging line to see if any match the specifications
    // check if the line was dropped on a matching connection port
    // log the two ports as connected and then loop through all connections when sending the data out to the plugin
    // remove from array when the port is removed (react renderering / unmounting etc)
    // poll lines to update the ends to line up with the ports as they are moved by the user (dragging nodes etc)
    
    return (e) => {
        e.stopPropagation()
        startLine.next(node)
        
        let mouseUp
        
        mouseUp = leftUp.subscribe(() => {
            mouseUp.unsubscribe()
            endLine.next()
        })
    }
}


let establishedConnections = () => {
    return (null)
}


let establishingConnection = () => {
    let [establishing, setEstablishing] = react.useState(false)

    let start = startLine.subscribe(() => {
        setEstablishing(true)
    })

    let end = endLine.subscribe(() => {
        setEstablishing(false)
    })
    
    let x = mouseX
    let y = mouseY

    let makePath = (startX, startY, endX, endY) => {
        return `M${startX} ${startY} L${endX} ${endY}`
    }

    let followMoved

    let doEstablish = () => {
        followMoved = mouseMoved.subscribe(() => {
            let path = document.getElementById("connectionPath")

            path.setAttribute("d", makePath(x, y, mouseX, mouseY))
        })
    }

    let disconnect = () => {
        if (followMoved) {
            followMoved.unsubscribe()
        }
        
        start.unsubscribe()
        end.unsubscribe()
    }

    react.useEffect(() => {
        if (establishing) {
            doEstablish()
        }

        return () => disconnect()
    })

    return (establishing ? react.createElement("svg", {
        version: "1.1",
        xmlns: "http://www.w3.org/2000/svg",

        style: {
            left: "0px",
            top: "0px",
            
            zIndex: "-100",

            position: "absolute",
            height: "100%",
            width: "100%"
        }
    }, react.createElement("path", {
        id: "connectionPath", d: makePath(x, y, x, y), stroke: "black", strokeWidth: "5px"
    })) : null)
}



module.exports.StartConnectionLine = startConnectionLine 
module.exports.EstablishedConnections = establishedConnections 
module.exports.EstablishingConnection = establishingConnection 