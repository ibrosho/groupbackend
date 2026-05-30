import jwt from 'jsonwebtoken';

export const generateTokens = async (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({id}, process.env.JWT_SECRET,
     {
        expiresIn: "1d"
    })

    return token;
}