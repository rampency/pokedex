<template>
  <div class="container h-100">
  <b-dropdown id="ddown-right" right text="Search by " variant="secondary" class="btn m-2">   
    <b-dropdown-item v-for="option in Option.options" 
                        :key="option.value" 
                        :value="option.value"
                        @click="Option.selectedOption = option.value">
        {{option.text}}
      </b-dropdown-item>    
  </b-dropdown>
    <!-- Search form -->
    <div class="d-flex justify-content-center h-100" >
      <div class="searchbar">
        <input class="search_input" type="text" name="get" placeholder="Search..." v-on:keyup.enter="get"  v-model="message">
        <a href="#" class="search_icon"><i class="fas fa-search"></i></a>
      </div>
    </div>
    <!-- Pokedex -->
    <h1 id="title">{{ msg }}{{Option.selectedOption}}</h1>
    <div v-if="search" id="list" class ="card text-white bg-dark shadow-lg" style="max-width: 100rem; display: inherit; border-radius: 45px; padding: 10px;">
      <img :src=imageURI>
      <br>
      <span>{{this.pokeDescription}}</span>
      <br>
      <strong>Pokédex ID:</strong> <span>{{this.Pokemon.id}}</span>
      <br>
      <strong id="height">Height:</strong> <span>{{this.Pokemon.height/10}} Meter  <md-tooltip md-direction="right" style="color: white; font-size:14px"> {{ inFeet }} feet</md-tooltip></span>
      <br>
       <strong id="weight">Weight:</strong> <span>{{this.Pokemon.weight/10}} Kilograms <md-tooltip md-direction="right" style="color: white; font-size:14px"> {{ inPounds }} Pounds</md-tooltip></span>
      <br>
      <strong>Habitat:</strong>
      <span>{{this.Habitat.name}}</span>
      <br>
      <strong>Genus:</strong>
      <span>{{this.pokeGenus}}</span>
      <br>
      <strong>Evolved from:</strong> 
      <span v-if="EvolvedFrom" @click="getPokemonFromType(EvolvedFrom.name)"> <md-chip class="md-primary" md-clickable>{{this.EvolvedFrom.name}}</md-chip></span>
      <span v-else> None </span>
      <br>
      <strong v-if="this.PokemonTypes.length > 1">Types:</strong>
      <strong v-else>Type:</strong>
        <li v-for="(type, index) in this.PokemonTypes">
          <span v-if="index != 0">, </span><span>{{ type.type.name}}</span>
        </li>
    </div>
    <div v-if="searchType" id="list" class ="card text-white bg-dark shadow-lg" style="max-width: 100rem; display: inherit; border-radius: 45px; padding: 10px;">
      <strong>List of Type</strong>
      <span>{{this.Type.name}}</span>
      <br>
      <li v-for="(pokemon, index) in this.Type.pokemon">
         <span v-if="getPokeIDfromURL(pokemon.pokemon.url)" v-on:click="getPokemonFromType(pokemon.pokemon.name)"> <md-chip class="md-primary" md-clickable>{{ pokemon.pokemon.name }}</md-chip> </span>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pokedex',
  data () {
    return {
      msg: 'Input a Pokémon ',
      message: '',
      search: false,
      searchType: false,
      Pokemon: '',
      Type: '',
      PokemonTypes: [],
      Habitat: '',
      pokeDescription: '',
      pokeGenus: '',
      imageURI: '',
      EvolvedFrom: '',
      Option: {
        selectedOption: 'name',
        options: [
          {
            'value': 'name',
            'text': 'Name or Pokédex ID'
          },
          {
            'value': 'type',
            'text': 'Type'
          }
        ]
      }
    }
  },
  computed: {
    // a computed getter
    inFeet: function () {
      return (this.Pokemon.height / 3.048).toFixed(2)
    },
    inPounds: function () {
      return ((this.Pokemon.weight / 10) * 2.205).toFixed(2)
    }
  },
  methods: {
    get: function () {
      if (this.message) {
        console.log(this.Option.selectedOption)
        if (this.Option.selectedOption === 'type') {
          this.getType()
        } else {
          this.getPokemon()
        }
      }
    },
    getType: function () {
      let input = this.message.toLowerCase()
      let url = `https://pokeapi.co/api/v2/type/${input}/`
      // GET
      this.$http.get(url).then(response => {
        // get body data
        if (response.status === 200) {
          this.searchType = true
          this.search = false
          this.Type = response.body
          document.getElementById('title').innerHTML = `${this.Type.name}`.toUpperCase()
        }
      }, response => {
        // error callback
        if (response.status === 404) {
          this.search = false
          this.searchType = false
          document.getElementById('title').innerHTML = `${this.message} is not a Pokemon type`
        }
      })
    },
    getPokemon: function () {
      let input = this.message.toLowerCase()
      let url = `https://pokeapi.co/api/v2/pokemon/${input}/`
      // GET
      this.$http.get(url).then(response => {
        // get body data
        if (response.status === 200) {
          if (response.body.id < 152) {
            this.search = true
            this.searchType = false
            this.Pokemon = response.body
            this.imageURI = this.Pokemon.sprites.front_default
            this.PokemonTypes = response.body.types
            this.getPokemonSpecies(response.body.species.url)
            document.getElementById('title').innerHTML = `${this.Pokemon.name}`.toUpperCase()
          } else {
            this.search = false
            document.getElementById('title').innerHTML = `This Pokédex only supports Generation I `
          }
        }
      }, response => {
        // error callback
        if (response.status === 404) {
          this.search = false
          this.searchType = false
          document.getElementById('title').innerHTML = `${this.message} is not a Pokemon`
        }
      })
    },
    getPokemonSpecies: function (uri) {
      let url = uri
      // GET
      this.$http.get(url).then(response => {
        // get body data
        this.Habitat = response.body.habitat
        for (var genus of response.body.genera) {
          if (genus.language.name === 'en') {
            this.pokeGenus = genus.genus
          }
        }
        for (var text of response.body.flavor_text_entries) {
          if (text.language.name === 'en' && text.version.name === 'red') {
            this.pokeDescription = text.flavor_text
          }
        }
        if (response.body.evolves_from_species) {
          this.EvolvedFrom = response.body.evolves_from_species
        } else {
          this.EvolvedFrom = null
        }
      }, response => {
        // error callback
      })
    },
    getPokeIDfromURL: function (url) {
      var data = (url.match(/(\d+)/g) || [])
      console.log(parseInt(data[1]) < 151)
      return (parseInt(data[1]) < 151)
    },
    getPokemonFromType: function (name) {
      // `this` inside methods points to the Vue instance
      this.message = name
      this.Option.selectedOption = 'name'
      this.get()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}
.md-chip.md-clickable {
  background-color: #6610f2;
  margin: 2px;
}

a {
  color: #35495E;
}

body,html{
 height: 100%;
 width: 100%;
 margin: 0;
 padding: 0;
 background: #e74c3c !important;
 }

 .searchbar{
 margin-bottom: auto;
 margin-top: auto;
 height: 60px;
 background-color: #353b48;
 border-radius: 30px;
 padding: 10px;
 }

 .search_input{
 color: white;
 border: 0;
 outline: 0;
 background: none;
 width: 0;
 caret-color:transparent;
 line-height: 40px;
 transition: width 0.4s linear;
 }

 .searchbar:hover > .search_input{
 padding: 0 10px;
 width: 450px;
 caret-color:red;
 transition: width 0.4s linear;
 }

 .searchbar:hover > .search_icon{
 background: white;
 color: #e74c3c;
 }

 .search_icon{
 height: 40px;
 width: 40px;
 float: right;
 display: flex;
 justify-content: center;
 align-items: center;
 border-radius: 50%;
 color:white;
 }
 li {
  display:inline;
}
.btn {
  color: #353b48;
  position: absolute;
  right: 0;
}
</style>
