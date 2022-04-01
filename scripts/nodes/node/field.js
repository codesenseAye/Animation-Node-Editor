// Input field for node object
// Has in/out connection 
let { SearchObject } = require("../database.js")

let valueProgressBar = () => {
    return react.createElement("div", {className: "valuePropertyProgressBarHolder"},
        react.createElement("div", {className: "valuePropertyProgressBar"})
    )
}

let valueProgressFields = (fieldName) => {
    return fieldName == "VALUE" ? [
        react.createElement("input", {key: Math.random(), type:"number", className: "progressTimeInput"}),
        react.createElement("input", {key: Math.random(), type:"number", className: "progressTimeInput"})
    ] : []
}

let startConnectionLine = (fieldName) => {
    return (e) => {
        e.stopPropagation()


    }
}

let getPropertySelects = (objectClass) => {
    return [ // change to be relevant to object class variable
        react.createElement("option", {key: Math.random(), value: "Text", className: "propertySelectOption"}, "Text"),
        react.createElement("option", {key: Math.random(), value: "TextColor3", className: "propertySelectOption"}, "TextColor3"),

        react.createElement("option", {key: Math.random(), value: "Font", className: "propertySelectOption"}, "Font"),
        react.createElement("option", {key: Math.random(), value: "BackgroundColor", className: "propertySelectOption"}, "BackgroundColor"),
       
        react.createElement("option", {
            key: Math.random(), value: "BackgroundTransparency", className: "propertySelectOption"
        }, "BackgroundTransparency"),

        react.createElement("option", {key: Math.random(), value: "TextTransparency", className: "propertySelectOption"}, "TextTransparency")
    ]
}

let PathPropertyInput = (fieldName) => {
    let [searchObjects, setSearchObjects] = react.useState([])
    let [value, setValue] = react.useState("")
    
    let change = (e) => {
        let objects = []
        
        e.stopPropagation()
        setValue(e.target.value)

        // fix this then do the selection text
        // make pressing text load it as a value
        // make input focusing not so bad

        SearchObject(e.target.value, (obj) => {
            objects.push(obj)
        })

        console.log(objects)
        setSearchObjects(objects)
    }

    let makeSelection = (obj) => {
        return react.createElement("div", {className: "selectionObject"}, obj.path)
    }
    
    let id = Math.random()

    let focus = () => {

        if (!input) {
            return
        }

        input.focus()
    }

    return react.createElement("div", {key: id, inline: fieldName == "VALUE" ? "true" : "false", className: "inputField"},
        (fieldName == "VALUE" ? react.createElement("button", {
            key: Math.random(), className: "connectionInProperty", onMouseDown: startConnectionLine(fieldName)
        }) : null),
        
        react.createElement("input", {
            className: "field",
            id: id,

            onMouseDown: (e) => e.stopPropagation(),
            onChange: change,

            onMouseOver: focus,

            value: value,
        }),

        searchObjects.map((obj) => {
            makeSelection(obj)
        })
    )
}

let PathPropertyField = (fieldName) => {
    return react.createElement("div", {key: Math.random(), className: "pathProperty"}, 
        (fieldName == "VALUE" ? react.createElement("select", {key: Math.random(), className: "propertySelect"}, getPropertySelects()) : null),
        PathPropertyInput(fieldName),
        
        ... valueProgressFields(fieldName),
        fieldName == "VALUE" ? valueProgressBar() : null
    )
}

let Field = (fieldName) => {
    let title = react.createElement("div", {
        key: Math.random(), inline: fieldName == "VALUE" ? "true" : "false", className: "inputTitle"
    }, fieldName + ":")
    
    return [
        (fieldName == "VALUE" ? react.createElement("button", {key: Math.random(), className: "removePathProperty"}, "-", title) : title),
        PathPropertyField(fieldName),
    ]
}

let AddPropertyButton = () => {
    return (
        react.createElement("button", {key: Math.random(), className: "addPathProperty"}, "+")
    )
}

module.exports.Field = Field
module.exports.AddPropertyButton = AddPropertyButton