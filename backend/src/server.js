import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

// Connect to MongoDB
connectDB();

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
