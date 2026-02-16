require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REF = 'origin/master',
  DEPLOY_REPO,
  DEPLOY_PATH_BACKEND,
  DEPLOY_SSH_KEY = '~/.ssh/id_ed25519_me',
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-backend',
    script: './backend/dist/app.js',
    cwd: `${DEPLOY_PATH_BACKEND}/current`,
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
    max_memory_restart: '1G',
  }],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH_BACKEND,
      key: DEPLOY_SSH_KEY,
      'pre-deploy': `scp -i ${DEPLOY_SSH_KEY} ./backend/.env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH_BACKEND}/current/backend/.env`,
      'post-deploy': 'cd backend && npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
