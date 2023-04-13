import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../../lib/server/withSession';
import client from '../../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const tweets = await client.tweet.findMany({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  if (!tweets) {
    return res.json({ ok: false });
  }
  return res.json({
    ok: true,
    tweets,
  });
}

export default withApiSession(handler);
