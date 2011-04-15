/* Creates n random mazes of size width by height, and returns the average
 * length of their solutions where solution is defined as the path from the
 * upper left-hand corner (0, 0) to the lower right-hand corner (width - 1,
 * height - 1). n has to be a positive integer.
 */
function averageMazeSolutionLength(n, width, height) {
    var average = sample();
    
    for (var i = 1; i < n; i++) {
        average += sample();
    }

    return average / n;
    
    /* Gets one sample point. */
    function sample() {
        return (new Maze(width, height)).solve().length;
    }
}

console.log(averageMazeSolutionLength(1000, 40, 40));