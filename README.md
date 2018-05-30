# cookies-for-victory
Second Student Javascript Assignment for SE102 at Ara Institute of Canterbury - Modding Basic Platform Game

The second assignment for SE102 involved taking the game files from Eloquent Javascript (3rd Ed, chapter 16 + 17 - http://eloquentjavascript.net/16_game.html) and modifying it to create our own version. This repository contains the work of both myself and my group mate, Thomas Baines.

The features we added were:
  * A HUD outside the canvas that also doubled as storage for data that needed to persist between levels
  * Lives (Start 3, Max 5) and Bonus Life pickups
  * Changed the aim of the level from collecting all the coins to reaching a Goal object
  * Added a respawn system instead of regenerating the level upon death
  * Checkpoints that alter the respawn position
  * A Timer that will end the level if it runs out, and Bonus Time pickups
  * An Evil Road Cone enemy that turns around at the edge of cliffs, can be killed from above, and drops a coin upon death
  * New animated sprites for both the player and the road cone
  
We also refactored the code a couple of times. The first time was before we started, altering the code from the initial layout (which made sense for the way it was being presented in the book) to a more structured class layout. The second refactor split some code we had written into more sensible chunks, and also took the remaining loose code from the initial layout and turned it into a GameEngine class to make things a little tidier.

Features we wanted to add, but didn't have time for (especially since we had obtained more than 100% for the assignment) included:
  * Sounds
  * Power Ups (Double Jump, Lava Jump, One Use Armour)
  * Start and End screens
  * Level Select
