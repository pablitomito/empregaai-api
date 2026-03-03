"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("./src/services/cv-generator/generator");
var fs_1 = require("fs");
var testData = {
    name: 'João Silva Santos',
    email: 'joao.silva@example.com',
    phone: '+351 912 345 678',
    location: 'Lisboa, Portugal',
    role: 'Desenvolvedor Full-Stack Sênior',
    summary: 'Desenvolvedor Full-Stack com mais de 8 anos de experiência em desenvolvimento de aplicações web escaláveis. Especialista em React, Node.js e arquitetura de sistemas. Apaixonado por criar soluções tecnológicas que impactam positivamente o negócio.',
    experiences: [
        {
            title: 'Senior Full-Stack Developer',
            company: 'Tech Solutions Portugal',
            location: 'Lisboa',
            startDate: 'Janeiro 2020',
            endDate: 'Presente',
            current: true,
            description: 'Liderança técnica em projetos de larga escala, desenvolvimento de APIs RESTful, implementação de arquitetura de microserviços. Responsável por otimizações que resultaram em redução de 40% no tempo de resposta.'
        },
        {
            title: 'Full-Stack Developer',
            company: 'StartupXYZ',
            location: 'Porto',
            startDate: 'Março 2018',
            endDate: 'Dezembro 2019',
            current: false,
            description: 'Desenvolvimento de plataforma SaaS em React e Node.js. Implementação de sistema de pagamentos com Stripe. Criação de dashboard analytics em tempo real.'
        },
        {
            title: 'Junior Developer',
            company: 'WebAgency',
            location: 'Lisboa',
            startDate: 'Junho 2016',
            endDate: 'Fevereiro 2018',
            current: false,
            description: 'Desenvolvimento de websites corporativos e e-commerce. Manutenção de aplicações WordPress e Laravel.'
        }
    ],
    education: [
        {
            degree: 'Mestrado em Engenharia Informática',
            institution: 'Instituto Superior Técnico',
            location: 'Lisboa',
            year: '2016'
        },
        {
            degree: 'Licenciatura em Ciências da Computação',
            institution: 'Universidade de Coimbra',
            location: 'Coimbra',
            year: '2014'
        }
    ],
    skills: [
        'React', 'Node.js', 'TypeScript', 'Next.js',
        'PostgreSQL', 'MongoDB', 'Docker', 'AWS',
        'Git', 'CI/CD', 'REST APIs', 'GraphQL'
    ],
    languages: [
        { name: 'Português', level: 'Nativo' },
        { name: 'Inglês', level: 'Fluente' },
        { name: 'Espanhol', level: 'Intermédio' }
    ],
    industry: 'tech',
    experienceYears: 8
};
function test() {
    return __awaiter(this, void 0, void 0, function () {
        var pdf, filename, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🧪 Iniciando teste de geração de CV...\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, generator_1.generateCVPDF)(testData)];
                case 2:
                    pdf = _a.sent();
                    filename = "test-cv-".concat(Date.now(), ".pdf");
                    fs_1.default.writeFileSync(filename, pdf);
                    console.log('✅ PDF gerado com sucesso!');
                    console.log("\uD83D\uDCC4 Arquivo salvo: ".concat(filename));
                    console.log("\uD83D\uDCCA Tamanho: ".concat((pdf.length / 1024).toFixed(2), " KB"));
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Erro ao gerar CV:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
test();
