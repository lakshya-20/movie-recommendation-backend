const Agenda = require('agenda');
const agenda = new Agenda({
  db: {
    address: `${process.env.MONGOURL}/flick?authSource=admin`,
    collection: 'agendaJobs',
    options: {
      useUnifiedTopology: true
    }
  },
  processEvery: '30 seconds',
});
module.exports = agenda;