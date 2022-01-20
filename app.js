require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const authRouter = require('./routes/auth');
const {
  getAllBooks,
  getSingleBook,
} = require('./controllers/books');
const booksRouter = require('./routes/books');
const authenticateAdmin = require('./middleware/authentication');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages for security
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');


// Swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDOC = YAML.load('./swagger.yaml');

// routes
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDOC));
app.use('/api/v1/authb', authRouter);
app.use('/api/v1/books', authenticateAdmin, booksRouter);
app.route('/api/v1/book/:id').get(getSingleBook);
app.route('/api/v1/book').get(getAllBooks);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.set('trust proxy', 1);
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
app.use(cors());
app.use(helmet());
app.use(xss());

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then(() => console.log('Connection to DB successful...')).catch(err => console.error(err));
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
