// The entry point for the app
// Stores all variables shared across files (libraries, subjects, observables, etc)

const remote = require('@electron/remote')
const win = remote.getCurrentWindow(); 

const lodash = require("lodash")
const RXJS = require("rxjs");

const popper = require("@popperjs/core")
const http = require("http")

const rightDown = new RXJS.Subject()
const leftDown = new RXJS.Subject()

const rightUp = new RXJS.Subject()
const leftUp = new RXJS.Subject()

const keyUp = new RXJS.Subject()
const keyDown = new RXJS.Subject()

const mouseMoved = new RXJS.Subject()
const keysDown = {}

var mouseX = 0
var mouseY = 0

const { openedFile , openFiles} = require("./scripts/nodes/nodeTabs.js")
const { ContextMenu } = require("./scripts/contextualMenu.js")

const { Nodes } = require("./scripts/nodes/node/interface.js")
const { ConnectionBar } = require("./scripts/network/manageConnection.js")

const { TabsBar } = require("./scripts/nodes/nodeTabs.js")

window.addEventListener("keydown", (event) => {
    keysDown[event.key] = true
    keyDown.next()
});

window.addEventListener("keyup", (event) => {
    keysDown[event.key] = false
    keyUp.next()
});

class Topbar extends react.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (<div className="topBar"/>)
    }
}

class Contents extends react.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="contentGrid">
                <Nodes/>
            </div>
        )
    }
}

class Body extends react.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return [
            <Topbar>
            </Topbar>,
            <ConnectionBar/>,
            <TabsBar/>,
            
            <Contents/>,
            <ContextMenu/>
        ]
    }
}

reactDOM.render(<Body/>, document.getElementById("appBody"))