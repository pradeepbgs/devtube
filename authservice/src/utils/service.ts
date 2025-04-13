import * as bcrypt from 'bcrypt'

export const getHashedPassword = async (rawPassowrd:string) => {
    return await bcrypt.hash(rawPassowrd,10);
}