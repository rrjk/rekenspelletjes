module.exports = {
  "*.ts": [
    "eslint --cache",
    "prettier --write",
    "lit-analyzer --maxWarnings 0",
    () => "tsc --noEmit --skipLibCheck -p tsconfig.json",
  ],
  "*.js": ["eslint --cache", "prettier --write"],
};
