import {GraphQLClient} from "graphql-request";

export default async function client(query,token = null,variables = {}){
    const api = new GraphQLClient("HASURA_URL");
    if(token != null){
        api.setHeader('Authorization','Bearer '+token);
    }else{
        api.setHeader('x-hasura-role','visitor');
    }
    const data = await api.request({
        document: query,
        variables: variables,
    });
    return data;
}