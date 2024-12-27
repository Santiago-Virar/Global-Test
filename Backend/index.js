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
const dataPath = './data.json';

app.get('/customer', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    res.json(data);
});

app.get('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const customer = data.find((c) => c.id === parseInt(req.params.id));
    console.log(customer)
    customer ? res.json(customer) : res.status(404).send('Cliente no encontrado');
});

app.post('/customer', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    console.log(req.body)
    const newCustomer = { id: Date.now(), ...req.body }
    data.push(newCustomer);
    fs.writeFileSync(dataPath, JSON.stringify(data));
    res.status(201).json(newCustomer);
});

app.put('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const index = data.findIndex((c) => c.id === parseInt(req.params.id));
    if (index !== -1) {
        data[index] = { ...data[index], ...req.body };
        fs.writeFileSync(dataPath, JSON.stringify(data));
        res.status(201).json(data[index]);
    } else {
        res.status(404).send('Cliente no encontrado');
    }
});



app.delete('/customer/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataPath));
    const { id } = req.params;
    console.log(id)
    const newData = data.filter((c) => c.id !== parseInt(id));
    if (newData.length < data.length) {
        fs.writeFileSync(dataPath, JSON.stringify(newData));
        res.status(200).send(`Se elimino el registro ${id} correctamente`);
    } else {
        res.status(404).send('Cliente no encontrado');
    }
});
