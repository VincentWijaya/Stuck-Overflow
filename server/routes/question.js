const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth')
const {question} = require('../middleware/isHim')

const questionController = require('../controllers/question')

/* GET users listing. */
router.get('/', questionController.getQuestion)

router.post('/', auth, questionController.postQuestion)

router.put('/:id', auth, question, questionController.updateQuestion)

module.exports = router;
