const express = require("express");
const sequelize = require('./database');
const Events = require("./Events");
const fetch = require('node-fetch');

sequelize.sync({ force: false }).then(() => console.log('db is ready'));

const app = express();

app.use(express.json());
// Add new events
app.post('/events', async (req, res) => {
  await Events.create(req.body);
  res.send("success");
})

// Get All events
app.get('/events', async (req, res) => {
  const events = await Events.findAll();
  res.send(events);
})

// Get one events
// If the events is out door get the weather data also
// IF not then get only events 
app.get('/events/:id', async (req, res, next) => {
  try {
  const id = req.params.id;
  const event = await Events.findOne({where: {id: id}});
  
// If the events is out door get the weather data also
  if(event.isOutside === 1 || event.isOutside === true){
  const weather_url = `http://api.weatherstack.com/current?access_key=e76b2e3d6fc992db781417aff0640d92&query=${event.location}`;
  const weather_response = await fetch(weather_url);
  const weather_data = await weather_response.json();

  const data = {
    eventDetels: event,
    weather: weather_data.current.temperature  };
  res.json(data);
} else {
  // Else return the event 
  res.send(event);
}

} catch (err) {
  next(err);
}
})

// Update events 
app.put('/events/:id', async (req, res) => {
  const id = req.params.id;
  const event = await Events.findOne({where: {id: id}});
  await event.update(req.body);
  await event.save();
  res.send('updated');
})

// Delete events
app.delete('/events/:id', async (req, res) => {
  const id = req.params.id;
  await Events.destroy({where: {id: id}});
  res.send('removed');
})

app.listen(3000, () => {
  console.log("app is running");
});
