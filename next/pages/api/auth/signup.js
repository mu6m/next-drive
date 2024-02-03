import bcrypt from "bcrypt";
import { gql } from "graphql-request";
import { client } from "../../../lib/adminDb";
import { generateJWT } from "../../../lib/jwt";

export default async function handler(req, res) {
    if (req.method === "POST") {
      const { username, password } = req.body;
      const { insert_user_one } = await client.request(
        gql`
          mutation registerUser($user: user_insert_input!) {
            insert_user_one(object: $user) {
              id
            }
          }
        `,
        {
          user: {
            username,
            // password: await bcrypt.hash(password, 10),
            password,
          },
        }
      );
    
      const { id: userId } = insert_user_one;
    
      res.send({
        token: generateJWT({
          defaultRole: "user",
          allowedRoles: ["user"],
          otherClaims: {
            "X-Hasura-User-Id": userId,
          },
        }),
      });
    
    }
  }