module.exports = {
  apps: [
    {
      name: 'goals-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/root/tests/obdo-test/obdo/goals-dashboard',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
}
