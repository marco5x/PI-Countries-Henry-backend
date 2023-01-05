const {expect} = require('chai')
const session  = require('supertest-session')
const app = require('../../src/app.js')
const {Activity, conn} = require('../../src/db.js')

const agent = session(app)

xdescribe('Test routes /activities', ()=>{
    before(()=> conn.authenticate() 
    .catch((err)=>{
        console.error('unable to connect to the database', err)
    }))
    beforeEach(()=> Activity.sync({ }))
    describe('POST /activities', ()=>{
        it('it should responds with 200', ()=>
        agent.post('/activities')
        .send({name:'Conocer Mar del Plata', duration: 3, difficulty: 3, season: 'Winter', countryId:[
                {
                'id': 'ARG',
                'name': 'Argentina',
                'flag': 'https://restcountries.eu/data/arg.svg',
                'region': 'Americas',
                'capital': 'Buenos Aires',
                'subregion': 'South America',
                'area': 2780400,
                'population': 43590400,
                'activities': []
                }]
            })
            .expect(200)
        )
        it('creates an activity in database', ()=>{
            agent.post('/activities')
            .send({name: 'Visitar el avistaje de Ballenas en Chubut', duration: 3, difficulty: 3, season: 'Spring', countryId:[
                {
                'id': 'ARG',
                'name': 'Argentina',
                'flag': 'https://restcountries.eu/data/arg.svg',
                'region': 'Americas',
                'capital': 'Buenos Aires',
                'subregion': 'South America',
                'area': 2780400,
                'population': 43590400,
                'activities': []
                }]
            })
            .then(()=>{
                return Activity.findOne({
                    where:{
                        name:'museo'
                    }
                })
            })
            .then((act)=>{
                expect(act).to.exist
            })
        })
        it('returns an error if one of the properties expected was not send', ()=>{
            agent.post('/activities')
            .send({name:'Conocer el Obelisco', difficulty: 3, countryId:[
                {
                    'id': 'ARG',
                    'name': 'Argentina',
                    'flag': 'https://restcountries.eu/data/arg.svg',
                    'region': 'Americas',
                    'capital': 'Buenos Aires',
                    'subregion': 'South America',
                    'area': 2780400,
                    'population': 43590400,
                    'activities': []
                    }]
                })
            .expect(400)
        })
    })
})
