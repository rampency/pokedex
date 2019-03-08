import Vue from 'vue'
import Router from 'vue-router'
import pokedex from '@/components/pokedex'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'pokedex',
      component: pokedex
    }
  ]
})
