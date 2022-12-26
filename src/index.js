const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/route.js');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const app = express();


app.use(bodyParser.json());


mongoose.connect("mongodb+srv://paradox766:paradox766@cluster0.cuttx.mongodb.net/Assignment_Knovator-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', router);

app.all('/**', (req, res) => {
    res.status(404).send({ status: false, message: 'Page Not Found!' });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000));
});
