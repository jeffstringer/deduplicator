# The Deduplicator
Given a json file composed of records with duplicate ids and emails, this command line program takes the file name as an argument and produces 2 json files:
- de-duplicated records
- change log of the records

### setup/installation
after git cloning and changing into root directory of repo:
`$ npm install`

### run unit tests
`$ npm run test`

### demo application
`$ node app.js --file leads.json`

### de-duplicated json file
found in `deduplicatedLeads.json` in root directory

### change log json file
found in `changeLog.json` in root directory
