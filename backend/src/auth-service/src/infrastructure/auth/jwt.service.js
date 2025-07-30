import jwt from "jsonwebtoken";
import { helperFunction } from "../../utils/helperFunctions.js";

export const generateToknes = (userId) => {
  
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });   

  const refreshToken = helperFunction.generateToken(64);
  const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return { accessToken, refreshToken, refreshTokenExpiry };
};

export const generateEmailToken = (email) => {
    const emailToken = jwt.sign({email, type:"otp_verification"}, process.env.EMAIL_SECRET, {
        expiresIn: "10m"
    });

    return emailToken;
}