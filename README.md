# Pokédex
Author: Vijay Gopal

Using the Pokeapi I made a web app using Node.js and Vue.js Framework. The app after it is launched can be viewed on http://localhost:8080/.

You can:
  - Search for Pokémon all of the original 151 Pokémon (Generation 1) based on Poké ID or Pokémon name
  - Search based on Pokémon Type or Type ID, which results in a list of Pokémon. Click on the individual chips to go to the more detailed view.

# Build Setup

``` bash
# Check to see if you have Node and npm installed, run the commands below and you should see an output. 
# If not install Node and npm for your operating system then continue.
node -v
v11.10.1
npm -v
6.7.0
#Go into the pokedex folder
cd pokedex
# install dependencies
sudo npm install
# start the server at localhost:8080
npm run start
```
### Overview and Featues

* [VueJS] - Library for building interactive web interfaces
* [Twitter Bootstrap] - UI boilerplate for modern web apps
* [node.js] - evented I/O for the backend

In the `index.html` file the app vue component is imported like this `<div id="app"></div>` which sets up the `App.vue` file which acts as a base page. The `vue-router` is used to handle the routing, so in `App.vue` you'll see ` <router-view></router-view>` handles all the calls made in the `src/router/index.js`.

The main chunk of the code is written in `src/components/pokedex.vue`.

Users can toggle between if they want to search by Type and Type Id or the actual Pokémon name and Pokémon Id. They enter all their searches in one place, and depending on their toggle choice the intial text will change from **Input a Pokémon name** to  **Input a Pokémon type** dynamically, which is a great feature of making single page applications with Vue. 

Users can also hover over the weight and height of Pokémon, to get the non-metric units. Some Pokémon have evovled from others, so you can click on chip to get the detailed view of what it evovled from.

##### Improvements that can be made
If there was more features like a more complicated search feature that supported partial searchs or searchs that made network requests as the user was typing to show suggestions, I would remove the search bar code and make it it's own component then import it into the `pokedex.vue` file.

Like wise the code used to display the detailed view of Pokémon could also be made into it's own component then imported to make it more manageable. 
