import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../../lib/server/withSession';
import client from '../../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { content },
    session: { user },
  } = req;
  const created = await client.tweet.create({
    data: {
      content,
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
  });
  if (!created) {
    return res.json({ ok: false });
  }
  return res.json({ ok: true });
}

export default withApiSession(handler);
