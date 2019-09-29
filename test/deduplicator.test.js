const assert = require('assert');
const fs = require('fs');
const Deduplicator = require('../lib/deduplicator');

const leadsJson = fs.readFileSync('./leads.json');
const { leads } = JSON.parse(leadsJson);

describe('process()', () => {
  const deduplicator = new Deduplicator(leads);
  deduplicator.process();
  const logs = deduplicator.changeLog;

  it('should create an object with keys as claimed lead ids', () => {
    const ids = Object.keys(deduplicator.claimedIds);
    assert.equal(ids.filter((id) => id === 'jkj238238jdsnfsj23').length, 1);
    assert.equal(ids.length, 8);
  });

  it('should create an object with key as claimed lead emails', () => {
    const emails = Object.keys(deduplicator.claimedEmails);
    assert.equal(emails.filter((email) => email === 'foo@bar.com').length, 1);
    assert.equal(emails.length, 6);
  });

  it('should create a new array of de-duplicated leads', () => {
    const original = deduplicator.leads;
    const deduped = deduplicator.deduplicatedLeads;
    assert.equal(deduped.length, 5);
    assert.equal(original.filter((lead) => lead._id === 'jkj238238jdsnfsj23').length, 3);
    assert.equal(deduped.filter((lead) => lead._id === 'jkj238238jdsnfsj23').length, 1);
    assert.equal(original.filter((lead) => lead.email === 'mae@bar.com').length, 2);
    assert.equal(deduped.filter((lead) => lead.email === 'mae@bar.com').length, 1);
  });

  it('should log changes due to duplicate ids', () => {
    const log = logs[2];
    assert.equal(log.chosen._id, log.duplicate._id);
    assert.equal(log.chosen.email, 'bill@bar.com');
    assert.equal(log.duplicate.email, 'coo@bar.com');
    assert.equal(log.changes.email.__old, 'coo@bar.com');
    assert.equal(log.changes.email.__new, 'bill@bar.com');
  });

  it('should log changes due to duplicated emails', () => {
    const log = logs[0];
    assert.equal(log.chosen.email, log.duplicate.email);
    assert.equal(log.chosen._id, 'wuj08238jdsnfsj23');
    assert.equal(log.duplicate._id, 'qest38238jdsnfsj23');
    assert.equal(log.changes._id.__old, 'qest38238jdsnfsj23');
    assert.equal(log.changes._id.__new, 'wuj08238jdsnfsj23');
  });
});
