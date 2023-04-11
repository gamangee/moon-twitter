import { NextApiRequest, NextApiResponse } from 'next';
import db from 'lib/db';
import withHandler, { ResponseType } from 'lib/server/withHandler';
import { withApiSession } from 'lib/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const userInfo = await db.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    userInfo,
  });
}

export default withApiSession(withHandler({ method: 'GET', handler }));
