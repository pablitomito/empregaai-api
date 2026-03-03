"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTemplate = selectTemplate;
var templates = [
    {
        name: 'executivo',
        category: 'executivo',
        weight: 30,
        suitableFor: ['gestor', 'director', 'executivo', 'manager', 'coordenador']
    },
    {
        name: 'tech-modern',
        category: 'tech',
        weight: 35,
        suitableFor: ['developer', 'programador', 'engenheiro', 'tech', 'it', 'software']
    },
    {
        name: 'minimalista',
        category: 'minimalista',
        weight: 35,
        suitableFor: ['admin', 'comercial', 'vendas', 'marketing', 'assistente']
    },
    {
        name: 'criativo',
        category: 'minimalista', // ou criar nova categoria
        weight: 20,
        suitableFor: ['designer', 'criativo', 'marketing', 'publicidade', 'ux']
    },
    {
        name: 'ats-optimized',
        category: 'minimalista',
        weight: 15,
        suitableFor: ['junior', 'entry', 'estagio', 'trainee']
    }
];
function selectTemplate(userData) {
    var roleLower = userData.role.toLowerCase();
    var industryLower = (userData.industry || '').toLowerCase();
    for (var _i = 0, templates_1 = templates; _i < templates_1.length; _i++) {
        var template = templates_1[_i];
        var matchesRole = template.suitableFor.some(function (keyword) {
            return roleLower.includes(keyword) || industryLower.includes(keyword);
        });
        if (matchesRole) {
            console.log("\u2705 Template: ".concat(template.name, " (match)"));
            return template.name;
        }
    }
    var totalWeight = templates.reduce(function (sum, t) { return sum + t.weight; }, 0);
    var random = Math.random() * totalWeight;
    for (var _a = 0, templates_2 = templates; _a < templates_2.length; _a++) {
        var template = templates_2[_a];
        if (random < template.weight) {
            console.log("\u2705 Template: ".concat(template.name, " (random)"));
            return template.name;
        }
        random -= template.weight;
    }
    return 'minimalista';
}
