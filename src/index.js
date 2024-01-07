'use strict';
let routes = [] , swagger = [] , swaggerSchemas = [];

if (process.env.COMMON_ROUTES == "true") {
  routes = [...routes, ...require("./common/").routes];
}

if (process.env.USER_ROUTES == "true") {
  routes = [...routes, ...require("./brandPanel").routes];
}

if (process.env.ADMIN_ROUTES == "true") {
  routes = [...routes, ...require("./admin/").routes];
}

if (process.env.MOBILE_ROUTES == "true") {
  routes = [...routes, ...require("./mobile/").routes];
}



module.exports = {
    routes,
    swagger,
    swaggerSchemas
}
