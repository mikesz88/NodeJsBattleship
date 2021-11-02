const rs = require('readline-sync');

class Game {
    constructor() {
        this.board = [['O','O','O'],['O','O','O'],['O','O','O']]
        this.shipCount = 2;
        this.shipsLocation = {
            ship1: [],
            ship2: [],
        }
        this.attackLog = [];
        this.coordinates = {
            a: 0,
            b: 1,
            c: 2,
            ['1']: 0,
            ['2']: 1,
            ['3']: 2,
        }
    }

    // functions
    startGame() {
        rs.keyIn('Press any key to start the game. ');
        this.placeShip(this.shipsLocation.ship1);
        this.placeShip(this.shipsLocation.ship2);
        this.playGame();
    }

    placeShip(ship) {
        const loc1 = Math.floor(Math.random()* this.board.length);
        const loc2 = Math.floor(Math.random()* this.board.length);
        if (this.board[loc1][loc2] === 'O') {
            ship.push([loc1,loc2]);
            this.board[loc1][loc2] = 'S';
        } else {
            this.placeShip(ship);
        }
    }

    playGame() {
        let attackAttempt = this.askForLocation()
        this.attack(attackAttempt);
    }

    askForLocation() {
        const location = rs.question('Enter a location to strike ie \'A2\'' , {
            limit: /^[abc][123]$/i,
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
            let column = this.coordinates[location[1]];
            if (this.board[row][column] === 'S') {
                this.shipCount--;
                this.board[row][column] = 'H';
                if (!this.shipCount) {
                    this.gameOver();
                } else {
                    console.log('Hit. You have sunk a battleship. 1 ship remaining.');
                    this.playGame()
                }
            } else {
                console.log('You have missed!');
                this.playGame();
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
