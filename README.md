# [Project 7 - Mini Battleship](https://github.com/mikesz88/nodeCalcFinal)

You are going to create your own small version of the classic board game Battleship.

## Tech Used:
![JavaScript](https://camo.githubusercontent.com/93c855ae825c1757f3426f05a05f4949d3b786c5b22d0edb53143a9e8f8499f6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4a6176615363726970742d3332333333303f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661736372697074266c6f676f436f6c6f723d463744463145)

## Requirements: 
This is a console (NodeJS) based game.

**Part 1**

1. When the application loads print the text, "Press any key to start the game."

2. When the user presses the key, your code will randomly place two different ships in two separate locations on the board. Each ship is only 1 unit long (In the real game ships are 2+ in length).

3. The prompt will then say, "Enter a location to strike ie 'A2' "

4. The user will then enter a location. If there is a ship at that location the prompt will read, "Hit. You have sunk a battleship. 1 ship remaining."

5. If there is not a ship at that location the prompt will read, "You have missed!"

6. If you enter a location you have already guessed the prompt will read, "You have already picked this location. Miss!"

7. When both of the battleships have been destroyed the prompt will read, "You have destroyed all battleships. Would you like to play again? Y/N"

8. If "Y" is selected the game starts over. If "N" then the application ends itself.

**Part 2**

1. Re-write the code so that we use letters A-J and numbers 1-10. This will create a 100 unit grid.

2. The computer will now place multiple ships in this format:
   
   1. One two-unit ship
   2. Two three-unit ships
   3. One four-unit ship
   4. One five-unit ship

3. Keep in mind that your code cannot place two ships on intersecting paths

4. Ship placement should be random and not manually placed by you in the code

5. The game works as before, except now all ships must be destroyed to win

**Part 3**

* Instead of just printing "hit" or "miss" when you take a turn, have a GUI-based grid appear in the terminal. Uses O for your misses and use X for your hits. After every turn, the grid will re-print with the proper data.

**Part 4 - Multiplayer**

* Modify the game so you can play against the computer. When the game starts it will automatically position your ships. The computer will then position its own ships.

* After you attack and the regular printouts appear, the computer will then attack. It will tell you if you have been hit or missed. The game continues on until someone wins.

* Only print the grid for your team on each turn.


<hr>



