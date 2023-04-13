import { NextApiRequest, NextApiResponse } from 'next';
import {
  ResponseType,
  withApiSession,
} from '../../../../lib/server/withSession';
import client from '../../../../lib/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const tweetDetail = await client.tweet.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });
  if (!tweetDetail) {
    return res.json({ ok: false });
  }
  const isLiked = Boolean(
    await client.like.findFirst({
      where: {
        tweetId: tweetDetail?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );
  return res.json({
    ok: true,
    tweetDetail,
    isLiked,
  });
}

export default withApiSession(handler);
