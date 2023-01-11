const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./discharges.db');
const util = require('util');

const run = util.promisify(db.run.bind(db));
const all = util.promisify(db.all.bind(db));

const init = async function() {
    await run("CREATE TABLE IF NOT EXISTS discharges (id INTEGER PRIMARY KEY AUTOINCREMENT, location_id TEXT, start_ts INTEGER);");
}

const retrieveDischarges = async function() {
    return await all("SELECT id, location_id, start_ts from discharges");
}

const storeDischarge = async function(discharge) {
    let startTimestamp = new Date(discharge.MostRecentDischargeAlertStart).getTime();
    await run(`INSERT INTO discharges(location_id, start_ts) VALUES (?,?)`, [discharge.PermitNumber, startTimestamp]);
}

export {
    init,
    retrieveDischarges,
    storeDischarge
};