<template>
      <div class="card mb-4 my-5 mx-5 px-3">

      <div class="card-body" v-if="isLoad">
        <h2 class="card-title text-center display-4">{{ article.title }}</h2>
        <p class="card-text">{{ article.description }}</p>
      </div>
      <div class="card-footer text-muted mb-5" v-if="isLoad">
        Posted on {{ created }} by {{ article.user.name }}
        &nbsp; <button class="btn btn-sm btn-ligth" v-if="token && !hisQuestion" @click="upVote(article._id)"><i class="far fa-thumbs-up"></i></button> <i class="far fa-thumbs-up" v-else></i> ({{ article.upVote.length }})
        &nbsp; <button class="btn btn-sm btn-ligth" v-if="token && !hisQuestion" @click="downVote(article._id)"><i class="far fa-thumbs-down"></i></button> <i class="far fa-thumbs-down" v-else></i> ({{ article.downVote.length }})
      </div>

      <div class="my-3" v-if="token && isLoad">
        <div class="form-group row">
          <div class="col-lg">
            <textarea class="form-control" rows="3" placeholder="Answer........." v-model="answer"></textarea>
            <br>
            <button type="button" class="btn btn-primary" @click="postAnswer(article._id)">Answer</button>
          </div>
        </div>
      </div>

      <div class="card-footer text-muted mb-4" v-for="answer in article.answer" :key="answer._id" v-if="isLoad">
        <h6>{{ answer.user.name }}: </h6>
        <p>{{ answer.content }}</p>
        <button type="button" class="btn btn-xs btn-ligth" data-toggle="modal" data-target="#editAnswerModal" v-if="token && answer.isHim" @click="setAnswerData(answer)"><i class="fas fa-pencil-alt"></i></button>
        &nbsp;
        <button class="btn btn-sm btn-ligth" v-if="token && !answer.isHim" @click="upVoteAnswer(answer._id)"><i class="far fa-thumbs-up"></i></button> <i class="far fa-thumbs-up" v-else></i> ({{ answer.upVote.length }})
        &nbsp;
        <button class="btn btn-sm btn-ligth" v-if="token && !answer.isHim" @click="downVoteAnswer(answer._id)"><i class="far fa-thumbs-down"></i></button> <i class="far fa-thumbs-down" v-else></i> ({{ answer.downVote.length }})
      </div>

      <div class="loader" v-if="!isLoad"></div>

      <!-- Modal Edit Article -->
      <div class="modal fade" id="editAnswerModal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Edit Answer</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

            <!-- Modal body -->
            <div class="modal-body">

              <div class="container">
                <form>
                  <div class="form-group">
                    <label for="title">Answer:</label>
                    <div class="col-lg">
                      <textarea class="form-control" rows="3" v-model="answerEditContent"></textarea>
                    </div>
                  </div>
                </form>

              </div>

            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-dismiss="modal" @click="updateAnswer">Edit Answer</button>
              <button type="button" class="btn btn-danger" data-dismiss="modal" @click="isLoadEdit = false">Close</button>
            </div>

          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

const baseUrl = 'https://api-stuck-overflow.skinborderevent.ml'

export default {
  props: ['id'],
  data () {
    return {
      article: {},
      created: '',
      isLoad: false,
      answer: '',
      hisQuestion: false,
      answerEditContent: '',
      answerId: ''
    }
  },
  created () {
    this.getArticle()
  },
  watch: {
    id: function () {
      this.getArticle()
    },
    editStat () {
      this.getArticle()
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    },
    editStat () {
      return this.$store.state.editStat
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    getArticle () {
      let self = this

      axios({
        method: 'get',
        url: `${baseUrl}/question/${this.id}`
      })
        .then(response => {
          self.$store.dispatch('getQuestion')

          if (response.data.user._id === self.user.id) {
            self.hisQuestion = true
          } else {
            self.hisQuestion = false
          }

          response.data.answer.forEach(data => {
            if (data.user._id === self.user.id) {
              data['isHim'] = true
            } else {
              data['isHim'] = false
            }
          })

          self.article = response.data
          self.created = new Date(response.data.createdAt).toLocaleDateString()
          self.isLoad = true

          self.$store.dispatch('removeEditStat')
        })
        .catch(err => {
          console.log(err)
        })
    },
    upVote (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/question/upvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    downVote (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/question/downvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
        })
        .catch(err => {
          console.log(err)
        })
    },
    postAnswer (id) {
      let self = this

      axios({
        method: 'post',
        url: `${baseUrl}/answer/${id}`,
        headers: {
          token: this.token
        },
        data: {
          content: this.answer
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
          self.answer = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    setAnswerData (data) {
      this.answerEditContent = data.content
      this.answerId = data._id
    },
    updateAnswer () {
      let self = this

      axios({
        method: 'put',
        url: `${baseUrl}/answer/${this.answerId}`,
        headers: {
          token: this.token
        },
        data: {
          content: this.answerEditContent
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err)
        })
    },
    upVoteAnswer (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/answer/upvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    downVoteAnswer (id) {
      let self = this

      axios({
        method: 'patch',
        url: `${baseUrl}/answer/downvote/${id}`,
        headers: {
          token: this.token
        }
      })
        .then(() => {
          self.getArticle()
          self.$store.dispatch('getQuestion')
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }// method
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
      margin: 0 auto;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
</style>
