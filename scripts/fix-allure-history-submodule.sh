#!/usr/bin/env bash
# Run once locally to remove broken allure-history submodule from the repo.
# After this, commit and push. Then you can switch back to actions/checkout in CI if desired.

set -e
cd "$(git rev-parse --show-toplevel)"

if git ls-files --stage | grep -q allure-history; then
  git rm --cached allure-history 2>/dev/null || true
  echo "Removed allure-history from index."
fi

if [ -f .gitmodules ]; then
  if git config -f .gitmodules --get submodule.allure-history.url &>/dev/null; then
    git config -f .gitmodules --remove-section submodule.allure-history
    git add .gitmodules
    echo "Removed allure-history from .gitmodules."
  fi
fi

if [ -d allure-history/.git ]; then
  rm -rf allure-history
  echo "Removed allure-history directory."
fi

echo "Done. Commit and push: git add -A && git commit -m 'chore: remove broken allure-history submodule' && git push"