import bcrypt from "bcrypt";
import crypto from "crypto";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashPass) => {
  return bcrypt.compare(password, hashPass);
};

const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

const generateToken = (bytes) => {
    if(typeof bytes !== "number" || bytes <= 0){
        throw new Error("Token size must be a postive number");
    }
    const token = crypto.randomBytes(bytes).toString("hex");
    return token
}

const hashToken = (rawToken) => {
    const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return hashToken
}

const generateOTP = () => {
    let otp = '';
    for(let i = 0; i < 6; i++){
        const digit = crypto.randomInt(0, 10);
        otp += digit.toString()
    }
    return otp
}


export const helperFunction = {
  hashPassword,
  comparePassword,
  pick,
  generateToken,
  hashToken,
  generateOTP
};
