import { ProjectProfile } from '../types/project';
import { RuleDefinition } from '../types/rules';
import { SkillDefinition } from '../types/skills';
import { projectProfileManager } from './projectProfile';
import { ruleEngine } from './ruleEngine';
import { skillEngine } from './skillEngine';

export interface WorkspaceFileContext {
  path: string;
  content: string;
  language: string;
  isModified?: boolean;
}

export class WorkspaceContext {
  private static instance: WorkspaceContext;
  private activeEditor: WorkspaceFileContext | null = {
    path: 'auth/service.py',
    language: 'python',
    isModified: true,
    content: `"""
Authentication and Authorization Service Module
"""
from typing import Optional, Dict, Any
from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed

class AuthService:
    @staticmethod
    def authenticate_token(token: str) -> Optional[User]:
        if not token or len(token) < 16:
            raise AuthenticationFailed("Invalid token structure.")
        # TODO: Implement cached token resolution with signature check
        return User.objects.filter(is_active=True).first()

    @staticmethod
    def verify_permission(user: User, action: str, resource_id: str) -> bool:
        # Check user capabilities and role-based permissions
        if user.is_superuser:
            return True
        # Enforce strict tenancy verification
        has_perm = user.has_perm(f"app.{action}")
        if not has_perm:
            raise PermissionDenied(f"User lacks required permission: {action}")
        return True
`,
  };

  private openFiles: WorkspaceFileContext[] = [
    {
      path: 'auth/views.py',
      language: 'python',
      content: `from rest_framework.views import APIView
from rest_framework.response import Response
from .service import AuthService

class LoginView(APIView):
    def post(self, request):
        token = request.data.get('token')
        user = AuthService.authenticate_token(token)
        return Response({'status': 'authenticated', 'user_id': user.id})
`,
    },
    {
      path: 'settings.py',
      language: 'python',
      content: `AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
]
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
}
`,
    },
  ];

  private constructor() {}

  public static getInstance(): WorkspaceContext {
    if (!WorkspaceContext.instance) {
      WorkspaceContext.instance = new WorkspaceContext();
    }
    return WorkspaceContext.instance;
  }

  public getActiveEditor(): WorkspaceFileContext | null {
    return this.activeEditor;
  }

  public setActiveEditor(file: WorkspaceFileContext | null): void {
    this.activeEditor = file;
  }

  public getOpenFiles(): WorkspaceFileContext[] {
    return [...this.openFiles];
  }

  public getDiagnosticsSummary(): { count: number; items: Array<{ file: string; line: number; message: string; severity: 'error' | 'warning' }> } {
    return {
      count: 2,
      items: [
        { file: 'auth/service.py', line: 14, message: 'Unresolved database transaction boundary in auth token resolver.', severity: 'warning' },
        { file: 'auth/views.py', line: 8, message: 'Missing permission_classes attribute on LoginView.', severity: 'warning' },
      ],
    };
  }
}

export const workspaceContext = WorkspaceContext.getInstance();
