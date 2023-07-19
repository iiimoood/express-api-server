const express = require('express');
const router = express.Router();
const db = require('./../db');
const { v4: uuidv4 } = require('uuid');

router.route('/testimonials').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
  const randomIndex = Math.floor(Math.random() * db.testimonials.length);
  const randomTestimonial = db.testimonials[randomIndex];
  res.json(randomTestimonial);
});

router.route('/testimonials/:id').get((req, res) => {
  const { id } = req.params;
  const testimonial = db.testimonials.find((item) => item.id === Number(id));
  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ error: 'Testimonial not found' });
  }
});

router.route('/testimonials').post((req, res) => {
  const { author, text } = req.body;
  const id = uuidv4();

  const newTestimonial = {
    id,
    author,
    text,
  };

  db.testimonials.push(newTestimonial);
  res.status(201).json({ message: 'OK' });
});

router.route('/testimonials/:id').put((req, res) => {
  const { author, text } = req.body;
  const { id } = req.params;

  const updatedTestimonial = { id, author, text };
  const testimonialIndex = db.testimonials.findIndex((item) => item.id === id);

  if (!testimonialIndex) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }
  db.testimonials[testimonialIndex] = updatedTestimonial;
  res.json({ message: 'OK' });
});

router.route('/testimonials/:id').delete((req, res) => {
  const { id } = req.params;
  const testimonialIndex = db.testimonials.findIndex((item) => item.id === id);

  if (testimonialIndex !== -1) {
    db.testimonials.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

module.exports = router;
