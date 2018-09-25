<template>
      <div class="card mb-4 my-5 mx-5 px-3">

      <div class="card-body" v-if="isLoad">
        <h2 class="card-title text-center display-4">{{ article.title }}</h2>
        <p class="card-text">{{ article.description }}</p>
      </div>
      <div class="card-footer text-muted mb-5" v-if="isLoad">
        Posted on {{ created }} by {{ article.user.name }} &nbsp; <button class="btn btn-sm btn-ligth"><i class="far fa-thumbs-up"></i></button> ({{ article.upVote.length }})
        &nbsp; <button class="btn btn-sm btn-ligth"><i class="far fa-thumbs-down"></i></button> ({{ article.downVote.length }})
      </div>

      <div class="my-3" v-if="token && isLoad">
        <div class="form-group row">
          <div class="col-lg-5">
            <textarea class="form-control" rows="2" placeholder="Answer........." v-model="comment"></textarea>
            <br>
            <button type="button" class="btn btn-primary" @click="addComment">Answer</button>
          </div>
        </div>
      </div>

      <div class="card-footer text-muted mb-4" v-for="answer in article.answer" :key="answer._id" v-if="isLoad">
        <h6>{{ answer.user.name }}: </h6>
        <p>{{ answer.content }}</p>
        <button type="button" class="btn btn-xs btn-danger"><i class="fa fa-trash fa-sm"/></button>
        &nbsp;
        <button class="btn btn-sm btn-ligth"><i class="far fa-thumbs-up"></i></button> ({{ answer.upVote.length }})
        &nbsp;
        <button class="btn btn-sm btn-ligth"><i class="far fa-thumbs-down"></i></button> ({{ answer.upVote.length }})
      </div>

      <div class="loader text-center" v-if="!isLoad"></div>

    </div>
</template>

<script>
import axios from 'axios'

const baseUrl = 'http://localhost:3000'

export default {
  props: ['id'],
  data () {
    return {
      article: {},
      created: '',
      isLoad: false
    }
  },
  created () {
    let self = this

    axios({
      method: 'get',
      url: `${baseUrl}/question/${this.id}`
    })
      .then(response => {
        self.article = response.data
        self.created = new Date(response.data.createdAt).toLocaleDateString()
        self.isLoad = true
      })
      .catch(err => {
        console.log(err)
      })
  },
  watch: {
    id: function () {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/article/${this.id}`
      })
        .then(response => {
          self.article = response.data
          self.created = new Date(response.data.createdAt).toLocaleDateString()
          self.isLoad = true
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    }
  }
}
</script>

<style>
  .sidebar-title {
    font-size: 1.5rem;
  }

  .loader {
      border: 16px solid #f3f3f3; /* Light grey */
      border-top: 16px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 120px;
      height: 120px;
      animation: spin 2s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
</style>
