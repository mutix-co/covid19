const knex = require('knex');
const axios = require('axios');
const { convertStringToUnicode, encode32, JSONWebSecretBox } = require('jw25519');

describe('signature', () => {
  let sql;
  let server;
  let instance;
  let id;
  beforeAll(async () => {
    sql = await knex.init('signature');
    jest.doMock('../sql', () => sql);
    server = jest.requireActual('../server');
    server.listen();
    const { port } = server.address();
    const baseURL = `http://127.0.0.1:${port}/api/signature`;
    instance = axios.create({ baseURL });
  });

  afterAll(async () => {
    await new Promise((res) => sql.destroy(res));
    await new Promise((res) => server.close(res));
  });

  test('post', async () => {
    const { publicKey } = (new JSONWebSecretBox()).keyPair;
    const secretBox = new JSONWebSecretBox();
    const signature = convertStringToUnicode(JSON.stringify({
      realName: 'YUTING LIU',
      contactNumber: '0987123456',
      email: 'hi@mutix.co',
    }));

    const data = secretBox.encrypt(signature, publicKey);
    const result = await instance.post('/', { key: encode32(secretBox.keyPair.publicKey), data });
    expect(result.data).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{32}$/),
      timestamps: expect.any(Number),
    });
    id = result.data.id;
  });

  test('get', async () => {
    const result = await instance.get(`/${id}`);
    expect(result.data).toEqual({
      id: expect.stringMatching(/^[0-9a-f]{32}$/),
      timestamps: expect.any(Number),
    });
  });
});
