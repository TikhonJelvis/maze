/* This script lets the user control various aspects of the maze being drawn. */
var maze = new Maze(80, 80);

window.onload = function () {
    var canvas = document.createElement("canvas"),
        context = canvas.getContext('2d'),
        gradient = context.createLinearGradient(0, 0, 401, 401);

    canvas.setAttribute("width", "401");
    canvas.setAttribute("height", "401");

    document.getElementById("mazeHolder").insertAdjacentElement("afterBegin",
                                                                canvas);
    gradient.addColorStop(0, "#000044");
    gradient.addColorStop(0.8, "#3366FF");

    function drawMaze(width, height) {
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, 401, 401);
        maze = new Maze(width, height);
        var step = 400 / Math.max(width, height);
        maze.draw(canvas, step, {wall : gradient, background : "#FFBB88"});
    }

    drawMaze(80, 80);
    
    // Controls:
    var widthInput = document.getElementById("width"),
        heightInput = document.getElementById("height"),
        drawButton = document.getElementById("draw"),
        solveButton = document.getElementById("solve");

    drawButton.onclick = function () {
        drawMaze(widthInput.value, heightInput.value);
    };

    solveButton.onclick = function () {
        maze.drawSolution(canvas);
    };
};