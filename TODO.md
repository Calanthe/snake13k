### GLITCHES:

- [ ] make glitches visible (background colour change or blinking/overflowing pixels)
  - [ ] background colour change
  - [ ] blinking pixels
  - [ ] overflowing pixels of glitches snake
- [ ] random walls shouldn't have totally random positions
  - [ ] make them stick to exiting wall
  - [x] or make them poop out of snake tail
- [ ] glitched walls shouldn't show at random moments
  - [ ] show it when apple is eaten in special way (from one side?)
  - [ ] show it when apple on a wall is eaten?
- [ ] apple on a wall glitch improvements
  - [ ] if regular apple gets randomly on wall it works as glitches (no special glitched apples)
  - [ ] snake that eats apple on a wall can then move through walls or eat walls until eating normal apple
  - [ ] if apples are too rare on walls maybe make probability a bit bigger (still random)
- [ ] fix issue with apple in the corner
  - [ ] don't show apples there
  - [ ] or let snake go through walls
  - [ ] or let snake eat walls
  - [ ] or if allow snake going outside and around the border? (still needs a hole to get out)
  - [ ] or make a 'joystick' point that lets snake move apples (?)
  - [ ] or hide walls in tron mode and let eat that apple in tron mode (after eating that apple still need to move through walls not to kill itself)
- [x] don't render apple on snake or buggy bug
  - [ ] or make apple on snake eatable with some nice bonus or another glitch? ;)


### TRON MODE:
- [ ] score one point for every piece grown in tron mode
- [ ] eating 'buggy bug' gives 10 points at once and after growing snake by 10 elements it enters tron mode and gives one point every step
- [ ] hide walls in tron mode (this will help eating apples on corners), but buggy(tron) bug has to show up randomly even if apple is not eaten
- [ ] give a tron bug some tron bike icon
- [ ] **BUG** there is possibly a bug that if snake eats apples during tron mode (or while it's getting smaller) they will not add to its length (they don't change prevLength)

### GAME FEATURES:

- [ ] make speed change after couple of apples eaten (10?)
- [ ] some welcome screen / menu / game over with ability to restart the game
- [ ] bonus bugs (regular bugs that show for short time for bonus points)
  - [ ] one of them will be buggy(tron) bug
- [ ] sounds
  - [ ] eating, game over, glitches?
- [ ] better score board
  - [ ] remove length count
  - [ ] move scores on top of the board
  - [ ] draw pixel numbers for score
  - [ ] countdown for bugs
  - [ ] make it possible to get there with a snake?
- [ ] mobile controls


### CODE:

- [ ] TODOs from code
- [ ] move paint walls together with rest of paint (maybe separate Renderer object?)
- [ ] refactor game state objects to keep them together
- [ ] clean up the code of tron mode and other quick and dirty prototyping
- [x] store board size instead of computing canvas / cell

### BUILD:

- [ ] add build to
  - [ ] uglify script
  - [ ] copy files and zip them
  - [ ] check size of package
- [ ] maybe inline styles and script into HTML template to save some bytes?
