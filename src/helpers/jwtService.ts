import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret: Secret = process.env.JWT_SECRET as Secret;
if (!secret) {
  throw new Error("JWT_SECRET environment variable is missing");
}

export class JwtService {
  async generateJwt(id: string, expire: string, deviceID?: string) {
    return jwt.sign({ id, deviceId: deviceID }, secret, { expiresIn: expire });
  }

  async getUserByToken(token: string) {
    console.log("token", token);
    try {
      const result: any = jwt.verify(token, secret);
      console.log(secret);
      console.log("result", result);
      return result;
    } catch {
      return null;
    }
  }
}
