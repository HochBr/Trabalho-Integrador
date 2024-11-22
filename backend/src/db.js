const pgp = require("pg-promise")({});

const usuario = "botezini";
const senha = "botezini";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/transportesbotezini`);

module.exports = db;