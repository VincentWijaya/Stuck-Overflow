const kue = require('kue')
  , queue = kue.createQueue()
  , emailTemplate = require('./emailTemplate')

kue.app.listen(3001)

module.exports = {
  register(emailUser, username) {
    let emailOptions =  {
        subject: `Thank you for register, ${username}`
      , title: 'Welcome to Stuck Overflow'
      , to: `${emailUser}`
      , from: 'setuck.overflow@gmail.com'
      , text: `Welcome to Stuck Overflow, ${username}!`
      , html: emailTemplate.register(username)
    }

    queue.create('email', emailOptions).save( function(err){
      if( !err ) {
        console.log('Job created!')
      }
    })
  },
  sendAnswer(emailUser, username, questionId, answerName) {
    let emailOptions =  {
        subject: `${answerName} just answer your question!`
      , title: `${answerName} answer your question`
      , to: `${emailUser}`
      , from: 'setuck.overflow@gmail.com'
      , text: `Someone answer your question, ${username}!`
      , html: emailTemplate.newAnswer(username, questionId, answerName)
    }

    queue.create('email', emailOptions).save( function(err){
      if( !err ) {
        console.log('Job created!')
      }
    })
  }
}