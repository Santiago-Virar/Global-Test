const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
const dataPath = './backend/data.json';

// GET /customer/
app.get('/customer', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data);
});

// GET /customer/:id
app.get('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const customer = data.find((c) => c.id === parseInt(req.params.id));
    console.log(customer)
    customer ? res.json(customer) : res.status(404).send('Cliente no encontrado');
});

// POST /customer/
app.post('/customer', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const newCustomer = { id: Date.now(), ...req.body };
    console.log(newCustomer)
    data.push(newCustomer);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).json(newCustomer);
});

// PUT /customer/:id
app.put('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const index = data.findIndex((c) => c.id === parseInt(req.params.id));
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.json(data[index]);
    } else {
        res.status(404).send('Cliente no encontrado');
    }
});



// DELETE /customer/:id
app.delete('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const newData = data.filter((c) => c.id !== parseInt(req.params.id));
    if (newData.length < data.length) {
        fs.writeFileSync(dataPath, JSON.stringify(newData));
        res.status(200).send(`Se elimino el registro ${req.params.id} correctamente`);
    } else {
        res.status(404).send('Cliente no encontrado');
    }
});
