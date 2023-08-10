import 'dotenv/config'
import { myDataSource } from './app-data-source'
import * as express from 'express';
import * as cors from 'cors';

// Routes
import routes from './routes/index';

// Establish database connection
myDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

// Create and setup express app
const app = express()
app.use(express.json({ limit: '200mb' }))
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Registering routes
app.use('', routes);

app.listen(Number(process.env.API_PORT), () => console.log(`Listening on port ${process.env.API_PORT}`))