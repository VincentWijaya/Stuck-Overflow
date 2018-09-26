const kue = require('kue')
  , queue = kue.createQueue()
  , nodemailer = require('nodemailer')
const CronJob = require('cron').CronJob

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
          user: 'setuck.overflow@gmail.com',
          pass: '.test123'
  }
})

new CronJob('5 * * * * *', function() {
  let job = queue.process('email', (job, done) => {
    sendMail(job.data, done)
  })
}, null, true, 'Asia/Jakarta');

function sendMail(emailOptions, done) {
  transporter.sendMail(emailOptions, (err, info) => {
    if (err) {
      console.log(err.message)
    } else {
      console.log(info)
      done()
    }
  })
}