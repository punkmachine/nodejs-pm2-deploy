require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REF = 'origin/master',
  DEPLOY_REPO,
  DEPLOY_PATH_FRONTEND,
  DEPLOY_SSH_KEY = '~/.ssh/id_ed25519_deploy',
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-frontend',
    script: 'serve',
    args: '-s frontend/build -l 3001',
    cwd: `${DEPLOY_PATH_FRONTEND || '/home/first-try-yandex/mesto-frontend'}/current`,
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
  }],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_FRONTEND,
      key: DEPLOY_SSH_KEY,
      'pre-deploy': `scp -i ${DEPLOY_SSH_KEY} ./frontend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_FRONTEND}/current/frontend/.env`,
      'post-deploy': 'source ~/.nvm/nvm.sh && cd frontend && npm ci && NODE_OPTIONS=--openssl-legacy-provider npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};