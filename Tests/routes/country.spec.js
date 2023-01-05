const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Country, conn } = require('../../src/db.js');

const agent = session(app);
const country = {
    id: 'ARG',
    name: 'Argentina',
    flag: 'https://flagcdn.com/w320/ar.png',
    region: 'Americas',
    capital: 'Buenos Aires',
    subregion: 'South America',
    area: 2780400,
    population: 45376763,
};

xdescribe('Country routes', () => {
    before(() => conn.authenticate()
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        }));
    beforeEach(() => Country.sync({})
        .then(() => Country.create(country)));
    describe('GET /countries', () => {
        it('should get 200', () =>
            agent.get('/countries').expect(200)
        );
    });
});
