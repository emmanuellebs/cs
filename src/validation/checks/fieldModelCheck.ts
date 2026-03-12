import { loadFieldsProvisionConfig } from '../../config/fieldsConfig';
import { ValidationCheckResult } from '../types';

export async function runFieldModelCheck(): Promise<ValidationCheckResult[]> {
  const results: ValidationCheckResult[] = [];
  const fieldsCfg = loadFieldsProvisionConfig();

  for (const f of fieldsCfg.fields) {
    // Tipo sempre mapeado? (hoje o mapKindToTypeAndSearcher cobre todos os kinds suportados)
    let message = `Campo "${f.name}" com tipo lógico "${f.kind}".`;
    let status: 'pass' | 'warn' = 'pass';
    let severity: 'info' | 'low' = 'info';

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

