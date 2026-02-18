"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Carrega variáveis de ambiente
dotenv_1.default.config();
// Conecta ao MongoDB (executa automaticamente dentro do arquivo)
require("./config/mongodb");
// Rotas
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes")); // caso exista
// Inicializa o Express
const app = (0, express_1.default)();
// Middlewares globais
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "https://www.pablito.my",
    credentials: true,
}));
// Rotas da API
app.use("/api/auth", authRoutes_1.default);
app.use("/api/ai", ai_routes_1.default);
app.use("/api/subscription", subscriptionRoutes_1.default); // só se existir
// Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor online na porta ${PORT}`);
});
//# sourceMappingURL=server.js.map