/** @type {import('pm2').StartOptions} */
module.exports = {
  apps: [
    {
      name: 'gpi-staging',
      cwd: __dirname,
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
}
