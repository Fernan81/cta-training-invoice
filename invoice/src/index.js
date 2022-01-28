const { runHookApp } = require("@forrestjs/hooks");
const apollo = require("@forrestjs/service-apollo");
const fastify = require("@forrestjs/service-fastify");
const fastifyHealthz = require("@forrestjs/service-fastify-healthz");
const envalid = require('envalid');

const validateEnv = envalid.cleanEnv(process.env, {
  NODE_ENV: envalid.str({
    chose: ['development', 'production']
  }),
  FASTIFY_PORT: envalid.num({
    desc: 'local port where to run Fastify',
    default: 4000
  }),
  HASURA_ENDPOINT: envalid.str({
    desc: 'full rl to a GraphQL API'
  }),
});

runHookApp({
  trace: "compact",
  settings: {
      fastify: {
          port: validateEnv.FASTIFY_PORT
      },
      apollo: {
          client: {
            config: {
              uri: process.env.HASURA_ENDPOINT,
            }
          }
      }
  },
  services: [
      apollo,
      fastify, 
      fastifyHealthz,
    ],
  features: [
      homePageRoute,
      infoFeature,
      multiplyRoute
  ]
}).catch(console.error);