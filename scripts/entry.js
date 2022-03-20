// The entry point for the app

import react from "react"
import reactDOM from "react-dom"

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
        return (null)
    }
}

class Body extends react.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return [
            <Topbar/>,
            <Contents/>
        ]
    }
}

reactDOM.render(<Body/>, document.getElementById("appBody"))