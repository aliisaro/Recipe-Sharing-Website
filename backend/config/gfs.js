let gfs;

function initGFS(conn, mongo) {
  const Grid = require("gridfs-stream");
  gfs = Grid(conn.db, mongo);
  gfs.collection("uploads"); // Bucket name
}

function getGFS() {
  if (!gfs) throw new Error("GFS not initialized yet");
  return gfs;
}

module.exports = { initGFS, getGFS };
