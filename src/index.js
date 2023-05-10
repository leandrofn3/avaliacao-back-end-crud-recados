import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

function middlewareId(request, response, next) {
    const id = Number(request.params.id);
    const index = recados.findIndex(recadoId => recadoId.id === id);
    if (index == -1) {
        return response.status(400).json("Por favor, insira um id valido!");
    } else {
        next()
    }
};

app.get("/", (request, response) => {
    return response.json("Bem vindo(a) a API!")
});

//sinup

let users = [];

app.post("/signup", middlewareValidationSignup, (request, response) => {
    const user = request.body;
    const saltRounds = 10;

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (hash) {
            users.push({
                id: Math.floor(Math.random() * 123456),
                name: user.name,
                email: user.email,
                password: hash,
                recados: recados = []
            });
        } else {
            return response.status(400).json(`Houve um erro: ${err}`)
        }
    }); console.log(users)

    response.status(201).json("Conta criada com sucesso");
});

app.get("/signup", (request, response) => {
    response.status(200).json(users);
});


function middlewareValidationSignup(request, response, next) {
    const sameEmail = users.some((emailSame) => {
        return emailSame.email === request.body.email
    });

    if (sameEmail) {
        return response.status(422).json("Email já existe, tente outro!")
    } else if (!request.body.name) {
        return response.status(422).json("O nome é obrigatório! ")
    } else if (!request.body.email) {
        return response.status(422).json("O email é obrigatório! ")
    } else if (!request.body.password) {
        return response.status(422).json("A senha é obrigatória! ")
    } else {
        next();
    }
};

//LOGIN

app.post('/login', async (request, response) => {
    const { email, password } = request.body;

    if (!email) {
        return response.status(422).json({ message: 'O email é obrigatório!' });
    }

    if (!password) {
        return response.status(422).json({ message: 'A senha é obrigatória!' });
    };

    const user = users.find(user => user.email === email);

    if (!user) {
        return response.status(402).json({ message: 'Usuário não encontrado!' });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return response.status(422).json({ message: 'Senha inválida!' });
    }
    
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

//READE-ler.

// app.get("/recados", (request, response) => {
//     response.status(200).json(recados);
// });

//READE - ler um recado só.

app.get("/recados/:id", middlewareId, (request, response) => {
    const id = Number(request.params.id);
    const recado = recados.find(recadoId => recadoId.id === id);
    response.json(recado);
    //console.log(recado)
});

//UPDATE - alterar um recado.

app.put("/recados/:id", middlewareId, (request, response) => {
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

//DELETE - deletar um recado

app.delete("/recados/:id", middlewareId, (request, response) => {
    const id = Number(request.params.id);
    const indexRecado = recados.findIndex(recadoId => recadoId.id === id);
    recados.splice(indexRecado, 1);
    response.status(200).json();
});

app.listen(3001, () => { console.log("servidor iniciado!") });