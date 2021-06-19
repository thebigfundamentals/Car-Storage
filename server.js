const { response } = require('express');
const express = require('express');
const Datastore = require('nedb');
const app = express();

app.listen(3000, function () {
    console.log('Server is running at 3000.')
});

app.use(express.static('frontend'));

app.use(express.json({ limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


app.get('/api', (req, res) => {
    database.find({}, (err, data) => {
        console.log(data);
        res.json(data);
    })
});

app.post('/api', (req, res) => {
    const data = req.body;
    database.insert(data)
    console.log(data);
    res.json({
        status: 'Carro cadastrado com sucesso',
        data
    });
});

app.post('/removeApi', (req, res) => {
    const data = req.body;
    database.remove({ id: data.id }, {}, function (err, numRemoved) {
    });
    res.json({
        status: 'Carro excluído com sucesso',
        data
    });

});