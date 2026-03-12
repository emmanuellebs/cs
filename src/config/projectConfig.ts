import { JiraEnvConfig, loadJiraEnvConfig } from './envConfig';

export interface ProjectProvisionConfig {
  jira: JiraEnvConfig;
  projectTypeKey: 'software' | 'service_desk' | 'business';
  projectTemplateKey: string;
}

export function loadProjectProvisionConfig(): ProjectProvisionConfig {
  const jira = loadJiraEnvConfig();

  // Para CS faz sentido usar um projeto de negócio (Jira Work Management)
  // Template business genérico.
  const projectTypeKey: ProjectProvisionConfig['projectTypeKey'] = 'business';
  const projectTemplateKey = 'com.atlassian.jira-core-project-templates:jira-core-project-management';

  return {
    jira,
    projectTypeKey,
    projectTemplateKey,
  };
}

