const Concert = require('../models/concert.model');
const sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    res.json(await Concert.find({}));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const con = await Concert.findOne().skip(rand);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.postNew = async (req, res) => {
  try {
    const performer = sanitize(req.body.performer);
    const genre = sanitize(req.body.genre);
    const price = sanitize(req.body.price);
    const day = sanitize(req.body.day);
    const image = sanitize(req.body.image);

    const newConcert = new Concert({
      performer: performer,
      genre: genre,
      price: price,
      day: day,
      image: image,
    });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.putChanged = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;

  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      con.performer = performer;
      con.genre = genre;
      con.price = price;
      con.day = day;
      con.image = image;
      const updatedCon = await con.save();
      res.json({ message: 'OK', concert: updatedCon });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK', concert: con });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getByPerformer = async (req, res) => {
  try {
    const con = await Concert.find({ performer: req.params.performer });
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const con = await Concert.find({ genre: req.params.genre });
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getByPrices = async (req, res) => {
  try {
    const con = await Concert.find({
      price: {
        $gte: Number(req.params.price_min),
        $lte: Number(req.params.price_max),
      },
    });
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getByDay = async (req, res) => {
  try {
    const con = await Concert.find({ day: Number(req.params.day) });
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
