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
                recados: []
            });
        } else {
            return response.status(400).json(`Houve um erro: ${err}`)
        }
    }); 

    response.status(201).json("Conta criada com sucesso");
});
console.log(users)

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
    return response.status(200).json("usuário logado!");
});
//CRUD RECADOS
//CREATE

app.post("/recados/create/:id", (request, response) => {
    const id = Number(request.params.id);
    const recado = request.body;
    const validateID = users.findIndex(userID => userID.id === id);

    if(validateID === -1){
        return response.status(404).json("usuario não encontrado!");
    }

    console.log(users);
    // trocar um push de objeto por um array
    const newRecado = {
        id: Math.floor(Math.random() * 123456),
        titulo: recado.titulo,
        descricao: recado.descricao
    };
    users[validateID].recados.push(newRecado);
    response.status(201).json(newRecado);
});

//READE-ler.

app.get("/recados/reade", (request, response) => {
    response.status(200).json(users[4]);
});

//READE - ler um recado só.

app.get("/recados/readeID/:id", middlewareId, (request, response) => {
    const id = Number(request.params.id);
    const recado = users.find(recadoId => recadoId.id === id);
    response.json(recado);
    //console.log(recado)
});

//UPDATE - alterar um recado.

app.put("/recados/update/:id/:idUser", middlewareId, (request, response) => {
    const recado = request.body;

    const idUser = Number(request.params.idUser);
    const validateIDUser= users.findIndex(user => user.id === id);

    if(validateIDUser === -1){
        return response.status(404).json("usuario não encontrado!");
    };
    
    const id = Number(request.params.id);
    const indexRecado = users[validateIDUser].findIndex(recadoId => recadoId.id === id);

    users[validateIDUser].recados[indexRecado] = {
        id: id,
        titulo: recado.titulo,
        descricao: recado.descricao
    }
    response.status(200).json();
});

//DELETE - deletar um recado

app.delete("/recados/delete/:id", middlewareId, (request, response) => {
    const id = Number(request.params.id);
    const indexRecado = users.findIndex(recadoId => recadoId.id === id);
    recados.splice(indexRecado, 1);
    response.status(200).json();
});

app.listen(3001, () => { console.log("servidor iniciado!") });