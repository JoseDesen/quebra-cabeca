const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors())
const uri = process.env.MONGO_URI;
const porta = process.env.PORT;
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
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});

