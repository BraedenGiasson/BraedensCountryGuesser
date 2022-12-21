# Project Proposal

## ✒️Description 
When thinking of an idea for the final project, I realized I should probably combine my passions of geography and travel to make a game I would want to play. I decided to come up with a country guesser game, based on the European continent. The game consists of a player who was to guess the correct filled in country. The player has a guess out of 4 options, and the game will have a timer going for how long it takes the player to play the game. The goal of the game is to guess all countries correctly. Failure to guess a country correctly will result in +5secs on the timer and a loss of a life. The player will have 5 lives, and will end the game once all 5 lives have been depleted.
## 🕹️Gameplay

The game begins by the TitleScreenState, where the player will be able to choose a 'Play Game' option, which will take them to the CountrySelectionState, or a 'Previous Records' option, which would take them to a page showing record times and countries guessed. I also plan on implementing a similar background to that of Match 3, where it would show the game map, and at random times, a country would get filled in, while waiting for the player to select a choice. However, this would be an extra that I will implement, but maybe only after the submission date due to time constraints. 

Once the player goes into the game, they will be met with a couple of messages on how to play the game. They will then see that they have 5 lives, and a timer will start. The game will then transition into the CountrySelectionState, where the empty map will be shown, and a random country will be filled in Blue, alongside 4 option choices on the left hand side of the screen, indicating the country option choices. The Blue color indicates that it's the country the player is trying to guess. The player will either (haven't decided yet), use W & S to go between the country option choices, or will press 1,2,3, or 4, indicating the country choice. 

After the player chooses a country guess, if the guess is incorrect, the player will be taken to the IncorrectSelectionState. The player will lose a life, and the correct option will be shown. This will also will result in +5secs on the timer. The player can then press 'Enter' to continue to the next country guess (CountrySelectionState), and the country that they guessed incorrectly, will be colored in Red, indicating a wrong guess.

If the country guess is correct, the player will be taken to the CorrectSelectionState. The country will be filled in Green, representing a correct guess. A flagpole will also be planted on the correctly guess country. The game will then move onto the next country guess (CountrySelectionState). 

If the country to guess is the last country, and the player correctly guesses every country, they will be taken to the VictoryState. The VictoryState will show the time it took the player to guess all countries, the number of correctly guessed countries, and a cool message indicating success. The player will also have the option to 'Go to Main Menu', which would take them to the TitleScreenState, or a 'Play Again' option, which would take them into a new game.

If during the game, the player loses all their lives, they will be taken to the GameOverState, which would display the time the player played for, and the number of correctly guesses countries. The player will also have the option to 'Go to Main Menu', which would take them to the TitleScreenState, or a 'Play Again' option, which would take them into a new game.

Additionally, if time constraints allow (or after the submission date), I would like to implement a pause system, that would temporarily pause the game. I would also like to implement an optional reading of facts about a country when guessed.

## 📃Requirements

1. The player should see a faint europe map in the TitleScreenState
2. The player shall be able to switch between wanting to play the game, and see previous records
3. The player shall be able to click on the previous record button
4. The player shall be able to see a list of previous records they scored in other games
5. The player shall be able to click on the play game button
6. The player should see a couple of messages letting them know how to play the game
7. The player should be able to see the number of lives, and the timer on the top right of the screen
8. The player should be able to see a country filled in Blue
9. The player should be able to see a panel on the left with the possible countries to guess
10. The player should be able to select different countries in the panel, and a border should indicate the highlighted country option
11. The player shall press a button to guess a country
12. The game should determine whether the country was correctly guessed
13. The player shall be able to see the country now filled in Green
14. The player should be able to see a flagpole inserted on the country.
15. The player should be able to see their chosen option filled in green
16. The player shall see a message indicating a successful guess
17. The player shall see the country now filled in Red
18. The player should be able to see the country selection they guessed filled in Red
19. The player should be able to see the correct country selection bordered Green
20. The player shall see a life lost
21. The player shall see +5secs added to the timer
22. The player shall see a transition to the next country selection
23. The player shall see a transition to the victory screen
24. The player should be able to see a couple of messages on the victory screen, including the time and number of countries guesses
25. The player shall see 2 options to play again or return to the main menu
26. The player shall be able to switch between these 2 selection options
27. The player shall be taken into a new game if they want to play again
28. The player shall return to the TitleScreenState if they want to go to the main menu
29. The player shall see a transition to the game over screen
30. The player should be able to see a couple of messages on the game over screen, including the time and number of countries guesses
31. The player shall see 2 options to play again or return to the main menu
32. The player shall be able to switch between these 2 selection options
33. The player shall be taken into a new game if they want to play again
34. The player shall return to the TitleScreenState if they want to go to the main menu

## 🤖 State Diagram

![Game Prog Project - State Diagram](/READTHIS-images/Game%20Prog%20Project%20-%20State%20Diagram.png)

## 🗺️ Class Diagram

I'm not sure how correct my class diagram is, but below shows the class diagrams for the different states in the game.

![Game Prog Project - States Class Diagram](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Class%20Diagram%20-%20GameStates.png)

Below shows the class diagram for the game objects.

![Game Prog Project - Objects Class Diagram](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Class%20Diagram%20-%20GameObjects.png)

## 🧵 Wireframes

The below wireframes should give a very good understanding of how the game will look/feel. Some things might change in the end product however.

![Game Prog Project Proposal - Wireframe-TitleScreenState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-TitleScreenState.png)

![Game Prog Project Proposal - Wireframe-CountrySelectionState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-CountrySelectionState.png)

![Game Prog Project Proposal - Wireframe-CorrectSelectionState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-CorrectSelectionState.png)

![Game Prog Project Proposal - Wireframe-IncorrectSelectionState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-IncorrectSelectionState.png)

![Game Prog Project Proposal - Wireframe-VictoryState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-VictoryState.png)

![Game Prog Project Proposal - Wireframe-GameOverState](/READTHIS-images/Game%20Prog%20Project%20Proposal%20-%20Wireframe-GameOverState.png)

## 🎨 Assets

### 🖼️ Images

It was hard to find the correct images that I needed, however, I got them from multiple sources linked in the References section.

- [Europe continent background](https://www.pinterest.ca/pin/295267319301252618/)
- (Possibly) [Life](https://desoares.itch.io/heart-icon)

### ✏️ Fonts

All fonts were used from [Google Fonts](https://fonts.google.com/).

- [Roboto](https://fonts.google.com/specimen/Roboto)

### 🔊 Sounds

I don't have all the sounds yet, I'm still searching for the exact sounds I want, but when I find them, I will have a:

- Correct selection sound
- Incorrect selection sound
- Planting flag sound
- Loss of life sound
- Game track sound

## 📚 References

Map background: https://www.pinterest.ca/pin/295267319301252618/
Font: https://fonts.google.com/
Heart vector: https://www.vecteezy.com/vector-art/551966-heart-romantic-love-graphic
Light bulb vector: https://www.vecteezy.com/vector-art/6757562-light-bulb-icon 


## TODO


## What I want to implement in the future

1. Particles that come from the correct panel
2. Collection of collected flags that you can view in the country selection
3. A simple pause system that will pause the game
4. Level system (easy, medium, hard) where the guess options will vary accordingly 
5. Screen that you can pop up to learn a fact about the country to guess