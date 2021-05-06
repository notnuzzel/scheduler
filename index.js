const RSMQPromise = require('rsmq-promise');
 
const rsmq = new RSMQPromise({
    host: "127.0.0.1", 
    port: 6379
});

var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();
