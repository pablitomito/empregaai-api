import express from 'express';
import cors from 'cors';

const app = express();
// FORÇAMOS a porta 5000 que é a que o Railway está tentando usar
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🚀 CONEXÃO ESTABELECIDA! O servidor Express está funcionando.');
});

// Rota para o seu Axios não dar erro 404
app.post('/api/auth/register', (req, res) => {
  res.json({ success: true, message: "Servidor respondeu!" });
});

// O SEGREDO: '0.0.0.0' é obrigatório no Railway
app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor escutando na porta ${PORT}`);
});