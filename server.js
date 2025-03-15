const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
app.use(express.json());
const uri = 'mongodb+srv://joseDesen:<db_password>@josedesen.myi4e.mongodb.net/?retryWrites=true&w=majority&appName=joseDesen';
const client = new MongoClient(uri);
async function connect() {
  await client.connect();
  console.log('Conectado ao MongoDB');
}
connect();
app.post('/tempos', async (req, res) => {
  const { nome, tempo } = req.body;
  const collection = client.db('quebraCabeca').collection('jogo_dos_8');
  await collection.insertOne({ nome, tempo });
  res.send('Tempo e nome adicionados com sucesso');
});
app.get('/tempos', async (req, res) => {
  const collection = client.db('quebraCabeca').collection('jogo_dos_8');
  const tempos = await collection.find().sort({ tempo: 1 }).limit(5).toArray();
  res.json(tempos);
});
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
