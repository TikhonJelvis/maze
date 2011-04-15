/* Creates n random mazes of size width by height, and returns the average
 * length of their solutions where solution is defined as the path from the
 * upper left-hand corner (0, 0) to the lower right-hand corner (width - 1,
 * height - 1). n has to be a positive integer.
 */
function averageMazeSolutionLength(n, width, height) {
    var average = sample();
    
    for (var i = 1; i < n; i++) {
        average += sample(width, height);
    }

    return average / n;
}

/* Gets one sample point. */
function sample(width, height) {
    return (new Maze(width, height)).solve().length;
}

/* Returns the distribution of a random variable A where A is the length of a
 * solution to a maze minus the minimum length of a solution to a maze of that
 * size with the given width and height rounded down by the given step value.
 */
function getData(n, width, height, step) {
    var data = {},
        values = [],
        mean = 0,
        stdDev = 0,
        max = 0,
        minSize = width + height - 1,
        point;

    for (var i = 0; i < n; i++) {
        point = sample(width, height);

        point -= point % step;
        point -= minSize;
        data[point] = data[point] ? data[point] + 1 : 1;
    }

    for (i in data) {
        if (data.hasOwnProperty(i)) {
            data[i] /= n;
            values.push(data[i]);
            mean += data[i] * i;

            if (data[i] > max) {
                max = data[i];
            }
        }
    }
    
    for (i = 0; i < values.length; i++) {
        stdDev += Math.pow(values[i] - mean, 2);
    }

    stdDev = Math.sqrt(stdDev / n);

    return {raw : data, mean : mean, stdDev : stdDev, max : max};
}

$(function () {
    var holder = $("<div>"),
        plotDiv = $("<div>").css("width", 500).css("height", 250),
        statsDiv = $("<div>");

    $("body").append(plotDiv);
    $("body").append(statsDiv);

    /* Plots the distribution of n solutions to mazes of the specified width and
     * height. Also outputs the average of the data.
     */
    function plot(n, width, height) {
        // Now we get some data:
        var data = getData(n, width, height, 1),
            plotData = [];

        for (var i in data.raw) {
            plotData.push([i * 1, data.raw[i] * 1]);
        }
        
        var plot = $.plot(plotDiv, [{data : plotData,
                                     label : "Solution length",
                                     lines : {show : false},
                                     points : {show : true}},
                                    {data : [[data.mean, 0],
                                             [data.mean, data.max]],
                                     label : "Mean"}]);
        statsDiv.append("Mean: " + data.mean.toFixed(2) + "<br />");
        statsDiv.append("Standard deviation: " + data.stdDev.toFixed(2));
    }

    plot(1000, 10, 10);
});
