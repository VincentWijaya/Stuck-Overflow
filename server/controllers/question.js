const Question = require('../models/Question')

class Controller {

    static getQuestion(req, res) {
        Question.find()
            .populate('user', '_id name email')
            .populate('upVote', '_id name email')
            .populate('downVote', '_id name email')
            // .populate({
            //     path: 'answer',
            //     select: '_id content user',
            //     populate: {
            //         path: 'user',
            //         select: '_id name email'
            //     }
            // })
            .then(questions => {
                res.status(200).json(questions)
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static postQuestion(req, res) {
        let newQuestion = {
            title: req.body.title,
            description: req.body.description,
            user: req.decoded.id
        }

        Question.create(newQuestion)
            .then(() => {
                res.status(201).json({message: 'Question created!'})
            })
            .catch(err => {
                res.status(500).json({error: err.message})
            })
    }

    static updateQuestion(req, res) {
        res.send('masuk')
    }

}

module.exports = Controller