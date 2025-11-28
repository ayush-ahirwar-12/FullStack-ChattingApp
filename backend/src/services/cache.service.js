import redis from "ioredis"
const cacheClient = new redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,
    password:process.env.REDIS_PASSWORD
})

export default cacheClient;