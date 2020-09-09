const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateId(request, response, next) {
  const {id} = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: "Não é um uuid!" });
  }
  
  return next(); 
}

app.use('/repositories/:id', validateId);
app.use('/repositories/:id/like', validateId);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;
    const likes = 0;

    const repositorie = { id: uuid(), title, url, techs, likes}

    repositories.push(repositorie);

    return response.json(repositorie);

});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const { title, url, techs } = request.body;
    
    const index = repositories.findIndex(item => item.id == id);

    if (index < 0) {
      return response.status(400).json({ error: "Não encontrado!" });
    }
    
    repositories[index].title = title;
    repositories[index].url = url;
    repositories[index].techs = techs;

    return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
    const {id} = request.params;

    const index = repositories.findIndex(item => item.id == id);

    if (index < 0) {
      return response.status(400).json({ error: "Não encontrado!" });
    }

    repositories.splice(index, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const {id} = request.params;

    const index = repositories.findIndex(item => item.id == id);

    if (index < 0) {
      return response.status(400).json({ error: "Não encontrado!" });
    }

    repositories[index].likes = repositories[index].likes+1;

    return response.json(repositories[index]);
});

module.exports = app;
