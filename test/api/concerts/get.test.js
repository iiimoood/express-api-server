const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {
  before(async () => {
    const testConOne = new Concert({
      performer: 'Performer 1',
      genre: 'Genre 1',
      price: 15,
      day: 1,
      image: 'image1.jpg',
    });
    await testConOne.save();

    const testConTwo = new Concert({
      performer: 'Performer 2',
      genre: 'Genre 2',
      price: 25,
      day: 1,
      image: 'image2.jpg',
    });
    await testConTwo.save();
  });
  it('/performer/:performer should return concerts searched by performer', async () => {
    const performer = 'Performer 2';
    const res = await request(server).get(
      `/api/concerts/performer/${performer}`
    );
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  it('/genre/:genre should return concerts searched by genre', async () => {
    const genre = 'Genre 1';
    const res = await request(server).get(`/api/concerts/genre/${genre}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  it('/price/:price_min/:price_max should return concerts searched by prices', async () => {
    const price_min = 15;
    const price_max = 25;

    const res = await request(server).get(
      `/api/concerts/price/${price_min}/${price_max}`
    );
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });
  it('/day/:day should return concerts searched by day', async () => {
    const day = 1;
    const res = await request(server).get(`/api/concerts/day/${day}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });
  after(async () => {
    await Concert.deleteMany();
  });
});
