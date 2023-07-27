const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

router.route('/seats').get((req, res) => {
  res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
  const { id } = req.params;
  const seat = db.seats.find((item) => item.id === Number(id));

  if (seat) {
    res.json(seat);
  } else {
    res.status(404).json({ error: 'Seat not found' });
  }
});

router.route('/seats').post((req, res) => {
  const { day, seat, client, email } = req.body;
  const id = uuidv4();

  const isTaken = db.seats.some(
    (item) => item.day === day && item.seat === seat
  );

  if (isTaken) {
    res.status(409).json({ message: 'The slot is already taken...' });
  }

  const newSeat = {
    id,
    day,
    seat,
    client,
    email,
  };

  db.seats.push(newSeat);
  req.io.emit('seatsUpdated', db.seats);
  res.status(201).json({ message: 'OK' });
});

router.route('/seats/:id').put((req, res) => {
  const { day, seat, client, email } = req.body;
  const { id } = req.params;

  const updatedSeat = { id, day, seat, client, email };
  const seatIndex = db.seats.findIndex((item) => item.id === id);

  if (!seatIndex) {
    return res.status(404).json({ message: 'Seat not found' });
  }

  db.seats[seatIndex] = updatedSeat;
  res.json({ message: 'OK' });
});

router.route('/seats/:id').delete((req, res) => {
  const { id } = req.params;
  const seatIndex = db.seats.findIndex((item) => item.id === id);

  if (seatIndex !== -1) {
    db.seats.splice(seatIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Seat not found' });
  }
});

module.exports = router;
