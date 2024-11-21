import path from 'path';
import app from '../app';
import cluster from 'cluster';

const os = require('os');
require("dotenv").config({
    path: path.resolve(__dirname, "../config/.env"),
});

if (cluster.isPrimary) {
    for (let i = 0; i < os.cpus().length; i++) 
      cluster.fork();
  } else {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => console.log(`Worker ${process.pid} running on port ${PORT}`));
  }