var TestApp;
(function (TestApp) {
    //logs messages to the console
    TestApp.log = function (message) {
        console.log(message);
    };
    //add function
    function add(data, shape, callback) {
        try {
            var v = Number(shape.properties.value);
            if(isNaN(v)) {
                throw new Error("'" + v + "' is not a number");
            }
            data.a += shape.properties.value;
            callback(null, shape);
        } catch (e) {
            callback(e, shape);
        }
    }
    TestApp.add = add;
    //check value function
    function checkValue(data, shape, callback) {
        try  {
            if(data.a < loopVal) {
                shape.paths[0].selected = true;
                shape.paths[1].selected = false;
            } else {
                shape.paths[0].selected = false;
                shape.paths[1].selected = true;
            }
            callback(null, shape);
        } catch (e) {
            callback(e, shape);
        }
    }
    TestApp.checkValue = checkValue;
    //complete function
    function complete(err, result, processedShapes) {
        TestApp.log("result: " + result.a);
        TestApp.log("processing time: " + (new Date() - result.startDate) + " milliseconds");
    }
    TestApp.complete = complete;
})(TestApp || (TestApp = {}));
