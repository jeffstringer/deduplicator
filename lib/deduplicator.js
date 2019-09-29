const fs = require('fs');
const jsonDiff = require('json-diff');
const _ = require('lodash');

module.exports = class Deduplicator {
  constructor(leads) {
    this.leads = _.sortBy(leads, new Date('entryDate')).reverse();
    this.claimedIds = {};
    this.claimedEmails = {};
    this.deduplicatedLeads = [];
    this.changeLog = [];
  }

  logLead(chosen, lead) {
    return {
      chosen,
      duplicate: lead,
      changes: jsonDiff.diff(lead, chosen),
    };
  }

  deduplicate(lead) {
    const idNotDuped = !Object.keys(this.claimedIds).includes(lead._id);
    const emailNotDuped = !Object.keys(this.claimedEmails).includes(lead.email);
    if (idNotDuped && emailNotDuped) { this.deduplicatedLeads.unshift(lead); }

    if (idNotDuped) {
      this.claimedIds[`${lead._id}`] = lead;
    } else {
      this.changeLog.push(this.logLead(this.claimedIds[`${lead._id}`], lead));
    }

    if (emailNotDuped) {
      this.claimedEmails[`${lead.email}`] = lead;
    } else {
      this.changeLog.push(this.logLead(this.claimedEmails[`${lead.email}`], lead));
    }
  }

  process() {
    return new Promise((resolve) => {
      for (let index = 0; index < this.leads.length; index += 1) {
        this.deduplicate(this.leads[index]);
      }
      resolve(true);
    });
  }

  writeDedupedLeads() {
    fs.writeFileSync('deduplicatedLeads.json', JSON.stringify({ leads: this.deduplicatedLeads }, null, 2));
  }

  writeChangeLog() {
    fs.writeFileSync('changeLog.json', JSON.stringify({ logs: this.changeLog }, null, 2));
  }
};
