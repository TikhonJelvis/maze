/* Represents a maze. The maze is a path through a grid, with some of the grid's
 * walls missing. The dimensions of the grid (the width and height) are in terms
 * of these cells.
 */
function Maze(width, height) {
    var cells = [],
        visited = 0, // The number of cells already visited.
        solution = []; // The solution to the maze.
    
    for (var x = 0; x < width; x++) {
        cells[x] = [];
        for (var y = 0; y < height; y++) {
            cells[x][y] = new Cell(x, y);
        }
    }

    /* Gets all of the cells we can possibly go to next. If the second argument
     * is true, this takes walls into account when finding options, returning
     * only the options with no walls between them and the cell.
     */
    function getOptions(cell, walls) {
        var options = [];
        
        /* If the given coordinates are an option, pushes the corresponding 
         * cell onto the options array.
         */
        function checkOption(x, y) {
            if (walls) {
                if ((y < cell.y && cell.walls.n) ||
                    (x > cell.x && cell.walls.e) ||
                    (y > cell.y && cell.walls.s) ||
                    (x < cell.x && cell.walls.w)) {
                    return;
                }
            }   
                        
            if (cells[x] && cells[x][y] && !cells[x][y].visited) {
                options.push(cells[x][y]);
            }
        }

        checkOption(cell.x, cell.y - 1);
        checkOption(cell.x + 1, cell.y); 
        checkOption(cell.x, cell.y + 1); 
        checkOption(cell.x - 1, cell.y);

        return options;
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
        var options = getOptions(cell);

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

            options = getOptions(cell);
        }
    }

    var startX = Math.floor(Math.random() * width),
        startY = Math.floor(Math.random() * height);
    visit(cells[startX][startY]);

    /* Returns an array of cells that are a path from the cell specified in the
     * first two coordinates to the cell specified in the last two coordinates.
     */
    this.solve = function (startX, startY, endX, endY) {
        // Mark all cells as unvisited:
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                cells[x][y].visited = false;
            }
        }

        var solution = [],
            cell = cells[startX][startY],
            options = [];

        while ((cell.x != endX) || (cell.y != endY)) {
            cell.visited = true;
            options = getOptions(cell, true);

            if (options.length == 0) {
                cell = solution.pop();
            } else {
                solution.push(cell);
                cell = options[0];
            }
        }

        solution.push(cell);

        return solution;
    };
    
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
     * patterns as well.
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

        // Sets the right color:
        context.fillStyle = colors.wall;

        /* Returns the actual position of the cell in pixels. */
        function actualPosition(cell) {
            return [cell.x * step, cell.y * step];
        }

        var actualX = 0,
            actualY = 0,
            cell;
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                cell = cells[x][y];
                actualX = actualPosition(cell)[0];
                actualY = actualPosition(cell)[1];

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

        // Fill in a start and end block:
        context.fillStyle = colors.start;
        context.fillRect(1, 1, step - 1, step - 1);
        context.fillStyle = colors.end;
        context.fillRect((width - 1) * step + 1, (height - 1) * step + 1,
                         step - 1, step - 1);

        

        /* Draws the solution to the maze; does not draw the maze itself. The
         * specified color can also be a gradient or a pattern.
         */
        this.drawSolution = function (canvasId, color) {
            var canvas = document.getElementById(canvasId);
            color = color || "#DDDD66";

            try {
	        var context = canvas.getContext('2d');
            } catch (e) {
	        // We can't do anything if canvas isn't supported...
	        return;
            }

            // Now draw the solution:
            var solution = this.solve(0, 0, width - 1, height - 1);
            context.fillStyle = color;

            // Get rid of the start and end cells, we don't want to draw those:
            solution.pop();
            solution.shift();
            
            for (var i = 0; i < solution.length; i++) {
                var position = actualPosition(solution[i]);
                context.fillRect(position[0] + 1, position[1] + 1, step - 1,
                                 step - 1);
            }
        };
    };
}