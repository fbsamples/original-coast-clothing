require("dotenv").config()

module.exports = {
  apps : [{
    name: `mu-${process.env.PORT}`,
    script: "npm start",
    watch: true,
    max_memory_restart: '250M',
    env: {
      NODE_ENV: "PROD",
      MODE: "PROD",
    }
  }]
}