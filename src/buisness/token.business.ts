import { injectable } from "inversify";
import { TokenRepository } from "../repositories/token.repository";
import jwt from "jsonwebtoken";

@injectable()
export class TokenBusinessLayer {
  constructor(private tokenRepository: TokenRepository) {}

  async checkValidToken(token: string): Promise<boolean> {
    return this.tokenRepository.checkFromBlackList(token);
  }

  verifyToken(token: string | null): string | null {
    if (!token) {
      return null;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log(`Error to get secret`);
      process.exit(1);
    }
    try {
      const { id } = jwt.verify(token, secret) as {
        id: string;
      };
      return id;
    } catch {
      return null;
    }
  }
}
