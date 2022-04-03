// Handles the variable node type (it accepts a data type and a data value) and can be plugged into property values and event node object path inputs 
// Takes in a state node object and takes the data type from the connected state node and allows you to change the state value by input 
// and allows you to add/minus the state value by input 
// (can be a UI object path)

const { StartConnectionLine } = require("../../lines.js")

let getDataTypeSelects = (objectClass) => {
    return [ // change to be relevant to object class variable
        react.createElement("option", {key: Math.random(), value: "NUMBER", className: "propertySelectOption"}, "NUMBER"),
        react.createElement("option", {key: Math.random(), value: "COLOR", className: "propertySelectOption"}, "COLOR"),
        react.createElement("option", {key: Math.random(), value: "COLOR", className: "propertySelectOption"}, "UDIM2"),
        react.createElement("option", {key: Math.random(), value: "COLOR", className: "propertySelectOption"}, "UDIM"),
        react.createElement("option", {key: Math.random(), value: "COLOR", className: "propertySelectOption"}, "BOOLEAN"),
    ]
}

class Field extends react.Component {
    constructor(props) {
        super(props)
    } 
    
    render() {
        return react.createElement("div", {className: "inputTitle"}, "VARIABLE:",
            react.createElement("select", {
                key: this.props.node.id + "PROPERTY", className: "propertySelect", onMouseDown: (e) => e.stopPropagation(), style: {
                    marginLeft: "0px",
                    marginTop: "3px",
                    marginBottom: "3px",
                }
            }, getDataTypeSelects()),

            react.createElement("input", {key: Math.random(), type: "checkbox", onMouseDown: (e) => e.stopPropagation()}), "CONSTANT",
            react.createElement("input", {key: Math.random(), className: "inputField"}),

            react.createElement("div", {key: Math.random(), className: "connectionOut", onMouseDown: StartConnectionLine(1, this.props.nodeIndex)})
        )
    }
}


module.exports.VariableField = Field