const dns = require("dns").promises;

dns.resolveSrv("_mongodb._tcp.emprega-ai.ncllkdy.mongodb.net")
  .then(console.log)
  .catch(console.error);
