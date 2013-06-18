/*
 * Worker2 constructor
 * 
 * USAGE:
 * var worker = new Worker2(script, onmessage, onerror);
 * 
 * PARAMETERS:
 * script - String of the URL of the script to use.
 * onmessage - Optional callback function used when the worker uses postMessage(). Will be passed two parameters: the data and the event object.
 * onerror - Optional callback function used when an error occurs in the worker. Will be passed one parameter: the event object.
 */
var Worker2 = function(script, onmessage, onerror) {
    if (typeof script != "string") {
        throw new Error("Invalid type. \"script\" must be a string.");
    }
    this.worker = new Worker(script);
    if (onmessage) {
        this.worker.onmessage = function(e) {
            onmessage(e.data, e);
        };
    }
    if (onerror) {
        this.worker.onerror = onerror;
    }
};

/*
 * worker2.terminate(), worker2.stop()
 * 
 * DESCRIPTION: Terminates the worker.
 */
Worker2.prototype.terminate = Worker2.prototype.stop = function() {
    this.worker.terminate();
};

/*
 * worker2.postMessage(data), worker2.post(data)
 * 
 * DESCRIPTION: Sends data to the worker.
 */
Worker2.prototype.postMessage = Worker2.prototype.post = function(data) {
    this.worker.postMessage(data);
};

/*
 * WorkerFunction constructor
 * 
 * USAGE:
 * var worker = new WorkerFunction(function, onmessage, onerror);
 * 
 * PARAMETERS:
 * script - Function to run in a worker thread. 
 * onmessage - Optional callback function used when the worker function returns a value. Will be passed two parameters: the data and the event object.
 * onerror - Optional callback function used when an error occurs in the worker. Will be passed one parameter: the event object.
 */
var WorkerFunction = function(func, onmessage, onerror) {
    var workerStr = "onmessage = function(e) {" + 
                     "     var params = e.data;" +
                     "     var result = workerFunction.apply(null, params);" +
                     "     postMessage(result);" +
                     "};";
    workerStr = "workerFunction = " + func.toString() + ";" + workerStr;
    var blobURL = new Blob([workerStr], {type: "text/javascript"});
    this.worker = new Worker(URL.createObjectURL(blobURL));
    if (onmessage) {
        this.worker.onmessage = function(e) {
            onmessage(e.data, e);
        };
    }
    if (onerror) {
        this.worker.onerror = onerror;
    }
};

/*
 * workerfunction.terminate(), workerfunction.stop()
 * 
 * DESCRIPTION: Terminates the worker.
 */
WorkerFunction.prototype.terminate = WorkerFunction.prototype.stop = function() {
    this.worker.terminate()
};

/*
 * workerfunction.postMessage(data), workerfunction.post(data)
 * 
 * DESCRIPTION: Sends data to the worker. This is how parameters are sent.
 */
WorkerFunction.prototype.postMessage = WorkerFunction.prototype.post = function(data) {
    if (!data) {
        data = [];
    }
    this.worker.postMessage(data);
};