<template>
  <div class="my-5">
    <button type="button" class="btn btn-primary mb-3" v-if="token" data-toggle="modal" data-target="#addArticleModal">Ask Something</button>
    <h1>List Questions</h1>
    <div class="list-group">

      <div class="list-group-item" v-for="(question, index) in questions" :key="index">
        <router-link class="sidebar-title" :to="{ name: 'question-detail', params: {id: question._id} }">{{ question.title.substr(0, 16) }}......</router-link>
        <button type="button" class="btn btn-sm btn-danger">Delete</button>&nbsp;
        <button type="button" class="btn btn-sm btn-primary" data-toggle="modal" data-target="#editArticleModal">Edit</button>
      </div>
      <div class="loader" v-if="!isLoad"></div>

    </div>

    <!-- Modal Add Article -->
    <div class="modal fade" id="addArticleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Ask Question</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="title" required>
                </div>
                <div class="form-group">
                  <label for="content">Description:</label>
                  <textarea rows="8" cols="80" v-model="description" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Ask</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>

    <!-- Modal Edit Article -->
    <div class="modal fade" id="editArticleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Edit Question</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="titleEdit" required>
                </div>
                <div class="form-group">
                  <label for="content">Description:</label>
                  <textarea rows="8" cols="80" v-model="descriptionEdit" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>
          <!-- <div class="loader" v-if="!isLoadEdit"></div> -->
          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Edit Article</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const baseUrl = 'http://localhost:3000'

export default {
  name: 'sidebar',
  data () {
    return {
      title: '',
      description: '',
      titleEdit: '',
      descriptionEdit: '',
      isLoad: false
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    questions () {
      return this.$store.state.questions
    },
    user () {
      return this.$store.state.user
    }
  },
  created () {
    let self = this

    let token = localStorage.getItem('token') ? localStorage.getItem('token') : ''

    axios({
      method: 'get',
      url: `${baseUrl}/question`
    })
      .then(response => {
        self.$store.dispatch('setQuestion', response.data)
        self.isLoad = true
      })
      .catch(err => {
        console.log(err)
      })

    this.$store.dispatch('setToken', token)
  }
}
</script>

<style scoped>
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
