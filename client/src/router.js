import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: ':id',
          name: 'question-detail',
          props: true,
          component: () => import('./components/Detail.vue')
        }
      ]
    }
  ]
})
