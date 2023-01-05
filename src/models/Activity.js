const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('activity', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    difficulty: {
        type: DataTypes.ENUM,
        values: ['1', '2','3', '4','5'],
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    season: {
        type: DataTypes.ENUM,
        values: ['Summer', 'Autumn','Winter','Spring'],//STRING o revisar como va a venir el formulario
        allowNull: false,
    },
  });
};
