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
            cells[x][y] = new Cell();
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

        /* If the given coordinates are an option, pushes the corresponding cell
         * onto the options array.
         */
        function checkOption(x, y) {
            if (cells[x] && cells[x][y] && !cells[x][y].visited) {
                options.push(cells[x][y]);
            }
        }

        checkOption(x, y + 1); // North (n)
        checkOption(x + 1, y); // East (e)
        checkOption(x, y - 1); // South (s)
        checkOption(x - 1, y); // West (w)

        if (options.length > 1) {
            // The next cell is chosen randomly from the possible options
            var nextCell = options[Math.floor(Math.random() * options.length)];

            if (cell.y < nextCell.y) {
                cell.walls.s = false;
                visit(nextCell, "n");
            } else if (cell.x > nextCell.x) {
                cell.walls.w = false;
                visit(nextCell, "e");
            } else if (cell.y > nextCell.y) {
                cell.walls.n = false;
                visit(nextCell, "s");
            } else if (cell.x < nextCell.x) {
                cell.walls.e = false;
                visit(nextCell, "w");
            }
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
}