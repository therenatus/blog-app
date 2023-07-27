import jwt from "jsonwebtoken";

export const CheckToken = (token: string | null): string | null => {
  if(!token){
    return null;
  }
  const secret =  process.env.JWT_SECRET;
  if(!secret){
    console.log(`Error to get secret`);
    process.exit(1);
  }
  try {
    const { id } = jwt.verify(token, secret) as {
      id: string
    };
    return id;
  } catch {
    return null
  }
}