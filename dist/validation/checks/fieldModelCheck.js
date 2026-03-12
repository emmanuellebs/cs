"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runFieldModelCheck = runFieldModelCheck;
const fieldsConfig_1 = require("../../config/fieldsConfig");
async function runFieldModelCheck() {
    const results = [];
    const fieldsCfg = (0, fieldsConfig_1.loadFieldsProvisionConfig)();
    for (const f of fieldsCfg.fields) {
        // Tipo sempre mapeado? (hoje o mapKindToTypeAndSearcher cobre todos os kinds suportados)
        let message = `Campo "${f.name}" com tipo lógico "${f.kind}".`;
        let status = 'pass';
        let severity = 'info';
        if (f.kind === 'select' && (!f.options || !f.options.length)) {
            // Essa situação já é tratada como fail em configCheck; aqui reforçamos como warn contextual
            status = 'warn';
            severity = 'low';
            message = `Campo select "${f.name}" não possui opções definidas (ver configCheck).`;
        }
        if (f.kind === 'userPicker') {
            status = 'warn';
            severity = 'low';
            message =
                'Campo userPicker pode ter limitações de configuração por API; confirme manualmente o comportamento desejado.';
        }
        results.push({
            key: `fieldmodel:${f.key}`,
            title: `Validação de modelo de campo "${f.name}"`,
            status,
            severity,
            message,
            blocking: false,
        });
    }
    return results;
}
