import { NextApiRequest, NextApiResponse } from 'next';
import db from 'lib/db';
import withHandler, { ResponseType } from 'lib/server/withHandler';
import { withApiSession } from 'lib/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { name, email } = req.body;
  const user = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return res.status(200).end();
  }
  await db.user.create({
    data: {
      name,
      email,
    },
  });
  return res.status(201).end();
}

export default withApiSession(
  withHandler({ method: 'POST', handler, isPrivate: false })
);
