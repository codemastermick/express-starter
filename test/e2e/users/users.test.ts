import app from '../../../src/app';
import supertest from 'supertest';
import { expect } from 'chai';
import { StatusCodes } from 'http-status-codes';
import { decode } from 'jsonwebtoken';
import { PermissionFlag } from '../../../src/common/enums/common.permissionflag.enum';
import mongooseService from '../../../src/common/services/mongoose.service';
import { Jwt } from '../../../src/common/types/jwt';

let firstUserIdTest = '';
const firstUserBody = {
  email: `john.smith@fakemail.net`,
  password: 'super-good-password'
};
const duplicateUserBody = {
  email: `john.smith@fakemail.net`,
  password: 'my-amazing-password'
};

let accessToken = '';
let refreshToken = '';
const newFirstName = 'Bob';
const newFirstName2 = 'Joe';
const newLastName2 = 'Everyman';

describe('User and Auth Endpoint Tests', function () {
  let request: supertest.SuperAgentTest;
  let allTestsRun = false;
  before(function (done) {
    request = supertest.agent(app);
    done();
  });
  after(function (done) {
    // shut down the Express.js server, close our MongoDB connection, then tell Mocha we're done:
    app.close();
    if (allTestsRun) {
      mongooseService.shutdown();
    }
    done();
  });

  it('should allow a POST to /users', async function () {
    const res = await request.post('/users').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.id).to.be.a('string');
    firstUserIdTest = res.body.id;
  });

  it('should not allow creating a user with a duplicate email', async function () {
    const res = await request.post('/users').send(duplicateUserBody);
    expect(res.status).to.equal(400);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.error).to.be.a('string');
    expect(res.body.error).to.equal('User email already exists');
  });

  it('should not allow a user to be created with an invalid email', async function () {
    const res = await request
      .post('/users')
      .send({ email: 'invalid', password: 'valid-password' });
    expect(res.status).to.equal(400);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.a('string');
    const data = JSON.parse(res.body.message);
    expect(data).to.be.an('object');
    expect(data.value).to.equal('invalid');
    expect(data.msg).to.equal('Invalid value');
    expect(data.param).to.equal('email');
    expect(data.location).to.equal('body');
  });

  it('should not allow a user to be created with an invalid password', async function () {
    const res = await request
      .post('/users')
      .send({ email: firstUserBody.email, password: '123' });
    expect(res.status).to.equal(400);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.message).to.be.a('string');
    const data = JSON.parse(res.body.message);
    expect(data).to.be.an('object');
    expect(data.value).to.equal('123');
    expect(data.msg).to.equal('Must include password (5+ characters)');
    expect(data.param).to.equal('password');
    expect(data.location).to.equal('body');
  });

  it('should allow a POST to /auth', async function () {
    const res = await request.post('/auth').send(firstUserBody);
    expect(res.status).to.equal(201);
    expect(res.body).not.to.be.empty;
    expect(res.body).to.be.an('object');
    expect(res.body.accessToken).to.be.a('string');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
    const payload = decode(accessToken) as Jwt;
    console.log(JSON.stringify(payload));
    expect(payload.userId).to.equal(firstUserIdTest);
    expect(payload.refreshKey).to.be.an('object');
    expect(payload.permissionFlags).to.be.a('number');
    expect(payload.permissionFlags).to.equal(1);
  });

  describe('with a valid access token', async function () {
    it('should allow a GET from /users/:userId with an access token', async function () {
      const res = await request
        .get(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(200);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.be.a('string');
      expect(res.body._id).to.equal(firstUserIdTest);
      expect(res.body.email).to.equal(firstUserBody.email);
    });

    it('should not allow a GET to /users', async function () {
      const res = await request
        .get(`/users`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send();
      expect(res.status).to.equal(403);
    });

    it('should not allow a PATCH to /users/:userId', async function () {
      const res = await request
        .patch(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          firstName: newFirstName
        });
      expect(res.status).to.equal(403);
    });

    it('should not allow a PUT to /users/:userId with an nonexistent ID', async function () {
      const res = await request
        .put(`/users/i-do-not-exist`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: 'Marcos',
          lastName: 'Silva',
          permissionFlags: 256
        });
      expect(res.status).to.equal(404);
    });

    it('should not allow a PUT to /users/:userId trying to change the permission flags', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({
          email: firstUserBody.email,
          password: firstUserBody.password,
          firstName: 'Marcos',
          lastName: 'Silva',
          permissionFlags: 256
        });
      expect(res.status).to.equal(400);
      expect(res.body.errors).to.be.an('array');
      expect(res.body.errors).to.have.length(1);
      expect(res.body.errors[0]).to.equal(
        'User cannot change permission flags'
      );
    });

    it('should allow a PUT to /users/:userId/permissionFlags/2 for testing', async function () {
      const res = await request
        .put(`/users/${firstUserIdTest}/permissionFlags/2`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({});
      expect(res.status).to.equal(204);
    });

    it('should not allow a POST to /auth/refresh-token without a token', async function () {
      const res = await request
        .post('/auth/refresh-token')
        .set({ Authorization: `Bearer ${accessToken}` });
      expect(res.status).to.equal(400);
      expect(res.body).not.to.be.empty;
      expect(res.body).to.be.an('object');
      expect(res.body.errors[0]).to.be.a('string');
      expect(res.body.errors[0]).equals('Missing required field: refreshToken');
    });

    it('should not allow a POST to /auth/refresh-token without an access token', async function () {
      const res = await request.post('/auth/refresh-token');
      expect(res.status).to.equal(StatusCodes.UNAUTHORIZED);
      expect(res.body).to.be.an('object');
      expect(res.body.message).to.be.a('string');
      expect(res.body.message).to.equal(
        'You are not authorized to access this resource. Please try logging in first.'
      );
    });

    it('should not allow a POST to /auth/refresh-token without a valid Bearer key', async function () {
      const res = await request
        .post('/auth/refresh-token')
        .set({ Authorization: `foo bar` });
      expect(res.status).to.equal(StatusCodes.FORBIDDEN);
      expect(res.body).to.be.empty;
    });

    it('should not allow a POST to /auth/refresh-token without a valid Bearer value', async function () {
      const res = await request
        .post('/auth/refresh-token')
        .set({ Authorization: `Bearer foo` });
      expect(res.status).to.equal(403);
      expect(res.body).to.be.empty;
    });

    describe('with a new set of permission flags', function () {
      it('should allow a POST to /auth/refresh-token', async function () {
        const res = await request
          .post('/auth/refresh-token')
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({ refreshToken });
        expect(res.status).to.equal(201);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body.accessToken).to.be.a('string');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
      });

      it('should allow a PUT to /users/:userId to change first and last names', async function () {
        const res = await request
          .put(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send({
            email: firstUserBody.email,
            password: firstUserBody.password,
            firstName: newFirstName2,
            lastName: newLastName2,
            permissionFlags: PermissionFlag.APP_PERMISSION_A
          });
        expect(res.status).to.equal(204);
      });

      it('should allow a GET from /users/:userId and should have a new full name', async function () {
        const res = await request
          .get(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.be.a('string');
        expect(res.body.firstName).to.equal(newFirstName2);
        expect(res.body.lastName).to.equal(newLastName2);
        expect(res.body.email).to.equal(firstUserBody.email);
        expect(res.body._id).to.equal(firstUserIdTest);
      });

      // it('should allow a GET to /users with admin permissions', async function () {
      //   const res = await request
      //     .get('/users')
      //     .set({ Authorization: `Bearer ${accessToken}` })
      //     .send();
      //   expect(res.status).to.equal(200);
      //   expect(res.body).not.to.be.empty;
      //   expect(res.body).to.be.an('object');
      //   // expect(res.body[0].id).to.be.a('string');
      //   // expect(res.body[0].id).equals(firstUserIdTest);
      // });

      it('should allow a DELETE from /users/:userId', async function () {
        const res = await request
          .delete(`/users/${firstUserIdTest}`)
          .set({ Authorization: `Bearer ${accessToken}` })
          .send();
        allTestsRun = true;
        expect(res.status).to.equal(204);
      });
    });
  });

  // it('should block refreshing tokens if rate limit is hit', async function () {
  //   let res;
  //   for (let i = 0; i < 15; i++) {
  //     res = await request
  //       .post('/auth/refresh-token')
  //       .set({ Authorization: `Bearer ${accessToken}` })
  //       .send({ refreshToken });
  //     accessToken = res.body.accessToken;
  //     refreshToken = res.body.refreshToken;
  //   }
  //   if (res) {
  //     expect(res.status).to.equal(201);
  //     expect(res.body).not.to.be.empty;
  //     expect(res.body).to.be.an('object');
  //     expect(res.body.accessToken).to.be.a('string');
  //     expect(res.body.message).equals(
  //       'Too many requests, please try again after 15 minutes'
  //     );
  //   }
  // });
});
