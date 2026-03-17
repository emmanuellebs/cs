"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBoardProvisionConfig = loadBoardProvisionConfig;
function loadBoardProvisionConfig() {
    return {
        name: 'WH - Customer Success',
        description: 'Board Kanban - Pipeline operacional de CS com 8 etapas: Análise de Perfil → Implantação → Lançamento → Acompanhamento 1 → Acompanhamento 2 → Expansão → Renovação → Cancelamento. Mostra apenas issues do tipo Cliente. Interação, Risco, Oportunidade, Renovação e Plano de Sucesso são vinculados ao Cliente via linked issues.',
        issueTypes: ['Cliente'],
        columns: [
            { name: 'Análise de Perfil' },
            { name: 'Implantação' },
            { name: 'Lançamento' },
            { name: 'Acompanhamento 1' },
            { name: 'Acompanhamento 2' },
            { name: 'Expansão' },
            { name: 'Renovação' },
            { name: 'Cancelamento' },
        ],
    };
}
