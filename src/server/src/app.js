import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import env from 'dotenv';

env.config({path: 'variables.env'});

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})
		.then(() => console.log('Database connected'))
		.catch((err) => console.log(err));
export default app;
