import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { injectable } from "inversify";
dotenv.config();

const secret: Secret = process.env.JWT_SECRET as Secret;
if (!secret) {
  throw new Error("JWT_SECRET environment variable is missing");
}

@injectable()
export class JwtService {
  async generateJwt(
    id: string,
    expire: string,
    deviceID?: string,
  ): Promise<string> {
    return jwt.sign({ id, deviceId: deviceID }, secret, { expiresIn: expire });
  }

  async getUserByToken(token: string) {
    try {
      const result: any = jwt.verify(token, secret);
      return result;
    } catch {
      return null;
    }
  }
}
