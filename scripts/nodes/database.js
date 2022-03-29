// Handles the node database of current tabs, nodes in those tabs, connections of those nodes, properties on those nodes, paths on those nodes, 
// Handles a seperate database for the animation keyframe timeline it generates from the node database

const { stat } = require('original-fs');

let sqlite3 = require('sqlite3').verbose()

var nodes = new sqlite3.Database('./nodes');
var properties = new sqlite3.Database('./nodes');

//nodes.serialize(function() {
  nodes.each("SELECT * FROM lorem", (err, column) => {
    //console.log(err, column)
  });
  /*var stmt = db.prepare("INSERT INTO lorem VALUES (?)");

  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
      //console.log(row.id + ": " + row.info);
  });*/
//});

//nodes.serialize(function() {
  //nodes.run("SELECT INSERT INTO * FROM NODES")

  //nodes.run("SELECT * FROM nodes", function(err, node) {
  //  console.log(err, node)
  //})
//})

nodes.close();
module.exports.Database = nodes