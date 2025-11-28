const redis = require("ioredis")
const cacheClient = new redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
})

module.exports=cacheClient;