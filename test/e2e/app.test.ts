import app from '../../src/app';
import supertest from 'supertest';
import { expect } from 'chai';

describe('Index Test', function () {
  let request: supertest.SuperAgentTest;
  before(function (done) {
    request = supertest.agent(app);
    done();
  });
  after(async function (done) {
    // shut down the Express.js server
    app.close();
    done();
  });

  it('should allow a GET to /', async function () {
    const res = await request.get('/').send();
    expect(res.status).to.equal(200);
    expect(res.text).equals(
      `Server running at http://localhost:${process.env.PORT}`
    );
  });
});
