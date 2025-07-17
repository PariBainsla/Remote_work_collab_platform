const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


// Routes
app.use('/api/auth', authRoutes);

//dummy route
app.get('/', (req, res) => {
  res.send('API is working 🚀');
});

console.log(process.env.MONGO_URI)

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected ✅'))
  .catch((err) => console.error('MongoDB connection error ❌', err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
