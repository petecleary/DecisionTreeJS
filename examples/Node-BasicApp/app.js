var TestApp = exports;
(function (TestApp) {
    //logs messages to the console
    TestApp.log = function (message) {
        console.log(message);
    };
    //add function
    function add(data, shape, callback) {
        try {
            TestApp.log("*************");
            TestApp.log("add function called");
            TestApp.log("data.a=" + data.a);
            var v = Number(shape.properties.value);
            if(isNaN(v)) {
                throw new Error("'" + v + "' is not a number");
            }
            TestApp.log("adding: " + v);
            data.a += v;
            TestApp.log("data.a=" + data.a);
            callback(null, shape);
        } catch (e) {
            callback(e, shape);
        }
    }
    TestApp.add = add;
    //check value function
    function checkValue(data, shape, callback) {
        try  {
            TestApp.log("*************");
            TestApp.log("checkValue function called");
            TestApp.log("checking data.a (" + data.a + ") is less than shape.properties.decision (" + shape.properties.decision + ")");
            if(data.a < shape.properties.decision) {
                TestApp.log("data.a < shape.properties.decision selecting path[0]");
                shape.paths[0].selected = true;
                shape.paths[1].selected = false;
            } else {
                TestApp.log("data.a >= shape.properties.decision selecting path[1]");
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
        TestApp.log("*************");
        TestApp.log("complete function called");
        TestApp.log("error: " + err);
        TestApp.log("result: " + result.a);
        for(var x = 0; x < processedShapes.length; x++) {
            TestApp.log("processed Shape: " + processedShapes[x].description + " id:" + processedShapes[x].id);
        }
        TestApp.log("Processed shapes JSON");
        //TestApp.log(JSON.stringify(processedShapes));
    }
    TestApp.complete = complete;
})(TestApp || (TestApp = {}));
