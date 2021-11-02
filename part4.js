const rs = require('readline-sync');

class Game {
    constructor() {
        this.playerList = [];
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
        const user = new Player('user');
        const machine = new Computer('machine');
        this.playerList.push(user, machine);
        for (const player of this.playerList) {
            this.buildBoard(player);
            for (const ship of player.ships) {
                this.placeShip(player, ship);
            }
        }
        let findWinner = false;
        while (!findWinner) {
            for (const player of this.playerList) {
                findWinner = this.playGame(player); 
                if (findWinner) {
                    return this.gameOver(player)                       
                }
            }
        }
    }

    buildBoard(player) {
        let alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        for (const letter of alpha) {
            let array = [];
            for (let index = 1; index <= 10; index++) {
                array.push(letter+index.toString());
            }
            player.board.push([...array]);
            player.displayBoard.push([...array]);
        }

    }

    placeShip(player, ship) {
        let checker = false;
        let loc1, loc2, turn;
        while (!checker) {
            let row = Math.floor(Math.random() * player.board.length);
            let column = Math.floor(Math.random() * player.board.length);
            [loc1,loc2,turn, checker] = this.randomLocationChecker(player, ship, row, column);
        }
        if (turn === 'left') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1}${loc2 - index}`)
                player.board[loc1][loc2 - index] = 'S';
            }
        } else if (turn === 'right') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1}${loc2 + index}`)
                player.board[loc1][loc2 + index] = 'S';
            }
        } else if (turn === 'up') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1 - index}${loc2}`)
                player.board[loc1 - index][loc2] = 'S';
            }
        } else if (turn === 'down') {
            for (let index = 0; index < ship.count; index++) {
                ship.coordinates.push(`${loc1 + index}${loc2}`)
                player.board[loc1 + index][loc2] = 'S';
            }
        }
    }
    
    randomLocationChecker(player, ship, row, column) {
        let checker = false
        let turn;
        let randomDirection = Math.ceil(Math.random() * 4);
        if (randomDirection === 1) { // left
            for (let index = 0; index < ship.count; index++) {
                if (column - index < 0
                || player.board[row][column - index] === 'S' 
                || player.board[row][column - index] === undefined) {
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
                || player.board[row][column + index] === 'S' 
                || player.board[row][column + index] === undefined) {
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
                || player.board[row - index][column] === 'S' 
                || player.board[row - index][column] === undefined) {
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
                || player.board[row + index][column] === 'S' 
                || player.board[row + index][column] === undefined) {
                    checker = false;
                    return [row,column,turn,checker];
                }
            }
            checker = true;
            turn = 'down';
            return [row, column, turn,checker];
        }
    }

    playGame(player) {
        let attackAttempt;
        if (player.name === 'machine') {
            attackAttempt = player.computerAttack();
        } else {
            attackAttempt = this.askForLocation()
        }
        return this.attack(this.playerList, player, attackAttempt);
    }

    askForLocation() {
        const location = rs.question('Enter a location to strike ie \'A2\'' , {
            limit: /^[a-j][1-9]0?$/i,
            limitMessage: 'That is not a proper location. Try again.'
        })
        return location;
    }
    
    attack(playerList, user, location) {
        for (const player of playerList) {
            if (user.name != 'machine' && player.name != user.name) {
                if (user.attackLog.includes(location)) {
                    console.table(player.displayBoard);
                    console.log('You have already picked this location. Miss!');
                    return false;
                } else {
                    user.attackLog.push(location);
                    let row = this.coordinates[location[0].toLowerCase()];
                    let column = this.coordinates[location.slice(1)];
                    if (player.board[row][column] === 'S') {
                        player.board[row][column] = 'X';
                        player.displayBoard[row][column] = 'X';
                        return this.removeCoordinatesFromShip(this.playerList, user, row, column);
                    } else {
                        player.board[row][column] = 'O';
                        player.displayBoard[row][column] = 'O';
                        console.log('You have missed!');
                        console.table(player.displayBoard);
                        return false;
                    }
                }
            } else if (user.name === 'machine' && player.name != user.name) { // machine's turn
                if (user.attackLog.includes(location)) {
                    console.log('You have already picked this location. Miss!');
                    return false;
                } else {
                    user.attackLog.push(location);
                    let row = this.coordinates[location[0].toLowerCase()];
                    let column = this.coordinates[location.slice(1)];
                    if (player.board[row][column] === 'S') {
                        player.board[row][column] = 'X';
                        player.displayBoard[row][column] = 'X';
                        return this.removeCoordinatesFromShip(this.playerList, user, row, column);
                    } else {
                        player.board[row][column] = 'O';
                        player.displayBoard[row][column] = 'O';
                        console.log('Machine has missed!');
                        return false;
                    }
                }

            }
        }
    }
    
    removeCoordinatesFromShip(playerList, user, row, column) {
        for (const player of playerList) {
            if (user.name != 'machine' && player.name != user.name) {
                for (const ship of player.ships) {
                    if (ship.coordinates.find(ele => ele === `${row}${column}`)) {
                        let index = ship.coordinates.findIndex(ele => ele === `${row}${column}`);
                        ship.coordinates.splice(index,1);
                        if (ship.coordinates.length === 0) {
                            player.shipCount--;
                            if (!player.shipCount) {
                                console.table(player.displayBoard);
                                console.log(`Hit! You have sunk the last battleship!`);
                                return true;
                            } else {
                                console.log(`Hit. You have sunk a battleship. ${player.shipCount} ship remaining.`);
                                console.table(player.displayBoard);
                                return false;
                            }
                        } else {
                            console.log(`Hit! The ship is still standing! There are ${player.shipCount} remaining!`);
                            console.table(player.displayBoard);
                            return false;
                        }
                    }
                }

            } else if (user.name === 'machine' && player.name != user.name) { //machine
                for (const ship of player.ships) {
                    if (ship.coordinates.find(ele => ele === `${row}${column}`)) {
                        let index = ship.coordinates.findIndex(ele => ele === `${row}${column}`);
                        ship.coordinates.splice(index,1);
                        if (ship.coordinates.length === 0) {
                            player.shipCount--;
                            if (!player.shipCount) {
                                console.log(`Hit! Machine has sunk the last battleship!`);
                                return true;
                            } else {
                                console.log(`Hit. Machine has sunk a battleship. ${player.shipCount} ship remaining.`);
                                return false;
                            }
                        } else {
                            console.log(`Machine got a hit! The ship is still standing! There are ${player.shipCount} remaining!`);
                            return false;
                        }
                    }
                }
            }
        }
    }

    gameOver(player) {

        if (rs.keyInYN(`${player.name} has destroyed all the battleships. Would you like to play again?`)) {
            let anotherGame = new Game();
            anotherGame.startGame();
        } else {
            process.exit();
        }

    }

}

class Player {
    constructor (name) {
        this.name = name;
        this.board = [];
        this.displayBoard = [];
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
    }
}

class Computer extends Player {
    constructor (name) {
        super(name);
    }

    computerAttack() {
        const alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const numbers = ['1','2','3','4','5','6','7','8','9','10'];
        const row = alpha[Math.floor(Math.random() * alpha.length)];
        const column = numbers[Math.floor(Math.random() * numbers.length)];
        return `${row}${column}`;
    }
}

const newGame = new Game();

newGame.startGame()
