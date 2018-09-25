const kue = require('kue')
  , queue = kue.createQueue()
  , nodemailer = require('nodemailer')
  , fs = require('fs')
  , path = require("path")
  , emailTemplate = fs.readFileSync(path.resolve(__dirname, './email.html'))

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
          user: 'setuck.overflow@gmail.com',
          pass: '.test123'
  }
})

module.exports = {
  register(emailUser, username, next) {
    let test =  {
        subject: 'Stuck Overflow'
      , title: 'Welcome to Stuck Overflow'
      , to: `${emailUser}`
      , from: 'setuck.overflow@gmail.com'
      , text: `Welcome to Stuck Overflow, ${username}!`
      , html: emailTemplate
    }

    queue.create('email', test).save( function(err){
      if( !err ) {
        transporter.sendMail(test, (err, info) => {
          if (err) {
            console.log(err.message)
          } else {
            console.log(info)
          }
        })
      }
    })
  }
}