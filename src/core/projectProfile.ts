import { ProjectProfile } from '../types/project';
import { logger } from './logger';

export class ProjectProfileManager {
  private static instance: ProjectProfileManager;
  private currentProfile: ProjectProfile = {
    name: 'My Python/Django App',
    type: 'Web Application',
    languages: ['Python', 'JavaScript', 'HTML/CSS'],
    frameworks: ['Django', 'React', 'Tailwind CSS'],
    runtimes: ['Python 3.13', 'Node 22'],
    packageManagers: ['uv', 'npm'],
    testFrameworks: ['pytest', 'Vitest'],
    buildTools: ['Vite'],
    totalCodeLines: 14280,
    rootPath: '/workspace/my-django-app',
  };

  private constructor() {}

  public static getInstance(): ProjectProfileManager {
    if (!ProjectProfileManager.instance) {
      ProjectProfileManager.instance = new ProjectProfileManager();
    }
    return ProjectProfileManager.instance;
  }

  public getProfile(): ProjectProfile {
    return { ...this.currentProfile };
  }

  public updateProfile(profile: Partial<ProjectProfile>): ProjectProfile {
    this.currentProfile = { ...this.currentProfile, ...profile };
    logger.info(`Project profile updated: ${this.currentProfile.name}`);
    return this.currentProfile;
  }

  public detectFromFiles(fileNames: string[]): ProjectProfile {
    let languages = new Set<string>();
    let frameworks = new Set<string>();
    let runtimes = new Set<string>();
    let packageManagers = new Set<string>();
    let testFrameworks = new Set<string>();
    let buildTools = new Set<string>();
    let type = 'Web Application';

    for (const file of fileNames) {
      const lower = file.toLowerCase();
      if (lower.endsWith('.py') || lower.includes('django') || lower.includes('requirements.txt') || lower.includes('manage.py')) {
        languages.add('Python');
        if (lower.includes('manage.py') || lower.includes('settings.py') || lower.includes('urls.py')) {
          frameworks.add('Django');
        }
        runtimes.add('Python 3.13');
        packageManagers.add('uv');
        testFrameworks.add('pytest');
      }
      if (lower.endsWith('.php') || lower.includes('wp-content') || lower.includes('plugin.php')) {
        languages.add('PHP');
        if (lower.includes('wp-') || lower.includes('plugin.php')) {
          frameworks.add('WordPress');
          type = 'WordPress Plugin';
        }
        runtimes.add('PHP 8.3');
        packageManagers.add('composer');
        testFrameworks.add('PHPUnit');
      }
      if (lower.endsWith('.ts') || lower.endsWith('.tsx') || lower.endsWith('.js') || lower.endsWith('.jsx')) {
        languages.add(lower.endsWith('.ts') || lower.endsWith('.tsx') ? 'TypeScript' : 'JavaScript');
        if (lower.endsWith('.tsx') || lower.endsWith('.jsx') || lower.includes('react')) {
          frameworks.add('React');
        }
        runtimes.add('Node 22');
        packageManagers.add('npm');
        testFrameworks.add('Vitest');
        buildTools.add('Vite');
      }
    }

    if (languages.size === 0) {
      languages.add('TypeScript');
      languages.add('JavaScript');
      frameworks.add('React');
      runtimes.add('Node 22');
      packageManagers.add('npm');
      testFrameworks.add('Vitest');
      buildTools.add('Vite');
    }

    this.currentProfile = {
      ...this.currentProfile,
      languages: Array.from(languages),
      frameworks: Array.from(frameworks),
      runtimes: Array.from(runtimes),
      packageManagers: Array.from(packageManagers),
      testFrameworks: Array.from(testFrameworks),
      buildTools: Array.from(buildTools),
      type,
    };

    logger.info(`Detected project profile: ${this.currentProfile.languages.join(', ')} / ${this.currentProfile.frameworks.join(', ')}`);
    return this.currentProfile;
  }
}

export const projectProfileManager = ProjectProfileManager.getInstance();
