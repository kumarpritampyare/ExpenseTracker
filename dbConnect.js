const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()


const dbUsername = process.env.DB_USERNAME;
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const dbName = 'expense'; 
const dbHost = 'cluster0.mjocc.mongodb.net';

mongoose.connect(
  `mongodb+srv://prakashisha16:isha123456789@cluster0.lrzyf.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);


const connection = mongoose.connection

connection.on('connected', () =>
  console.log('Mongo DB Connection Successfull')
);