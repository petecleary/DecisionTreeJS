var TestApp = require("./app.js");
var tree = require("./json.js");
var decisionTree = require("../../lib/decisionTree.min.js");

//create a data object to process
var data = { "a": 1 };
//set start date on the object
data.startDate = new Date();

//execute the tree on the root shape
decisionTree.execute(tree.shape, data, TestApp.complete, { "TestApp": TestApp });