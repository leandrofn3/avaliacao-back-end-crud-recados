import express from 'express';
import bcrypt from 'bcrypt';

const app = express();

app.use(express.json());

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
                recados: []
            });
        } else {
            return response.status(400).json(`Houve um erro: ${err}`)
        }
    });
    response.status(201).json(`Conta criada com sucesso!`);
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
        return response.status(422).json("O email é obrigatório!");
    }

    if (!password) {
        return response.status(422).json("A senha é obrigatória!");
    };

    const user = users.find(user => user.email === email);
    if (!user) {
        return response.status(402).json("Usuário não encontrado!");
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
        return response.status(422).json("Senha inválida!");
    }
    return response.status(200).json("usuário logado!");
});

//CRUD RECADOS
//CREATE - criar recados

app.post("/recados/create/:id", (request, response) => {
    const id = Number(request.params.id);
    const recado = request.body;
    const validateID = users.findIndex(userID => userID.id === id);

    if (validateID === -1) {
        return response.status(404).json("usuario não encontrado!");
    }

    const newRecado = {
        id: Math.floor(Math.random() * 123456),
        titulo: recado.titulo,
        descricao: recado.descricao
    };
    users[validateID].recados.push(newRecado);
    response.status(201).json(newRecado);
});

//READE- ler recados.

app.get("/recados/reade", (request, response) => {
    response.status(200).json(users);
});

//READE - ler um recado só.

app.get("/recados/readeID/:id/:idUser", (request, response) => {
    const id = Number(request.params.id);
    const idUser = Number(request.params.idUser)

    const validateIDUser = users.find(userId => userId.id === idUser);
    if (!validateIDUser) {
        return response.status(404).json("Usuário não encontrado!");
    }

    const recado = validateIDUser.recados.find(recado => recado.id === id)

    if (!recado) {
        return response.status(404).json("Recado não encontrado!");
    }

    response.status(200).json(recado);

});

//UPDATE - alterar um recado.

app.put("/recados/update/:id/:idUser", (request, response) => {
    const recado = request.body;
    const id = Number(request.params.id);
    const idUser = Number(request.params.idUser);

    let validateIDUser = users.findIndex(user => user.id === idUser);
    if (validateIDUser === -1) {
        return response.status(404).json("Usuário não encontrado!");
    };

    const indexRecado = users[validateIDUser].recados.findIndex(recadoId => recadoId.id === id);
    if (indexRecado === -1) {
        return response.status(404).json("Recado não encontrado!");
    }

    users[validateIDUser].recados[indexRecado] = {
        id: id,
        titulo: recado.titulo,
        descricao: recado.descricao
    }
    response.status(200).json("Recado alterado com sucesso!");
});

//DELETE - deletar um recado

app.delete("/recados/delete/:id/:idUser", (request, response) => {
    const id = Number(request.params.id);
    const idUser = Number(request.params.idUser);

    let validateIDUser = users.findIndex(user => user.id === idUser);
    if (validateIDUser === -1) {
        return response.status(404).json("usuario não encontrado!");
    };

    const indexRecado = users[validateIDUser].recados.findIndex(recadoId => recadoId.id === id);
    if (indexRecado === -1) {
        return response.status(404).json("Recado no encontrado!");
    };


    users[validateIDUser].recados.splice(indexRecado, 1);
    response.status(200).json("Recado deletado com sucesso!");
});

app.listen(3001, () => { console.log("Servidor iniciado!") });