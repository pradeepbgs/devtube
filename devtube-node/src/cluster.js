import cluster from 'cluster';
import os from 'os';
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config();

const cpus = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  connectDB()
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`App is running on http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.log('MongoDB connection error:', err);
      process.exit(1); 
    });

  app.on('error', (error) => {
    console.log('App error:', error);
    process.exit(1); 
  });
}
