import type { NextApiRequest, NextApiResponse } from 'next'
import validate from "deep-email-validator";

const validateEmail = async(email) => {
    const validateObj = await validate(email);
    return validateObj;
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const validationRes = await validateEmail(req.query.email);
  res.status(200).json(validationRes);
}
