const {Activity, conn} = require('../../src/db.js');
const {expect} = require('chai');

xdescribe('Activity Model', ()=>{
    before(()=> conn.authenticate()
    .catch((err)=>{
        console.error('unable to connect to database', err)
    }))
    describe('validators', ()=>{
        beforeEach(()=>Activity.sync({force:true}))
        describe('type of data', ()=>{
            it('show throw an error if season is different from winter, spring, autumn or summer', (done)=>{
                Activity.create({
                    name: 'Visitar el Coliseode Roma',
                    difficulty: 3,
                    duration: 3,
                    season: 'Primavera'
                })
                .then(()=> done(new Error('invalid input sintax for season')))
                .catch(()=> done())
            })
            it('it returns an error if type of duration is not an integer', (done)=>{
                Activity.create({
                    name:'Conocer la Caminito Bs As',
                    difficulty: 5,
                    duration:'re',
                    season:'Spring'
                })
                .then(()=> done(new Error('invalid input sintax for duration')))
                .catch(()=>done())
            })
            it('should return an error if duration contains a letter', (done)=>{
                Activity.create({
                    name:'Nadar en las playas del Caribe',
                    difficulty:3,
                    duration: '5 horas',
                    season:'Autumn'
                })
                .then(()=> done(new Error('Invalid input sintax for duration')))
                .catch(()=> done())
            })
            it('returns an error if type of difficulty is not an integer', (done)=>{
                Activity.create({
                    name:'Visitar las ruinas del Machu Pichu',
                    difficulty: 'dificult',
                    duration:12,
                    season:'Winter'
                })
                .then(()=> done(new Error('invalid input sintax for difficulty')))
                .catch(()=> done())
            })
            it('returns an error if duration is bigger than 5', (done)=>{
                Activity.create({
                    name:'Conocer el carnaval de Rio de Janeiro',
                    difficulty: 8,
                    duration: 13,
                    season:'Winter'
                })
                .then(()=>done(new Error('the maximum allowed value is 5')))
                .catch(()=> done())
            })
        })
        describe('Adding activities', ()=>{
            it('should add an activity', ()=>{
                return Activity.create({
                    name:'Visitar las cataratas del Iguazu',
                    difficulty: 5,
                    duration: 13,
                    season: 'Summer'
                })
                .then(()=>{
                    return Activity.findOne({where:{name:'Visitar las cataratas del Iguazu'}})
                })
                .then((a)=>{
                    expect(a).to.exist
                })
            })
            it('should set the values correctly', ()=>{
                 Activity.create({
                    name:'Conocer la torre Eiffel',
                    difficulty: 1,
                    duration:3,
                    season:'Winter'
                })
                .then((activity)=>{
                   expect(activity.name).to.equal('Conocer la torre eifel')
                })
                .catch((err)=> console.log(err))
            })            
        })
    })
})
