module.exports =
  process.env.MONGODB_URL ||
  "mongodb://host.docker.internal:27017,host.docker.internal:27018,host.docker.internal:27019/database";
