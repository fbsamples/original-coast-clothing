module.exports = {
  apps : [{
    name: "app",
    script: "npm start",
    watch: true,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: "PROD",
      MODE: "PROD",
    }
  }]
}