// Handles the change node object which accepts a object path and several property names and data (transition time, delay time)
// Properties can be inputted by variable node types
// Property boxes have a line progress bar the bottom that plays transition delay first with green then transition duration in red

// Input field for node object
// Has in/out connection

const { SearchObject , GetProperties } = require("../../database.js")
const { StartConnectionLine } = require("../../lines.js")

let valueProgressBar = () => {
    return react.createElement("div", {className: "valuePropertyProgressBarHolder"},
        react.createElement("div", {className: "valuePropertyProgressBar"})
    )
}

let valueProgressFields = (fieldName) => {
    return fieldName == "BOTTOM" ? [
        react.createElement("input", {key: Math.random(), type:"number", className: "progressTimeInput"}),
        react.createElement("input", {key: Math.random(), type:"number", className: "progressTimeInput"})
    ] : []
}

let getPropertySelects = (node) => {
    let propertyElements = []
    let object = node.properties.object

    if (!object) {
        return propertyElements
    }
    
    let lastPropertiesClassName = node.lastPropertiesClassName

    if (lastPropertiesClassName == object.className) {
        return node.properties.availableProperties
    }

    GetProperties(object.className).then((properties) => {
        for (let i of Object.keys(properties)) {
            let property = properties[i]

            propertyElements.push(react.createElement("option", {
                key: property.Name, value: property.Name, className: "propertySelectOption"
            }, property.Name))
        }

        node.setValue("availableProperties", propertyElements)
    })

    node.lastPropertiesClassName = object.className
    return node.properties.availableProperties || propertyElements
}

class PathPropertyInput extends react.Component {
    constructor(props) {
        super(props)
        this.id = Math.random()

        this.state = {
            searchObjects: [],
            value: "",
            focused: false,
        }
    }

    componentDidMount() {
        let input = document.getElementById(this.id)

        if (this.state.focused) {
            input.focus()
        }
    }

    render() {
        let doSetObject = async (value) => {
            if (this.props.fieldName != "TOP") {
                return
            }

            let objects = []

            let objCallback = (obj) => {
                objects.push(obj)
            }

            if (value.length > 0) {
                await SearchObject(value, objCallback)
            }
            
            let objSelected = objects.find((obj) => {
                return obj.path == value
            })
            
            this.props.node.setValue("object", objSelected)
            this.setState({searchObjects: objects, value: value})
        }

        let doSetValue = (value) => {
            if (this.props.fieldName != "BOTTOM") {
                return
            }

            let propertyName = document.getElementById(this.props.node.id + "PROPERTY").value

            this.props.node.setValue("property" + this.props.i, {
                propertyName: propertyName,
                value: value
            })

            this.setState({value: value})
            // should be the dropdown selected as the index
        }
    
        let change = async (e) => {
            let value = e.target.value
            e.stopPropagation()

            doSetValue(value)
            doSetObject(value)
        }

        let makeSelection = (i, obj) => {
            let yPos = 38 + ((i + 1) * 20)
            let yPad = i * 4

            return react.createElement("button", {key: this.props.node.id + i, className: "selectionObject", style: {
                top: (yPos + yPad) + "px",
                left: "0px",

                visibility: this.state.focused ? "visible" : "hidden"
            }, onMouseDown: (e) => {
                e.stopPropagation()

                this.props.node.setValue("object", obj)
                this.setState({value: obj.path})
            }}, obj.path)
        }
        
        let onFocus = () => {
            this.setState({focused: true})
        }

        let onBlur = () => {
            this.setState({focused: false})
        }

        let selectElements = []

        for (let i = 0; i < this.state.searchObjects.length; i++) {
            let obj = this.state.searchObjects[i]
            selectElements.push(makeSelection(i, obj))
        }

        return react.createElement("div", {
            key: this.props.node.id, inline: this.props.fieldName == "BOTTOM" ? "true" : "false", className: "inputField",
            style: (this.props.notChange ? {
                marginLeft: "4px"
            } : null)
        },
            (this.props.fieldName == "BOTTOM" ? react.createElement("button", {
                key: Math.random(), className: "connectionInProperty", onMouseDown: StartConnectionLine()
            }) : null),
            
            react.createElement("input", {
                className: "field",
                id: this.id,

                onChange: change,

                onBlur: onBlur,
                onFocus: onFocus,

                onMouseDown: (e) => e.stopPropagation(),
                value: this.state.value || "",
            }),

            selectElements
        )
    }
}

let PathPropertyField = (node, fieldName, i) => {
    let propertyDropdownId = node.id + "PROPERTY"

    return react.createElement("div", {key: node.id, className: "pathProperty"}, 
        (fieldName == "BOTTOM" ? react.createElement("select", {
            key: propertyDropdownId, id: propertyDropdownId, className: "propertySelect", onMouseDown: (e) => e.stopPropagation(),
            onChange: (e) => {
                let propertyName = e.target.value
                let id = "property" + i

                node.setValue(id, {
                    propertyName: propertyName,
                    value: node.properties[id]?.value || ""
                })
            }
        }, getPropertySelects(node)) : null),
        
        react.createElement(PathPropertyInput, {node: node, fieldName: fieldName, i: i}),
        
        ... valueProgressFields(fieldName),
        fieldName == "VALUE" ? valueProgressBar() : null
    )
}

class Field extends react.Component {
    constructor(props) {
        super(props)
    }
    
    render() {

        let title = react.createElement("div", {
            key: this.props.node.id + this.props.fieldName, inline: this.props.fieldName == "BOTTOM" ? "true" : "false", className: "inputTitle"
        }, (this.props.fieldName == "TOP" ? "CHANGE" : "VALUE") + ":")

        let removeProperty = (e) => {
            e.stopPropagation()

            let newValues = lodash.cloneDeep(this.props.values)
            newValues.splice(this.props.i, 1)
            
            this.props.node.setValue("property" + this.props.i, null)
            this.props.setValues(newValues)
        }

        return [
            (this.props.fieldName == "BOTTOM" ? react.createElement("button", {
                key: Math.random(), className: "removePathProperty", onMouseDown: removeProperty
            }, "-", title) : title),

            PathPropertyField(this.props.node, this.props.fieldName, this.props.i),
        ]
    }
}

let AddPropertyButton = (values, setValues) => {
    let mouseDown = (e) => {
        e.stopPropagation()
        let newValues = lodash.cloneDeep(values)
        
        newValues.push({

        })
        
        setValues(newValues)
    }

    return (
        react.createElement("button", {
            key: Math.random(), className: "addPathProperty", onMouseDown: mouseDown
        }, "+")
    )
}

module.exports.ObjectPathPropertyInput = PathPropertyInput
module.exports.ChangeField = Field

module.exports.AddPropertyButton = AddPropertyButton