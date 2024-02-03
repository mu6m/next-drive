import { GraphQLClient } from "graphql-request";

export const client = new GraphQLClient("HASURA_URL", {
  headers: { "x-hasura-admin-secret": "HASURA_SECRET" },
});