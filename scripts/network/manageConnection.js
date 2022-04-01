// Manages the connection with the node app and waits for an establishment request to display an established connection 
let { SetObjects } = require("../nodes/database.js")

let lastConnected = 0
let connectionInterval

http.createServer((req, res) => {
    let body = []
    
    req.on("data", (chunk) => {
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        lastConnected = performance.now()
    
        let jObj = JSON.parse(body)
        
        if (!jObj.isObjects) {
            return
        }

        SetObjects(jObj.objects)
    });

    res.end()
}).listen(1337, "localhost")


let ConnectionBar = () => {
    if (connectionInterval) {
        clearInterval(connectionInterval)
    }

    let [ms, setMs] = react.useState(lastConnected)

    connectionInterval = setInterval(() => {
        setMs(performance.now() - lastConnected)
    }, 250)

    let disconnected = ms > 500
    
    if (disconnected) {
        SetObjects([])
    }

    return (
        react.createElement("button", {
            className: "connectionBarLabel",
        }, disconnected ? "" : "CONNECTED (" + Math.round(ms) + " ms)")
    )
}


module.exports.ConnectionBar = ConnectionBar