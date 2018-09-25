import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const baseUrl = 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    token: '',
    questions: [],
    user: {}
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    removeToken (state) {
      state.token = ''
    },
    setQuestion (state, question) {
      state.questions = question
    },
    setData (state, data) {
      state.user = data
    }
  },
  actions: {
    setToken (context, token) {
      context.commit('setToken', token)
    },
    removeToken (context) {
      context.commit('removeToken')
    },
    setQuestion (context, question) {
      context.commit('setQuestion', question)
    },
    checkToken (context, token) {
      axios({
        method: 'get',
        url: `${baseUrl}/users/auth`,
        headers: {
          token: token
        }
      })
        .then(response => {
          context.commit('setData', response.data)
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
})
