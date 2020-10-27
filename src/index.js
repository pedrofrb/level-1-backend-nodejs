const express = require('express');
const { v4:uuid, isUuid } = require('uuid');

const app = express();

app.use(express.json());
/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações no back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH : Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

 /**
  * Tipos de parâmetros:
  * 
  * Query Params: Filtros e paginação
  * Route params: Identificar Recursos (Atualizar/Deletar)
  * Request Body: Conteúdo na hora de criar ou editar um recurso
  */

  /**
   * Middleware: Interceptador de requisições que pode interromper
   * totalmente a requisição ou alterar dados da requisição
   */

const projects = [];

function logRequests(request, response, next) {
  const { method, url }  = request;
  const logLabel = `[${method.toUpperCase()}] ${url} `;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid project ID.' });
  }

  return next();
}

app.use(logRequests);

// Será aplicado a todas as rotas que tenha o recurso abaixo
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  // const { title, owner } = request.query;
  // console.log(title, owner);
  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects
  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };
  
  projects.push(project)

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not Found.' });
  }

  const project = {
    id,
    title,
    owner
  }

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0){
    return response.status(400).json({ error: 'Project not Found.' });
  }

  projects.splice(projectIndex,1);

  return response.status(204).send();
});


app.listen(3333,  () => {
  console.log('🚀️ Back-end started!!');
});