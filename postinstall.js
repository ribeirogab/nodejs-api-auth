const fs = require('fs');
const path = require('path');

const NODEJS_DEPENDENCIES_DIR = path.resolve(
  process.cwd(),
  'infra',
  'lambda',
  'layers',
  'nodejs',
);
const NPMRC_FILEPATH = path.resolve(process.cwd(), '.npmrc');

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf8'),
);

let dependencies = {};

if (packageJson.dependencies) {
  dependencies = packageJson.dependencies;
}

if (!fs.existsSync(NODEJS_DEPENDENCIES_DIR)) {
  fs.mkdirSync(NODEJS_DEPENDENCIES_DIR, { recursive: true });
}

fs.writeFileSync(
  `${NODEJS_DEPENDENCIES_DIR}/package.json`,
  JSON.stringify({ dependencies }, null, 2),
);

if (fs.existsSync(NPMRC_FILEPATH)) {
  fs.copyFileSync(NPMRC_FILEPATH, `${NODEJS_DEPENDENCIES_DIR}/.npmrc`);
}
