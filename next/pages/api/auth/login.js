import { gql } from "graphql-request";
import { client } from "../../../lib/adminDb";
import { generateJWT } from "../../../lib/jwt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { username, password } = req.body;
        let { user } = await client.request(
        gql`
            query getUserByEmail($username: String!) {
                user(where: { username: { _eq: $username } }) {
                    id
                    password
                }
            }
        `,
        {
            username,
        }
        );
        user = user[0];

        if (!user) {
            res.sendStatus(401);
            return;
        }

        // Check if password matches the hashed version
        // const passwordMatch = await bcrypt.compare(password, user.password);

        if (password == user.password) {
            res.send({
                token: generateJWT({
                defaultRole: "user",
                allowedRoles: ["user"],
                otherClaims: {
                    "X-Hasura-User-Id": user.id,
                },
                }),
            });
        } else {
            res.sendStatus(401);
        }
    }
  }