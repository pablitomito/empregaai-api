import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emprega-ai';
    
    const options = {
      // Opções recomendadas
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Event listeners para monitoramento
    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro de conexão MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB desconectado');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('👋 Conexão MongoDB fechada devido ao término da aplicação');
      process.exit(0);
    });
    
  } catch (error: any) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
