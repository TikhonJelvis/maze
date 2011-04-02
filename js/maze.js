/* Represents a maze. The maze is a path through a grid, with some of the grid's
 * walls missing. The dimensions of the grid (the width and height) are in terms
 * of these cells.
 */
function Maze(width, height) {
    var cells = [];
    var visited = 0; // The number of cells already visited.
    
    for (var x = 0; x < width; x++) {
        cells[x] = [];
        for (var y = 0; y < height; y++) {
            cells[x][y] = new Cell(x, y);
        }
    }

    /* Visits each unvisited cell, starting with the given one, randomly
     * traveling to adjacent cells and knocking out the walls between them to
     * create the maze. The optional direction argument is the direction the
     * visit _came from_. That is, if you visit cell (1, 2) from cell (0, 2),
     * the direction would be "e" (east).
     */
    function visit(cell, direction) {
        cell.visited = true;
        if (direction) {
            cell.walls[direction] = false;
        }

        //Get the possible options for going forward:
        var options = [];

        function getOptions() {
            options = [];
            
            /* If the given coordinates are an option, pushes the corresponding 
             * cell onto the options array.
             */
            function checkOption(x, y) {
                if (cells[x] && cells[x][y] && !cells[x][y].visited) {
                    options.push(cells[x][y]);
                }
            }

            checkOption(cell.x, cell.y - 1);
            checkOption(cell.x + 1, cell.y); 
            checkOption(cell.x, cell.y + 1); 
            checkOption(cell.x - 1, cell.y); 
        }

        getOptions();
        while (options.length > 0) {
            // The next cell is chosen randomly from the possible options
            var index = Math.floor(Math.random() * options.length);
            var nextCell = options[index];
            
            if (cell.y > nextCell.y) {
                cell.walls.n = false;
                visit(nextCell, "s");
            } else if (cell.x < nextCell.x) {
                cell.walls.e = false;
                visit(nextCell, "w");
            } else if (cell.y < nextCell.y) {
                cell.walls.s = false;
                visit(nextCell, "n");
            } else if (cell. x > nextCell.x) {
                cell.walls.w = false;
                visit(nextCell, "e");
            }

            getOptions();
        }
    }

    var startX = Math.floor(Math.random() * width);
    var startY = Math.floor(Math.random() * height);
    visit(cells[startX][startY]);

    /* A cell in the maze. This cell has some number of walls. */
    function Cell(x, y) {
        // The location of the cell:
        this.x = x;
        this.y = y;
        
        // The walls of this cell.
        this.walls = {
            n : true,
            e : true,
            s : true,
            w : true
        };

        // Have we gone through this cell yet?
        this.visited = false;
    }    

    /* Draws the maze on the canvas with the given id. The step size determines 
     * how tall each cell is. You can pass in an object to control various
     * colors in the maze; this object can contain fields for the wall color,
     * the background color, the start color and the end color. Each field
     * should be named for the first word of what it controls ("wall", "start"
     * and so on). These colors are actually styles, so they can be gradients or
     * patterns as well, but this may not work perfectly.
     */
    this.draw = function (canvasId, step, colors) {
        var canvas = document.getElementById(canvasId);
        step = step || 10;
        colors = colors || {};
        colors.wall = colors.wall || "#3366FF";
        colors.background = colors.background || "#FFFFFF";
        colors.start = colors.start || "#33FF66";
        colors.end = colors.end || "#FF6633";

        try {
	    var context = canvas.getContext('2d');
        } catch (e) {
	    // We can't do anything if canvas isn't supported...
	    return;
        }

        // Draw the background first:
        context.fillStyle = colors.background;
        context.fillRect(0, 0, width * step + 1, height * step + 1);

        // Fill in a start and end block:
        context.fillStyle = colors.start;
        context.fillRect(1, 1, step, step);
        context.fillStyle = colors.end;
        context.fillRect((width - 1) * step, (height - 1) * step, step, step);

        // Sets the right color:
        context.fillStyle = colors.wall;

        var actualX = 0;
        var actualY = 0;
        var cell;
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                actualX = x * step;
                actualY = y * step;
                cell = cells[x][y];

                if (cell.walls.n) {
                    context.fillRect(actualX, actualY, step, 1);
                }
                if (cell.walls.e) {
                    context.fillRect(actualX + step, actualY, 1, step);
                }
                if (cell.walls.s) {
                    context.fillRect(actualX, actualY + step, step, 1);
                }
                if (cell.walls.w) {
                    context.fillRect(actualX, actualY, 1, step);
                }
            }
        }
    };
}