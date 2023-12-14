import bcrypt from "bcrypt";

export const generateHash = async (password: string) => {
  const salt = process.env.SALT;
  if (!salt) {
    console.log(`Error with salt`);
    process.exit(1);
  }
  return await bcrypt.hash(password, parseInt(salt));
};
