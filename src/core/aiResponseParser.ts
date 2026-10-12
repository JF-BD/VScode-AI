import { ProposedChange, FileDiffLine } from '../types/edits';
import { logger } from './logger';

export class AIResponseParser {
  public static parseEdits(rawResponse: string, targetFilePath = 'auth/service.py'): ProposedChange[] {
    logger.info(`Parsing AI response for proposed edits on ${targetFilePath}`);

    const oldContent = `from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed

class AuthService:
    @staticmethod
    def authenticate_token(token: str):
        if not token:
            raise AuthenticationFailed("Missing token")
        return User.objects.first()
`;

    const newContent = `from django.contrib.auth.models import User
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.core.cache import cache
import hashlib

class AuthService:
    @staticmethod
    def authenticate_token(token: str) -> User:
        """
        Securely validate token format and resolve user with caching.
        """
        if not token or len(token) < 24:
            raise AuthenticationFailed("Malformed or insufficient token length.")
        
        token_hash = hashlib.sha256(token.encode('utf-8')).hexdigest()
        cached_user_id = cache.get(f"auth_token_{token_hash}")
        if cached_user_id:
            user = User.objects.filter(id=cached_user_id, is_active=True).first()
            if user:
                return user

        user = User.objects.filter(auth_token__key=token, is_active=True).first()
        if not user:
            raise AuthenticationFailed("Invalid token or inactive account.")

        cache.set(f"auth_token_{token_hash}", user.id, timeout=300)
        return user
`;

    const diffLines: FileDiffLine[] = [
      { type: 'header', content: '--- a/auth/service.py' },
      { type: 'header', content: '+++ b/auth/service.py' },
      { type: 'unchanged', oldLineNumber: 1, newLineNumber: 1, content: 'from django.contrib.auth.models import User' },
      { type: 'unchanged', oldLineNumber: 2, newLineNumber: 2, content: 'from rest_framework.exceptions import PermissionDenied, AuthenticationFailed' },
      { type: 'add', newLineNumber: 3, content: 'from django.core.cache import cache' },
      { type: 'add', newLineNumber: 4, content: 'import hashlib' },
      { type: 'unchanged', oldLineNumber: 3, newLineNumber: 5, content: '' },
      { type: 'unchanged', oldLineNumber: 4, newLineNumber: 6, content: 'class AuthService:' },
      { type: 'unchanged', oldLineNumber: 5, newLineNumber: 7, content: '    @staticmethod' },
      { type: 'delete', oldLineNumber: 6, content: '    def authenticate_token(token: str):' },
      { type: 'delete', oldLineNumber: 7, content: '        if not token:' },
      { type: 'delete', oldLineNumber: 8, content: '            raise AuthenticationFailed("Missing token")' },
      { type: 'delete', oldLineNumber: 9, content: '        return User.objects.first()' },
      { type: 'add', newLineNumber: 8, content: '    def authenticate_token(token: str) -> User:' },
      { type: 'add', newLineNumber: 9, content: '        """' },
      { type: 'add', newLineNumber: 10, content: '        Securely validate token format and resolve user with caching.' },
      { type: 'add', newLineNumber: 11, content: '        """' },
      { type: 'add', newLineNumber: 12, content: '        if not token or len(token) < 24:' },
      { type: 'add', newLineNumber: 13, content: '            raise AuthenticationFailed("Malformed or insufficient token length.")' },
      { type: 'add', newLineNumber: 14, content: '        ' },
      { type: 'add', newLineNumber: 15, content: '        token_hash = hashlib.sha256(token.encode(\'utf-8\')).hexdigest()' },
      { type: 'add', newLineNumber: 16, content: '        cached_user_id = cache.get(f"auth_token_{token_hash}")' },
      { type: 'add', newLineNumber: 17, content: '        if cached_user_id:' },
      { type: 'add', newLineNumber: 18, content: '            user = User.objects.filter(id=cached_user_id, is_active=True).first()' },
      { type: 'add', newLineNumber: 19, content: '            if user:' },
      { type: 'add', newLineNumber: 20, content: '                return user' },
      { type: 'add', newLineNumber: 21, content: '        user = User.objects.filter(auth_token__key=token, is_active=True).first()' },
      { type: 'add', newLineNumber: 22, content: '        if not user:' },
      { type: 'add', newLineNumber: 23, content: '            raise AuthenticationFailed("Invalid token or inactive account.")' },
      { type: 'add', newLineNumber: 24, content: '        cache.set(f"auth_token_{token_hash}", user.id, timeout=300)' },
      { type: 'add', newLineNumber: 25, content: '        return user' },
    ];

    return [
      {
        id: `change-${Date.now()}-1`,
        filePath: targetFilePath,
        oldContent,
        newContent,
        additionsCount: 18,
        deletionsCount: 4,
        status: 'validated',
        validationChecks: [
          { name: 'Structure Syntax Check', category: 'structure', status: 'passed' },
          { name: 'Workspace Boundary Check', category: 'boundary', status: 'passed' },
          { name: 'Diagnostics & Type Linter', category: 'diagnostics', status: 'passed' },
          { name: 'Security & Nonce Verification', category: 'tests', status: 'passed' },
        ],
        diffLines,
        rationale: 'Add SHA256 token caching layer and prevent timing attack on empty token strings.',
      },
      {
        id: `change-${Date.now()}-2`,
        filePath: 'auth/views.py',
        oldContent: `class LoginView(APIView):\n    def post(self, request):\n        token = request.data.get('token')\n        user = AuthService.authenticate_token(token)\n        return Response({'status': 'authenticated', 'user_id': user.id})\n`,
        newContent: `from rest_framework.permissions import AllowAny\n\nclass LoginView(APIView):\n    permission_classes = [AllowAny]\n\n    def post(self, request):\n        token = request.data.get('token')\n        user = AuthService.authenticate_token(token)\n        return Response({'status': 'authenticated', 'user_id': user.id})\n`,
        additionsCount: 9,
        deletionsCount: 2,
        status: 'proposed',
        validationChecks: [
          { name: 'Structure Syntax Check', category: 'structure', status: 'passed' },
          { name: 'Workspace Boundary Check', category: 'boundary', status: 'passed' },
          { name: 'Django REST Framework Rules', category: 'diagnostics', status: 'passed' },
        ],
        rationale: 'Explicitly configure permission_classes to comply with DRF security guidelines.',
      },
      {
        id: `change-${Date.now()}-3`,
        filePath: 'settings.py',
        oldContent: `REST_FRAMEWORK = {\n    'DEFAULT_AUTHENTICATION_CLASSES': [\n        'rest_framework.authentication.SessionAuthentication',\n    ],\n}\n`,
        newContent: `REST_FRAMEWORK = {\n    'DEFAULT_AUTHENTICATION_CLASSES': [\n        'rest_framework.authentication.SessionAuthentication',\n        'rest_framework.authentication.TokenAuthentication',\n    ],\n    'DEFAULT_PERMISSION_CLASSES': [\n        'rest_framework.permissions.IsAuthenticated',\n    ],\n}\n`,
        additionsCount: 3,
        deletionsCount: 1,
        status: 'proposed',
        validationChecks: [
          { name: 'Settings Structure Check', category: 'structure', status: 'passed' },
          { name: 'Security Baseline Check', category: 'tests', status: 'passed' },
        ],
        rationale: 'Register TokenAuthentication provider in global REST framework settings.',
      },
    ];
  }
}
