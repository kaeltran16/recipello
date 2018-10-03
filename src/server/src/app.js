import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import expressGraphQL from 'express-graphql';

import dbKey from './config/key';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

mongoose.connect(dbKey.mongoURI, {useNewUrlParser: true})
		.then(() => console.log('Database connected'));

export default app;
