require('dotenv').config({ path: '../.env.deploy' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_REF = 'origin/master',
  DEPLOY_REPO,
  DEPLOY_PATH_FRONTEND,
} = process.env;

module.exports = {
  apps: [{
    name: 'mesto-frontend',
    script: 'serve',
    args: '-s frontend/build -l 3001',
    cwd: `${DEPLOY_PATH_FRONTEND}/current`,
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
      'post-deploy': 'cd frontend && npm ci && npm run build',
      'pre-setup': '',
    },
  },
};