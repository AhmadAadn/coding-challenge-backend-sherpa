const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database');

class Events extends Model {};

Events.init({
 
  name: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE
  },
  isOutside: {
    type: DataTypes.BOOLEAN
  },
  attendees: {
    type: DataTypes.ARRAY(DataTypes.TEXT)
  },
  organizer: {
    type: DataTypes.JSON
  },
}, {
  sequelize,
  modelName: 'events',
  timestamps: true
})

module.exports = Events;