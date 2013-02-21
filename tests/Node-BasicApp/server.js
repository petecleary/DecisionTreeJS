var TestApp = require("./app.js");
var tree = require("./json.js");
var decisionTree = require("../../lib/decisionTree.js");

//create a data object to process
var data = { "a": 1 };

//execute the tree on the root shape
decisionTree.execute(tree.shape, data, TestApp.complete, { "TestApp": TestApp });