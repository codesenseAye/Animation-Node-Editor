// Handles changing variable values if they are not a constant
// Accepts in connection for value to change and another in connect for an event to trigger the change

const { ObjectPathPropertyInput } = require("./change")
const { StartConnectionLine } = require("../../lines.js")

let getOperationSelects = (objectClass) => {
    return [ // change to be relevant to object class variable
        react.createElement("option", {key: Math.random(), value: "+", className: "propertySelectOption"}, "+"),
        react.createElement("option", {key: Math.random(), value: "-", className: "propertySelectOption"}, "-"),
    ]
}

class Field extends react.Component {
    constructor(props) {
        super(props)
    } 
    
    render() {
        return react.createElement("div", {className: "inputTitle"}, this.props.node.nodeType + ":",
            (this.props.node.nodeType == "MODIFY" ? react.createElement("select", {
                key: this.props.node.id + "PROPERTY", className: "propertySelect", onMouseDown: (e) => e.stopPropagation(), style: {
                    marginLeft: "4px"
                }
            }, getOperationSelects()) : null),

            //react.createElement(ObjectPathPropertyInput, {notChange: true, ... this.props}), // not change identifier to remove margin negative
            react.createElement("div", {key: Math.random(), className: "connectionIn", onMouseDown: StartConnectionLine(-1, this.props.nodeIndex)}),
            react.createElement("div", {key: Math.random(), className: "connectionOut", onMouseDown: StartConnectionLine(1, this.props.nodeIndex)})
        )
    }
}


module.exports.ComputeField = Field