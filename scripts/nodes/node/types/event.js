// Handles the (global/object) event node which has a service/object path name and an event name
// Both inputs can be substituted by a variable node

const { ObjectPathPropertyInput } = require("./change")
const { StartConnectionLine } = require("../../lines.js")

let getEventSelects = (objectClass) => {
    return [ // change to be relevant to object class variable
        react.createElement("option", {key: Math.random(), value: "RENDERSTEPPED", className: "propertySelectOption"}, "RENDERSTEPPED"),
        react.createElement("option", {key: Math.random(), value: "STEPPED", className: "propertySelectOption"}, "STEPPED"),
        react.createElement("option", {key: Math.random(), value: "BUTTON1DOWN", className: "propertySelectOption"}, "BUTTON1DOWN"),
        react.createElement("option", {key: Math.random(), value: "BUTTON2DOWN", className: "propertySelectOption"}, "BUTTON2DOWN"),
    ]
}


class Field extends react.Component {
    constructor(props) {
        super(props)
    } 
    
    render() {
        return react.createElement("div", {className: "inputTitle"}, this.props.node.nodeType + ":",
            react.createElement("select", {
                key: this.props.node.id + "PROPERTY", className: "propertySelect", onMouseDown: (e) => e.stopPropagation()
            }, getEventSelects()),

            (this.props.node.nodeType == "OBJECT EVENT" ? react.createElement(ObjectPathPropertyInput, this.props) : null),
            react.createElement("div", {key: Math.random(), className: "connectionOut", onMouseDown: StartConnectionLine(1, this.props.nodeIndex)})
        )
    }
}


module.exports.EventField = Field