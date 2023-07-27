import bcrypt from "bcrypt";

export const generateHash = async(password: string) => {
  const salt = process.env.SALT;
  if(!salt) {
    console.log(`Error to get ports`);
    process.exit(1);
  }
  return await bcrypt.hash(password, parseInt(salt))
}