const express = require('express');
const router = express.Router();
const ConcertController = require('../controllers/concerts.controller');

router.get('/concerts', ConcertController.getAll);
router.get('/concerts/random', ConcertController.getRandom);
router.get('/concerts/:id', ConcertController.getById);
router.post('/concerts', ConcertController.postNew);
router.put('/concerts/:id', ConcertController.putChanged);
router.delete('/concerts/:id', ConcertController.deleteById);

module.exports = router;
