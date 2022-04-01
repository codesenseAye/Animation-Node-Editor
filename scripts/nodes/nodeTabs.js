// Handles loading nodes in the node view with their connections, properties, values, etc
// Deloading previous nodes in the node view and sending to the plugin client to remove the widget

var openedFile = []
var openFiles = []

let Tabs = () => {
    return (
        react.createElement("div", {className: "tabsBar"})
    )
}


let Tab = () => {

}

module.exports.openedFile = openedFile
module.exports.openFiles = openFiles

module.exports.TabsBar = Tabs