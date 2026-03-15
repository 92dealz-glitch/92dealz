
// server/index.js
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('../routes');
const { errorMiddleware } = require('../middleware/error.middleware');
const { corsOptions } = require('../middleware/cors.middleware');
const { connectDB } = require('../config/database');

dotenv.config();
const app = express();

app.use(cors(corsOptions()));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => res.status(200).send('OK'));

app.use('/api', routes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
})();const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('../routes');
const { errorMiddleware } = require('../middleware/error.middleware');
const { corsOptions } = require('../middleware/cors.middleware');
const { connectDB } = require('../config/database');
// routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./user.routes'));
router.use('/deals', require('./deals.routes'));

module.exports = router;
