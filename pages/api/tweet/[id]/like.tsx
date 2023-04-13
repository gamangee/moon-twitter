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
  const alreadyExists = await client.like.findFirst({
    where: {
      tweetId: +id.toString(),
      userId: user?.id,
    },
  });
  if (alreadyExists) {
    await client.like.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.like.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: +id.toString(),
          },
        },
      },
    });
  }
  res.json({ ok: true });
}

export default withApiSession(handler);
