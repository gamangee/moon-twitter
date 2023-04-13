import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../lib/server/withSession';
import client from '../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email } = req.body;
  const exist = await client.user.findUnique({
    where: {
      email,
    },
  });
  if (!exist) {
    return res.status(404).end();
  }
  req.session.user = {
    id: exist.id,
  };
  await req.session.save();
  return res.status(200).end();
}

export default withApiSession(handler);
