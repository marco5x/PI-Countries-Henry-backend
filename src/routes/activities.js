const server = require('express').Router();
const { Country, Activity } = require('../db.js');
/* POST /activity:
Recibe los datos recolectados desde el formulario controlado de la ruta de 
creación de actividad turística por body
Crea una actividad turística en la base de datos
*/
server.post('/', async (req, res) => {
    const { name, difficulty, duration, season, countryId } = req.body
    //console.log(req.body)
    try {
        const actTour = await Activity.create({
            name,
            difficulty,
            duration,
            season
        })
        actTour.addCountries(countryId)
        res.json(actTour)
        
    } catch (error) {
        console.log(error)
        res.send(error)    
    }  
})

server.get('/all', async (req, res) => {
    const activities = await Activity.findAll({include:Country})
    res.json(activities) 
})


module.exports = server
