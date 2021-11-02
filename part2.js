const rs = require('readline-sync');

class Game {
    constructor() {
        this.board = [];
        this.shipCount = 5;
        this.ships = [
            {
                name: 'destroyer', 
                count: 5,
                coordinates: [],
            },
            {
                name: 'submarine',
                count: 4,
                coordinates: [],
            },
            {
                name: 'cruiser',
                count: 3,
                coordinates: [],
            },
            {
                name: 'battleship',
                count: 3,
                coordinates: [],
            },
            {
                name: 'carrier',
                count: 2,
                coordinates: [],
            },
        ];
        this.attackLog = [];
        this.coordinates = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4,
            f: 5,
            g: 6,
            h: 7,
            i: 8,
            j: 9,
            ['1']: 0,
            ['2']: 1,
            ['3']: 2,
            ['4']: 3,
            ['5']: 4,
            ['6']: 5,
            ['7']: 6,
            ['8']: 7,
            ['9']: 8,
            ['10']: 9,
        }
    }

    // functions
    startGame() {
        rs.keyIn('Press any key to start the game. ');
        this.buildBoard();
        for (const ship of this.ships) {
            this.placeShip(ship);
        }
        this.playGame();
    }

    buildBoard() {
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for (const letter of alpha) {
            let array = [];
            for (let index = 1; index <= 10; index++) {
                array.push(letter+index.toString());
            }
            this.board.push(array);
        }
    }

    placeShip(ship) {
        let checker = false;
        let loc1, loc2, turn;
        while (!checker) {
            let row = Math.floor(Math.random() * this.board.length);
            let column = Math.floor(Math.random() * this.board.length);
            [loc1,loc2,turn, checker] = this.randomLocationChecker(ship, row, column);
        }
        if (turn === 'left') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1}${loc2 - index}`)
                this.board[loc1][loc2 - index] = 'S';
            }
        } else if (turn === 'right') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1}${loc2 + index}`)
                this.board[loc1][loc2 + index] = 'S';
            }
        } else if (turn === 'up') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1 - index}${loc2}`)
                this.board[loc1 - index][loc2] = 'S';
            }
        } else if (turn === 'down') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1 + index}${loc2}`)
                this.board[loc1 + index][loc2] = 'S';
            }
        }
    }
    
    randomLocationChecker(ship, row, column) {
        let checker = false
        let turn;
        let randomDirection = Math.ceil(Math.random() * 4);
        if (randomDirection === 1) { // left
            for (let index = 0; index < ship.count; index++) {
                if (column - index < 0
                || this.board[row][column - index] === 'S' 
                || this.board[row][column - index] === undefined) {
                    checker = false;
                    return [row,column,turn,checker];
                }
            }
            checker = true;
            turn = 'left';
            return [row, column, turn, checker];
        } else if (randomDirection === 2) { // right
            for (let index = 0; index < ship.count; index++) {
                if (column + index > 9
                || this.board[row][column + index] === 'S' 
                || this.board[row][column + index] === undefined) {
                    checker = false;
                    return [row,column,turn,checker];
                }
            }
            checker = true;
            turn = 'right';
            return [row, column, turn,checker];
        } else if (randomDirection === 3) { // up
            for (let index = 0; index < ship.count; index++) {
                if (row - index < 0
                || this.board[row - index][column] === 'S' 
                || this.board[row - index][column] === undefined) {
                    checker = false;
                    return [row,column,turn,checker];
                }
            }
            checker = true;
            turn = 'up';
            return [row, column, turn,checker];
        } else if (randomDirection === 4) { // down
            for (let index = 0; index < ship.count; index++) {
                if (row+index > 9
                || this.board[row + index][column] === 'S' 
                || this.board[row + index][column] === undefined) {
                    checker = false;
                    return [row,column,turn,checker];
                }
            }
            checker = true;
            turn = 'down';
            return [row, column, turn,checker];
        }
    }

    playGame() {
        let attackAttempt = this.askForLocation()
        this.attack(attackAttempt);
    }

    askForLocation() {
        const location = rs.question('Enter a location to strike ie \'A2\'' , {
            limit: /^[a-j][1-9]0?$/i,
            limitMessage: 'That is not a proper location. Try again.'
        })
        return location;
    }
    
    attack(location) {
        if (this.attackLog.includes(location)) {
            console.log('You have already picked this location. Miss!');
            this.playGame();
        } else {
            this.attackLog.push(location);
            let row = this.coordinates[location[0].toLowerCase()];
            let column = this.coordinates[location.slice(1)];
            if (this.board[row][column] === 'S') {
                this.board[row][column] = 'H';
                this.removeCoordinatesFromShip(row,column);
            } else {
                console.log('You have missed!');
                this.playGame();
            }
        }
    }
    
    removeCoordinatesFromShip(row, column) {
        for (const ship of this.ships) {
            if (ship.coordinates.find(ele => ele === `${row}${column}`)) {
                let index = ship.coordinates.findIndex(ele => ele === `${row}${column}`);
                ship.coordinates.splice(index,1);
                if (ship.coordinates.length === 0) {
                    this.shipCount--;
                    if (!this.shipCount) {
                        this.gameOver();
                    } else {
                        console.log(`Hit. You have sunk a battleship. ${this.shipCount} ship remaining.`);
                        this.playGame();
                    }
                } else {
                    console.log(`Hit! The ship is still standing! There are ${this.shipCount} remaining!`);
                    this.playGame();
                }
            }
        }
    }

    gameOver() {
        if (rs.keyInYN('You have destroyed all battleships. Would you like to play again?')) {
            let anotherGame = new Game();
            anotherGame.startGame();
        } else {
            process.exit();
        }
    }

}

const newGame = new Game();

newGame.startGame()
