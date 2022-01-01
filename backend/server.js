require('dotenv').config();
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const app =express();

app.use(express.json());
app.use(cors())



app.use('/api',require('./routes/auth'));
app.use('/api',require('./routes/subs'));
app.use('/',(req,res)=>res.send('hello world'))


const URI = process.env.MONGO_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log('Connected to mongodb')
})


app.listen(8080,()=>{
    console.log(`listening to port 8080`)
})