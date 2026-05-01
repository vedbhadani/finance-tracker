const morgan = require("morgan");

// Custom format for morgan or just use 'dev'
const logger = morgan("dev");

module.exports = logger;
