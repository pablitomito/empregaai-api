"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/emprega-ai';
        const options = {
            // Opções recomendadas
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        const conn = await mongoose_1.default.connect(mongoURI, options);
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        // Event listeners para monitoramento
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ Erro de conexão MongoDB:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB desconectado');
        });
        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose_1.default.connection.close();
            console.log('👋 Conexão MongoDB fechada devido ao término da aplicação');
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map