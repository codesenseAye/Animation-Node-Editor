// Handles the node database of current tabs, nodes in those tabs, connections of those nodes, properties on those nodes, paths on those nodes, 
// Handles a seperate database for the animation keyframe timeline it generates from the node database

let sqlite3 = require('sqlite3').verbose()
let { open } = require("sqlite")

var nodes = open({filename: './nodes', driver: sqlite3.Database})
var properties = require("../../robloxProperties.json")

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

let searchObject = async (pathSoFar, gotCallback) => {
	let db = await guiObjects

	let query = await db.each(`SELECT * FROM objects WHERE path LIKE \'%${pathSoFar}%\' LIMIT 5`, (e, row) => {
		if (e) {
			console.log(e)
			return
		}

		gotCallback(row)
	})

	return query
}

let searchEvent = async (searchKeywords) => {

}

let setObjects = async (objects) => {
	let db = await guiObjects
	db.run("CREATE TABLE objects (className varchar(255), path varchar(255));", databaseError()).catch(databaseError(true))

	db.run(
		"DELETE FROM objects;"
	).then(() => {
		// make sure to wait for the delete query first so we dont immediately delete everything we added
		for (let i = 0; i < objects.length; i++) {
			let obj = objects[i]
	
			db.run(`INSERT INTO objects (className, path) VALUES (\'${obj.className}\', \'${obj.path}\');`).catch(databaseError())
		}
	}).catch(databaseError())
}

let getProperties = (classToCollect) => {
	let prom = new Promise((resolve) => {
		let myProps = {}
	
		let found = false
		let interval
	
		interval = setInterval(() => {
			found = false
	
			for (let classProps of properties.Classes) {
				if (classProps.Name != classToCollect) continue
				
				for (let member of classProps.Members) {
					if (member.MemberType == "Property") {
						if (member.Tags && member.Tags.find(tag => tag == "ReadOnly" || tag == "Deprecated")) {
							// ignore properties that are readonly or deprecated
							continue
						} else if (member.Security && (member.Security.Read != "None" || member.Security.Write != "None")) {
							// ignore properties that cant be modified in a live game
							continue
						}

						myProps[member.Name] = member
					}
				}
	
				classToCollect = classProps.Superclass
				// collect from the superseding class (inherited properties)

				found = true
			}
			
			if (!found) {
				// didnt find the class at all (bad)

				clearInterval(interval)
				console.error("Class not found: " + classToCollect)
			}
	
			if (classToCollect == "<<<ROOT>>>") {
				// reached the root class so stop searching

				clearInterval(interval)
				resolve(myProps)
			}
		}, 0)
	})

	prom.catch((e) => {
		console.log(e)
	})
	
	return prom
}

module.exports.GetProperties = getProperties
module.exports.SearchObject = searchObject

module.exports.SearchEvent = searchEvent
module.exports.SetObjects = setObjects