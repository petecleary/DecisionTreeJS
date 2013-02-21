
(function () {
    var decisionTree = {};
    //the following section was borrowed from async library [https://github.com/caolan/async]
    //****************************************************************************************
    // global on the server, window in the browser
    var root, previous_decisionTree;

    root = this;
    if (root != null) {
        previous_decisionTree = root.decisionTree;
    }
    //****************************************************************************************

    //****************************************************************************************
    // SHAPE OBJECTS AND CONSTUCTORS - not required to processing shapes 
    //****************************************************************************************
    //entry shape object with constructor
    var Entry = (function () {
        function Entry(obj) {
            this.shapeType = "Entry";
            this.inititate = function (args) {
                return null;
            };
            this.id = obj && obj.id || 0;
            this.description = obj && obj.description || "Start";
            this.log = obj && obj.log || null;
            this.processed = obj && obj.processed || false;
            this.processCount = obj && obj.processCount || 0;
            this.nextShape = obj && obj.nextShape || null;
        }
        return Entry;
    })();
    decisionTree.Entry = Entry;    
    
    //operation shape object with constructor
    var Operation = (function () {
        function Operation(obj) {
            this.shapeType = "Operation";
            this.process = function (data, shape, callback) {
                callback(null, shape);
            };
            this.id = obj && obj.id || 0 , this.description = obj && obj.description || "Operation";
            this.log = obj && obj.log || null;
            this.processed = obj && obj.processed || false;
            this.processCount = obj && obj.processCount || 0;
            this.nextShape = obj && obj.nextShape || null;
            this.properties = obj && obj.properties || null;
            this.process = obj && obj.process || function (data, shape, callback) {
                callback(null, shape);
            };
            this.processName = obj && obj.processName || "";
        }
        return Operation;
    })();
    decisionTree.Operation = Operation;  
    
    //decision shape object with constructor  
    var Decision = (function () {
        function Decision(obj) {
            this.shapeType = "Decision";
            this.process = function (data, shape, callback) {
                callback(null, shape);
            };
            this.decide = function (data, shape, callback) {
                callback(null, shape);
            };
            this.id = obj && obj.id || 0 , this.description = obj && obj.description || "Decision";
            this.log = obj && obj.log || null;
            this.processed = obj && obj.processed || false;
            this.processCount = obj && obj.processCount || 0;
            this.paths = obj && obj.paths || new Array();
            this.properties = obj && obj.properties || null;
            this.process = obj && obj.process || function (data, shape, callback) {
                callback(null, shape);
            };
            this.processName = obj && obj.processName || "";
            this.nextShape = obj && obj.nextShape || null;
            this.decide = obj && obj.decide || function (data, shape, callback) {
                callback(null, shape);
            };
            this.decideName = obj && obj.decideName || "";
        }
        return Decision;
    })();
    decisionTree.Decision = Decision;    
    
    //decision path object with constructor
    var DecisionPath = (function () {
        function DecisionPath(obj) {
            this.value = obj && obj.value || null;
            this.selected = obj && obj.selected || false;
            this.nextShape = obj && obj.nextShape || null;
            this.nextShapeId = obj && obj.nextShapeId || 0;
        }
        return DecisionPath;
    })();
    decisionTree.DecisionPath = DecisionPath;    
    
    //terminator shape object with constructor
    var Terminator = (function () {
        function Terminator(obj) {
            this.shapeType = "Terminator";
            this.id = obj && obj.id || 0 , this.description = obj && obj.description || "End";
            this.log = obj && obj.log || null;
            this.processed = obj && obj.processed || false;
            this.processCount = obj && obj.processCount || 0;
        }
        return Terminator;
    })();
    decisionTree.Terminator = Terminator;   
    //**************************************************************************************** 
    
    //the following section was borrowed from async library [https://github.com/caolan/async]
    //****************************************************************************************
    if(typeof process === 'undefined' || !((process).nextTick)) {
        nextTick = function (fn) {
            setTimeout(fn, 0);
        };
    } else {
        nextTick = (process).nextTick;
    }
    //****************************************************************************************

    //Execute function used to process shapes
    // shape, and data required all other properties optional
    function execute(shape, data, callback, apps, keepProcessedShapes) {
        //store the processed shapes
        var processedShapes = new Array();
        //set a default callback function if one does not exist
        callback = callback || function () { };
        //set a default data object if one does not exist
        if(!data) {
            data = new Object();
        }
        //clear processed shapes unless explicitly told not to
        if(!keepProcessedShapes) {
            processedShapes = new Array();
        }
        //if the shape is empty then just do the callback
        if(!shape) {
            return callback();
        }
        //store the processed shapes
        var processedShapes = new Array();
        //set the current shape
        var currentShape = shape;
        //function to process a shape, self called by the execute function
        var processWrapper = function (err, wrShape) {
            //add the shape to be processed
            currentShape = wrShape;
            //add error check
            if(err) {
                return callback(err, data, processedShapes);
            } else {
                //add the process times on it
                currentShape.processed = true;
                currentShape.processCount += 1;
                switch(currentShape.shapeType.toLowerCase()) {
                    case "entry": {
                        //add the shape to the processed shape array
                        processedShapes.push(currentShape);
                        //call the next shape without doing anything - applied to nextTick so as to be the most efficient and not use up the process in node/server side coding 
                        nextTick(function () {
                            processWrapper(null, (currentShape).nextShape);
                        });
                        break;

                    }
                    case "operation": {
                        //check there is a nextStep if not add a terminator
                        (currentShape).nextShape = (currentShape).nextShape || { "id": -1, "shapeType": "Terminator", "description": "End"};
                        //add the process function if defined by name only
                        if(!(currentShape).process) {
                            (currentShape).process = applyFunctionFromName((currentShape).processName, apps);
                        }
                        //call the process function
                        (currentShape).process(data, (currentShape), function (error, crShape) {                      
                            //add the shape to the processed shape array
                            processedShapes.push(crShape);
                            nextTick(function () {
                                processWrapper(error, crShape.nextShape);
                            });
                        });
                        break;

                    }
                    case "decision": {
                        //add the process function if defined by name only
                        if(!(currentShape).process) {
                            (currentShape).process = applyFunctionFromName((currentShape).processName, apps);
                        }
                        //add the process function if defined by name only
                        if(!(currentShape).decide) {
                            (currentShape).decide = applyFunctionFromName((currentShape).decideName, apps);
                        }
                        //clear the nextShape as it is to be defined on decision
                        (currentShape).nextShape = null;
                        //call the decision function process function
                        (currentShape).process(data, (currentShape), function (error, crShape) {
                            //add the shape to the processed shape array
                            processedShapes.push(crShape);
                            //throw error if found
                            if(err) {
                                return callback(null, data, processedShapes);
                            }
                            nextTick(function () {
                                decisionWrapper(crShape);
                            });
                        });
                        break;

                    }
                    case "terminator": {
                        //add the shape to the processed shape array
                        processedShapes.push(currentShape);
                        //run the final callback for the terminator
                        return callback(null, data, processedShapes);
                        break;

                    }
                }
            }
        };        
        var decisionWrapper = function (wrDecision) {
            //set a default function to call the next process
            wrDecision.decide = wrDecision.decide || function (wrDecision, callback) {
                //set the next shape, if none found create a new terminator
                wrDecision.nextShape = wrDecision.nextShape || ((this.paths.length > 0) ? this.paths[0].nextShape : { "id": -1, "shapeType": "Terminator", "description": "End"});
                processWrapper(wrDecision.nextShape);
            };
            //call the decide function on the decision object passing the decision complete wrapper
            wrDecision.decide(data, wrDecision, decisionComplete);
        };
        //call the decision complete
        var decisionComplete = function (err, wrDecision) {
            if(!wrDecision.nextShape) {
                //find next shape
                var foundSelected = false;
                for(var x = 0; x < wrDecision.paths.length; x++) {
                    if(wrDecision.paths[x].selected) {
                        //show that a selected path has been found
                        foundSelected = true;
                        //first check to see if they have a nextShape defined
                        if(!wrDecision.paths[x].nextShape) {
                            //go find the id from
                            wrDecision.nextShape = findShapeById(wrDecision.paths[x].nextShapeId);
                        } else {
                            wrDecision.nextShape = wrDecision.paths[x].nextShape;
                        }
                        if(wrDecision.nextShape) {
                            break;
                        }
                    }
                }
            }
            if(!wrDecision.nextShape) {
                err = new Error("No following shape found! Check that if using nextShapeId that the id exists");
            }
            processWrapper(err, wrDecision.nextShape);
        };
        //find the path shapeid 
        var findShapeById = function (id) {
            //look through processed shapes first for speed
            for(var x = 0; x < processedShapes.length; x++) {
                //not found so start at the first shape and go through each until found
                if(processedShapes[x].id === id) {
                    return processedShapes[x];
                }
            }
            return findShapeByIdFromParent(processedShapes[0], id);
        };
        //find the path by shape id recursive function
        var findShapeByIdFromParent = function (parent, id) {
            switch(parent.shapeType.toLowerCase()) {
                case "entry": {
                    if((parent).nextShape.id === id) {
                        return (parent).nextShape;
                    }
                    return findShapeByIdFromParent((parent).nextShape, id);

                }
                case "operation": {
                    if((parent).nextShape.id === id) {
                        return (parent).nextShape;
                    }
                    return findShapeByIdFromParent((parent).nextShape, id);

                }
                case "decision": {
                    for(var x = 0; x < (parent).paths.length; x++) {
                        if((parent).paths[x].nextShape) {
                            if((parent).paths[x].nextShape.id === id) {
                                return (parent).paths[x].nextShape;
                            }
                            return findShapeByIdFromParent((parent).nextShape, id);
                        }
                    }

                }
                case "terminator": {
                        //run the final callback for the terminator
                    return null;

                }
            }
            return null;
        };
        //reviews the working context and applies the function based on a string
        var applyFunctionFromName = function (functionName, apps) {
            var context = (typeof apps === 'undefined') ? window : apps;
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            for (var i = 0; i < namespaces.length; i++) {
                context = context[namespaces[i]];
            }
            return context[func];
        };
        //call the process wrapper with the current shape
        processWrapper(null, currentShape);
    }
    decisionTree.execute = execute;
    
    //the following section was borrowed from async library [https://github.com/caolan/async]
    //****************************************************************************************
    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return decisionTree;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = decisionTree;
    }
     // included directly via <script> tag
    else {
        root.decisionTree = decisionTree;
    }
    //****************************************************************************************

}());
