// Leads to the proper interface for the type of node
// Handles values and search databases (for gui path / property name / property value / etc)

const { StartConnectionLine } = require("../lines.js")

const { ChangeField, ObjectPathPropertyInput, AddPropertyButton } = require("./types/change.js")
const { EventField } = require("./types/event.js")

const { VariableField } = require("./types/variable.js")
const { ComputeField } = require("./types/compute.js")

let FieldWrap = (nodeType) => {
    if (nodeType == "CHANGE") {
        return ChangeField
    } else if (nodeType == "VARIABLE") {
        return VariableField
    } else if (nodeType == "OBJECT EVENT" || nodeType == "GLOBAL EVENT") {
        return EventField
    } else if (nodeType == "MODIFY" || nodeType == "SET") {
        return ComputeField
    } else {
        console.log("Couldn't find node type. Type: " + nodeType)
        return "div"
    }
}

class createInterface extends react.Component {
    constructor(props) {
        super(props)
        this.disconnect = this.disconnect.bind(this)
    }

    disconnect() {
        if (this.onValueUpdated) {
            this.onValueUpdated.unsubscribe()
        }
    }

    componentWillUnmount() {
        this.disconnect()
    }

    render() {
        let VALUES = []

        for (let i = 0; i < this.props.values.length; i++) {
            let value = this.props.values[i]

            VALUES.push(react.createElement(FieldWrap(this.props.node.nodeType), {
                key: i,
                node: this.props.node, fieldName: "BOTTOM", // bottom of node identifier (for properties / values etc)

                values: this.props.values, setValues: this.props.setValues,
                i: i, value: value,

                nodeIndex: this.props.i
            }))
        }

        this.disconnect()
        
        this.onValueUpdated = this.props.node.valueUpdated.subscribe(() => {
            this.forceUpdate()
        })

        return [
            react.createElement(FieldWrap(this.props.node.nodeType), {
                key: "TOP", node: this.props.node, fieldName: "TOP", // top of the node identifier (for path / dropdown for type etc)
                nodeIndex: this.props.i
            }),
            
            VALUES,

            (this.props.node.nodeType == "CHANGE" ? 
                react.createElement("div", {key: Math.random(), className: "signalIn", onMouseDown: StartConnectionLine(-2, this.props.i)})
            : null),
            
            (this.props.node.nodeType == "CHANGE" ? AddPropertyButton(this.props.values, this.props.setValues) : null)
             // to add more properties for the change event
        ]
    }
}

module.exports.CreateInterface = createInterface