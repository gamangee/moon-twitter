import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../lib/server/withSession';
import client from '../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (!req.session.user) {
    return res.json({ ok: false });
  }
  const user = await client.user.findUnique({
    where: {
      id: req.session.user.id,
    },
  });

  if (!user) {
    return res.json({ ok: false });
  }
  return res.json({ ok: true, user });
}

export default withApiSession(handler);
