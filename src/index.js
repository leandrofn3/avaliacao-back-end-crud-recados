import express from 'express';

const app = express();

app.use(express.json());

app.get("/", (request, response) => {
    return response.json("ok")
});

//CRUD RECADOS
//CREATE
let recados = [];

app.post("/recados", (request, response) => {
    const recado = request.body;
    recados.push({
        id: Math.floor(Math.random() * 123456),
        titulo: recado.titulo,
        descricao: recado.descricao
    })
    console.log(recados)
    response.status(201).json();
});

//READE-ler
app.get("/recados", (request, response) => {
    response.status(200).json(recados);
});

//READE - ler um recado só
app.get("/recados/:id", (request, response) => {
    const id = Number(request.params.id);
    const recado = recados.find(recadoId => recadoId.id === id);
    response.json(recado);
    //console.log(recado)
});

app.put("/recados/:id", (request, response) => {
    const recado = request.body;
    const id = Number(request.params.id);
    const indexRecado = recados.findIndex(recadoId => recadoId.id === id);
    recados[indexRecado] = {
        id: id,
        titulo: recado.titulo,
        descricao: recado.descricao
    }
    response.status(201).json();
});

app.listen(3001, () => { console.log("servidor iniciado!") })