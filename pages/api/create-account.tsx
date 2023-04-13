import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../lib/server/withSession';
import client from '../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, email } = req.body;
  const user = await client.user.findUnique({
    where: {
      email,
    },
  });
  if (user) return res.status(200).end();
  await client.user.create({
    data: {
      name,
      email,
    },
  });
  return res.status(201).end();
}

export default withApiSession(handler);
