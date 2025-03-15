const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://josedesen.github.io/quebra-cabeca/quebra_cabeca_nivel1.html',
  methods: ['GET', 'POST'],
}))
app.use((req, res, next) => {
  console.log(`Requisição recebida: ${req.method} ${req.url}`);
  next();
});

const uri = process.env.MONGO_URI;
const porta = process.env.PORT;
const client = new MongoClient(uri);
async function connect() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra o processo se a conexão falhar
  }
}

connect();
app.post('/tempos:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tempo } = req.body;
    const collection = client.db('quebraCabeca').collection(`jogo_dos_${id}`);
    await collection.insertOne({ nome, tempo });
    res.send('Tempo e nome adicionados com sucesso');
  } catch (error) {
    console.error('Erro ao adicionar tempo e nome:', error);
    res.status(500).send('Erro interno no servidor');
  }
});

app.get('/tempos:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = client.db('quebraCabeca').collection(`jogo_dos_${id}`);
    const tempos = await collection.find().sort({ tempo: 1 }).limit(5).toArray();
    res.json(tempos);
  } catch (error) {
    console.error('Erro ao obter os tempos:', error);
    res.status(500).send('Erro interno no servidor');
  }
});
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});

