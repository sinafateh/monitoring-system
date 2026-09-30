module.exports = {
  apps: [{
    name: "monitoring-system",
    script: "./server/index.js",
    cwd: "/var/www/monitoring-system",
    env: {
      NODE_ENV: "production",
      PORT: 3001,
    },
    time: true,
    autorestart: true,
    max_memory_restart: "512M",
  }],
};
