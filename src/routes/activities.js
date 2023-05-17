const server = require('express').Router();
const { Country, Activity } = require('../db.js');
/* POST /activity:
Recibe los datos recolectados desde el formulario controlado de la ruta de 
creación de actividad turística por body
Crea una actividad turística en la base de datos
*/
server.get('/all', async (req, res) => {
    const activities = await Activity.findAll({include:Country})
    res.json(activities) 
})

server.post('/', async (req, res) => {
    const { name, difficulty, duration, season, countryId } = req.body
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
        res.send(error)    
    }  
})

server.put('/:id', async(req, res) => {
    const id = req.params.id
	const { name, difficulty, duration, season } = req.body
	try {
		const activity = await Activity.findByPk(id)
		await activity.update({
			name: name || activity.dataValues.name,
			difficulty: difficulty || activity.dataValues.difficulty,
			duration: duration || activity.dataValues.duration,
			season: season || activity.dataValues.season
		})
		activity? res.send(activity).status(200):res.sendStatus(400)		
	} catch (error) {
		res.send(error).status(404)
	}
})

server.delete('/:id',async(req, res) => {
    const id = req.params.id
      try {
          const activity = await Activity.destroy({
              where: { id: id }
          })
          activity === 1 ? res.send('actividad eliminada satisfactoriamente') : res.send('actividad inexistente')
      } catch (error) {
          res.send(error).status(404)
      }       
})

module.exports = server
