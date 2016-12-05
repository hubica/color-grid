var PIXEL_SIZE = 25;
var GRID_SIZE = 21;

var mark, unmark, isMarked, resetGrid, colorOf;

(function () {

	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	var grid, queue = [];

	var debugSpeed;

	if (typeof window.localStorage !== 'undefined') {
		debugSpeed = parseInt(localStorage.getItem('debugSpeed'));

		if (isNaN(debugSpeed) === true) {
			debugSpeed = 100;
			localStorage.setItem('debugSpeed', debugSpeed);
		}
	}

	// fill a cell
	mark = function (x, y, color) {
		if (typeof x === 'undefined') {
			throw new Error('Argument x saknas');
		}

		if (typeof y === 'undefined') {
			throw new Error('Argument y saknas');
		}

		if (typeof x !== 'number') {
			throw new Error('Argument x måste vara en siffra');
		}

		if (typeof y !== 'number') {
			throw new Error('Argument y måste vara en siffra');
		}

		if (typeof color === 'undefined') {
			color = "black";
		}
		else {
			color = color.toLowerCase();
		}

		if (color === '#fff' || color === '#ffffff') {
			// normalisera vit så att vit färg alltid betyder unmarked
			color = 'white';
		}

		if (typeof grid[x] !== 'undefined' && typeof grid[x][y] !== 'undefined') {
			// grid[x][y] = true;

			queue.push({ x: x, y: y, state: color });

			ready();
		}
	}

	// return a cell to its original state
	unmark = function (x, y) {
		if (typeof x === 'undefined') {
			throw new Error('Argument x saknas');
		}

		if (typeof y === 'undefined') {
			throw new Error('Argument y saknas');
		}

		if (typeof x !== 'number') {
			throw new Error('Argument x måste vara en siffra');
		}

		if (typeof y !== 'number') {
			throw new Error('Argument y måste vara en siffra');
		}

		if (typeof grid[x] !== 'undefined' && typeof grid[x][y] !== 'undefined') {
			// grid[x][y] = false;

			queue.push({ x: x, y: y, state: "white" });

			ready();
		}
	}

	isMarked = function (x, y) {
		if (typeof x === 'undefined') {
			throw new Error('Argument x saknas');
		}

		if (typeof y === 'undefined') {
			throw new Error('Argument y saknas');
		}

		if (typeof x !== 'number') {
			throw new Error('Argument x måste vara en siffra');
		}

		if (typeof y !== 'number') {
			throw new Error('Argument y måste vara en siffra');
		}

		if (typeof grid[x] !== 'undefined' && typeof grid[x][y] !== 'undefined') {
			// ifall debug är igång så får vi kolla i kön ifall rutan är markerad eller inte
			if (queue.length > 0) {
				var foundAtIndex = -1;

				// vi letar upp den senaste ifall man kört mark(1,1);unmark(1,1);mark(1,1); så hittar den att den kommer vara true till slut
				for (var i = 0; i < queue.length; i++) {
					if (queue[i].x === x && queue[i].y === y) {
						foundAtIndex = i;
					}
				}

				if (foundAtIndex !== -1) {
					return queue[foundAtIndex].state !== 'white';
				}
			}

			return grid[x][y] !== 'white';
		}

		return false;
	}

	colorOf = function (x, y) {
		if (typeof x === 'undefined') {
			throw new Error('Argument x saknas');
		}

		if (typeof y === 'undefined') {
			throw new Error('Argument y saknas');
		}

		if (typeof x !== 'number') {
			throw new Error('Argument x måste vara en siffra');
		}

		if (typeof y !== 'number') {
			throw new Error('Argument y måste vara en siffra');
		}

		if (typeof grid[x] !== 'undefined' && typeof grid[x][y] !== 'undefined') {
			// ifall debug är igång så får vi kolla i kön ifall rutan är markerad eller inte
			if (queue.length > 0) {
				var foundAtIndex = -1;

				// vi letar upp den senaste ifall man kört mark(1,1);unmark(1,1);mark(1,1); så hittar den att den kommer vara true till slut
				for (var i = 0; i < queue.length; i++) {
					if (queue[i].x === x && queue[i].y === y) {
						foundAtIndex = i;
					}
				}

				if (foundAtIndex !== -1) {
					return queue[foundAtIndex].state;
				}
			}

			return grid[x][y];
		}

		// utanför rutnätet finns inga färger, ge null
		return null;
	}

	// clear grid
	resetGrid = function () {
		grid = [];
		queue = [];

		for (var x = 0; x < GRID_SIZE; x += 1) {
			grid[x] = [];

			for (var y = 0; y < GRID_SIZE; y += 1) {
				grid[x].push("white");
			}
		}

		draw();
	}

	function isDebugging() {
		var debug = document.getElementById('debugging');

		if (debug === null) {
			return false;
		}

		return debug.checked === true;
	}

	var timer = 0;

	function ready() {
		clearTimeout(timer)

		if (isDebugging() === true) {
			timer = setTimeout(draw, debugSpeed);
		}
		else {
			draw();
		}
	}

	var timerSet = false;
	function delayedDraw() {
		timerSet = false;

		draw(true);
	}

	function draw(force) {

		// wait 10ms before running function. stop all other attempts
		if (isDebugging() === false && force !== true) {

			if (timerSet === false) {
				timerSet = true;

				setTimeout(delayedDraw, 10);
			}

			return;
		}



		ctx.clearRect(0, 0, canvas.width, canvas.height);


		var point, color;

		if (isDebugging() === true) {
			if (queue.length > 0) {
				point = queue.shift();

				grid[point.x][point.y] = point.state;
			}
		}
		else {
			for (var q = 0; q < queue.length; q++) {
				point = queue[q];

				grid[point.x][point.y] = point.state;
			}

			queue = [];
		}

		//draw marked cells
		for (x = 0; x < GRID_SIZE; x += 1) {
			for (y = 0; y < GRID_SIZE; y += 1) {
				ctx.fillStyle = grid[x][y];
				ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
			}
		}

		ctx.fillStyle = "black";

		// draw grid x lines
		for (var x = 0; x <= PIXEL_SIZE; x += 1) {
			ctx.fillRect(x * PIXEL_SIZE, 0, 1, canvas.width);
		}
		// draw grid y lines
		for (var y = 0; y <= PIXEL_SIZE; y += 1) {
			ctx.fillRect(0, y * PIXEL_SIZE, canvas.height, 1);
		}

		if (queue.length > 0) {
			ready();
		}
	}


	var debugging = document.getElementById('debugging');
	var debugSpeedInput = document.getElementById('debug-speed');
	var debugSpeedContainer = document.getElementById('debug-speed-container');

	if (debugging !== null && debugSpeedInput !== null && debugSpeedContainer !== null) {
		debugging.addEventListener('change', function () {
			if (this.checked === true) {
				if (typeof window.localStorage !== 'undefined') {
					localStorage.setItem('debugMode', '1');
				}

				debugSpeedContainer.style.display = 'block';
			}
			else {
				if (typeof window.localStorage !== 'undefined') {
					localStorage.setItem('debugMode', '0');
				}

				debugSpeedContainer.style.display = 'none';
			}
		});

		debugSpeedInput.value = debugSpeed;
		debugSpeedInput.addEventListener('input', function () {
			var value = parseInt(this.value);

			if (isNaN(value) === true) {
				debugSpeed = 100;
			}
			else {
				debugSpeed = value;
			}

			if (typeof window.localStorage !== 'undefined') {
				localStorage.setItem('debugSpeed', debugSpeed);
			}
		});
	}

	if (typeof window.localStorage !== 'undefined') {
		if (localStorage.getItem('debugMode') === null) {
			localStorage.setItem('debugMode', '0');
		}

		if (localStorage.getItem('debugMode') === '1') {
			debugging.checked = true;
			debugSpeedContainer.style.display = 'block';
		}
	}
})();

// initialize grid
resetGrid();