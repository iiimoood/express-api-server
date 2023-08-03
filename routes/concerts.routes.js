const express = require('express');
const router = express.Router();
 const { v4: uuidv4 } = require('uuid');

router.route('/concerts').get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
  const { id } = req.params;
  const concert = db.concerts.find((item) => item.id === Number(id));
  if (concert) {
    res.json(concert);
  } else {
    res.status(404).json({ error: 'Concert not found' });
  }
});

router.route('/concerts').post((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const id = uuidv4();

  const newConcert = {
    id,
    performer,
    genre,
    price,
    day,
    image,
  };

  db.concerts.push(newConcert);
  res.status(201).json({ message: 'OK' });
});

router.route('/concerts/:id').put((req, res) => {
  const { performer, genre, price, day, image } = req.body;
  const { id } = req.params;

  const updatedConcert = { id, performer, genre, price, day, image };
  const concertIndex = db.concerts.findIndex((item) => item.id === id);

  if (!concertIndex) {
    return res.status(404).json({ message: 'Concert not found' });
  }
  db.concerts[concertIndex] = updatedConcert;
  res.json({ message: 'OK' });
});

router.route('/concerts/:id').delete((req, res) => {
  const { id } = req.params;
  const concertIndex = db.concerts.findIndex((item) => item.id === id);

  if (concertIndex !== -1) {
    db.concerts.splice(concertIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Concert not found' });
  }
});

module.exports = router;
