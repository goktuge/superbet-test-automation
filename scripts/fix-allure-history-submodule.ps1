# Run once locally to remove broken allure-history submodule. Then commit and push.
$root = git rev-parse --show-toplevel
Set-Location $root

$stage = git ls-files --stage 2>$null
if ($stage -match "allure-history") {
  git rm --cached allure-history 2>$null
  Write-Host "Removed allure-history from index."
}

if (Test-Path .gitmodules) {
  $url = git config -f .gitmodules --get submodule.allure-history.url 2>$null
  if ($url) {
    git config -f .gitmodules --remove-section submodule.allure-history
    git add .gitmodules
    Write-Host "Removed allure-history from .gitmodules."
  }
}

if (Test-Path allure-history\.git) {
  Remove-Item -Recurse -Force allure-history
  Write-Host "Removed allure-history directory."
}

Write-Host "Done. Commit and push: git add -A; git commit -m 'chore: remove broken allure-history submodule'; git push"