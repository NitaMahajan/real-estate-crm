# Contributing

Branching:
- `main`: production (protected)
- `develop`: integration branch
- Feature branches: `feature/<desc>`

Workflow:
1. Create feature branch from `develop`
2. Push and open PR targeting `develop`
3. Add reviewer(s)
4. Ensure CI passes (lint + tests)
5. Merge after approval

Pre-commit:
- We run lint & formatting on staged files automatically via Husky + lint-staged.
