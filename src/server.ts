import express from 'express';
import cors from 'cors';

const app = express();
// FORÇAMOS a porta 5000 que é a que o Railway está tentando usar
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://www.pablito.my', // Domínio exato do seu frontend
  credentials: true,               // Permite o envio de cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.get('/', (req, res) => {
  res.send('🚀 CONEXÃO ESTABELECIDA! O servidor Express está funcionando.');
});

// Rota para o seu Axios não dar erro 404
// Rota atualizada para o seu frontend entender
app.post('/api/auth/register', (req, res) => {
  // Aqui simulamos o que um banco de dados faria
  res.json({ 
    success: true, 
    data: {
      token: "token_gerado_pelo_servidor", // O frontend precisa disto!
      user: {
        id: 1,
        email: "usuario@teste.com",
        fullName: "Usuário Teste"
      }
    }
  });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`✅ Servidor escutando na porta ${PORT}`);
});