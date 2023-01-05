const server = require('express').Router();
const axios = require('axios').default;
const { Country, Activity } = require('../db.js');
const { Op } = require('sequelize');
//const common = require('mocha/lib/interfaces/common');
const BASE_URL = 'https://restcountries.com/v3.1/all'
/*     GET /countries:
En una primera instancia deberán traer todos los países desde restcountries y guardarlos en su propia base de datos
y luego ya utilizarlos desde allí (Debe almacenar solo los datos necesarios para la ruta principal)
Obtener un listado de los primeros 10 países */

server.get('/', async (req, res, next) => {
    const arrBD = []
    try {
        Country.findAll({ include: Activity }).then(resp => {
            if (!resp.length) {
                axios.get(BASE_URL).then((response) => {
                    response.data.map(async (country) => {
                        arrBD.push(
                            await Country.create({
                                id: country.cca3,
                                name: country.translations.spa.common,
                                flag: country.flags ? country.flags.png : country.flags.svg,
                                region: country.region,
                                capital: country.capital ? country.capital[0] : 'no cap',
                                subregion: country.subregion,
                                area: country.area,
                                population: country.population
                            }).then(response => response)
                        )
                    })
                    Promise.all(arrBD)//devuelve una promesa que termina correctamente cuando todas las promesas en el argumento iterable han sido concluídas con éxito
                        .then((data) => res.status(200).send(data))
                })
            } else {
                return res.status(200).send(resp)
            }
        })
    } catch (err) {
        next(err)
    }
});


/*     GET /countries?name='...':
Obtener los países que coincidan con el nombre pasado como query parameter 
(No necesariamente tiene que ser una matcheo exacto)
Si no existe ningún país mostrar un mensaje adecuado */

server.get('/name', async (req, res, next) => {
    const { name } = req.query;
    try {
        const countryByName = await Country.findAll({
            include: {
                model: Activity,
                through: { attributes: [] },
            },
        });

        if (name) {
            const findByName = countryByName.filter((country) =>
                country.name.toLowerCase().includes(name.toLowerCase())//include
            );
            if (findByName) {//length
                res.json(findByName);
            } else {
                res.status(400).json({ msg: "Country not found" });
            }
        } else {
            res.status(200).json(countryByName);
        }
    } catch (error) {
        next(error);
    }
});


/*     GET /countries/{idPais}:
Obtener el detalle de un país en particular
Debe traer solo los datos pedidos en la ruta de detalle de país
Incluir los datos de las actividades turísticas correspondientes*/

server.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const country = await Country.findByPk(
            id.toUpperCase(),
            { include: Activity }
        )
        country ? res.json(country) : res.sendStatus(404)
    } catch (err) {
        next(err)
    }
})


module.exports = server;


// server.get('/', async (req, res, next) => {
//     try {
//         axios.get('https://restcountries.eu/rest/v2/all')
//         .then(response => {
//             return response.data.map(async country => {
//                 await Country.create({
//                         id: country.alpha3Code,
//                         name: country.name,
//                         flag: country.flag,
//                         region: country.region,
//                         capital: country.capital,
//                         subregion: country.subregion,
//                         area: country.area,
//                         population: country.population
//                 })
//             })
//         })
//         .then(async resp => {
//             const limitCountry = await Country.findAll({limit: 10})///Sirve para limitar cuantos paises quiero mostrar
//             res.status(200).json(limitCountry)
//         })
//     } catch (err) {
//         next(err)
//     }
// })           
