// Handles the node database of current tabs, nodes in those tabs, connections of those nodes, properties on those nodes, paths on those nodes, 
// Handles a seperate database for the animation keyframe timeline it generates from the node database

let sqlite3 = require('sqlite3').verbose()
let { open } = require("sqlite")

var nodes = open({filename: './nodes', driver: sqlite3.Database})
var properties = open({filename: './properties', driver: sqlite3.Database})

var properties = open({filename: './properties', driver: sqlite3.Database})
var events = open({filename: "./events", driver: sqlite3.Database})

var datatypes = open({filename: "./datatypes", driver: sqlite3.Database})
var guiObjects = open({filename: "./guiObjects", driver: sqlite3.Database})

let databaseError = (ignore) => {
	return (e) => {
		if (ignore) {
			return
		}

		if (!e) {
			return
		}

		console.log(e)
	}
}

let searchProperty = async (searchKeywords) => {

}

let searchObject = async (pathSoFar, gotCallback) => {
	let db = await guiObjects

	return await db.each(`SELECT * FROM objects WHERE path LIKE \'%${pathSoFar}%\' LIMIT 5`, (e, row) => {
		if (e) {
			console.log(e)
			return
		}

		gotCallback(row)
	})
}

let searchEvent = async (searchKeywords) => {

}

let setObjects = async (objects) => {
	let db = await guiObjects
	db.run("CREATE TABLE objects (className varchar(255), path varchar(255));", databaseError()).catch(databaseError(true))

	db.run(
		"DELETE FROM objects;"
	).catch(databaseError())

	for (let i = 0; i < objects.length; i++) {
		let obj = objects[i]

		db.run(`INSERT INTO objects (className, path) VALUES (\'${obj.className}\', \'${obj.path}\');`).catch(databaseError())
	}
}

module.exports.SearchProperty = searchProperty
module.exports.SearchObject = searchObject

module.exports.SearchEvent = searchEvent
module.exports.SetObjects = setObjects