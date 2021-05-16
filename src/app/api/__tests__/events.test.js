const knex = require('knex');
const _ = require('lodash');
const axios = require('axios');
const {
  convertStringToUnicode, encode32, decode32, JSONWebSecretBox,
} = require('jw25519');

describe('events', () => {
  let sql;
  let server;
  let instance;
  let key;
  let secret;
  beforeAll(async () => {
    sql = await knex.init('events');
    jest.doMock('../../sql', () => sql);
    server = jest.requireActual('../../server');
    server.listen();
    const { port } = server.address();
    const baseURL = `http://127.0.0.1:${port}/api`;
    instance = axios.create({ baseURL });
    const { publicKey, secretKey } = (new JSONWebSecretBox()).keyPair;
    key = encode32(publicKey);
    secret = encode32(secretKey);
  });

  afterAll(async () => {
    await new Promise((res) => sql.destroy(res));
    await new Promise((res) => server.close(res));
  });

  test('post', async () => {
    const result = await instance.post('/events', { title: 'TEST', key });
    expect(result.data).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{32}$/),
      title: 'TEST',
    });
  });

  test('get', async () => {
    const result = await instance.get(`/events/${key}`);
    expect(result.data).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{32}$/),
      title: 'TEST',
    });
  });

  test('fetch', async () => {
    await _.reduce([1, 2, 3, 4], async (prev, idx) => {
      await prev;
      const secretBox = new JSONWebSecretBox();
      const signature = convertStringToUnicode(JSON.stringify({
        realName: `USER${idx}`,
        contactNumber: '0987123456',
        email: 'hi@mutix.co',
      }));

      const pkey = encode32(secretBox.keyPair.publicKey);
      const data = secretBox.encrypt(signature, decode32(key));
      await instance.post('/signature', { key, data: idx === 4 ? 'xxx' : `${pkey}:${data}` });
    }, Promise.resolve());

    const startAt = Math.round(Date.now() / 1000) - 10;
    const endAt = Math.round(Date.now() / 1000) + 10;
    const result = await instance.post(
      `/events/${key}/signatures`,
      { start_at: startAt, end_at: endAt, secret },
    );
    expect(result.data).toEqual({
      key,
      signatures: [{
        id: expect.stringMatching(/^[0-9a-f]{32}$/),
        data: '{"realName":"USER1","contactNumber":"0987123456","email":"hi@mutix.co"}',
        ips: '',
        timestamp: expect.any(Number),
      }, {
        id: expect.stringMatching(/^[0-9a-f]{32}$/),
        data: '{"realName":"USER2","contactNumber":"0987123456","email":"hi@mutix.co"}',
        ips: '',
        timestamp: expect.any(Number),
      }, {
        id: expect.stringMatching(/^[0-9a-f]{32}$/),
        data: '{"realName":"USER3","contactNumber":"0987123456","email":"hi@mutix.co"}',
        ips: '',
        timestamp: expect.any(Number),
      }, {
        id: expect.stringMatching(/^[0-9a-f]{32}$/),
        data: 'Decrypting failed',
        ips: '',
        timestamp: expect.any(Number),
      }],
    });
  });
});
