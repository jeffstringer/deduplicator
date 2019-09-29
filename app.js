const { argv } = require('yargs');
const fs = require('fs');
const Deduplicator = require('./lib/deduplicator');

if (argv.file) {
  (async () => {
    try {
      const fileName = argv.file;
      const leadsJsonString = fs.readFileSync(fileName);
      const leadsJson = JSON.parse(leadsJsonString);
      const deduplicator = new Deduplicator(leadsJson.leads);
      await deduplicator.process();
      deduplicator.writeDedupedLeads();
      deduplicator.writeChangeLog();
    } catch (error) {
      console.log(error.message);
    }
  })();
} else {
  console.log('\nPlease enter file name, for example: \n\n$ node app.js --file leads.json\n');
}
