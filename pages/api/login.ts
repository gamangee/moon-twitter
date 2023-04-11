import { NextApiRequest, NextApiResponse } from 'next';
import db from 'lib/db';
import withHandler, { ResponseType } from 'lib/server/withHandler';
import { withApiSession } from 'lib/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;

  const payload = phone ? { phone } : email ? { email } : null;
  const user = await db.user.findUnique({
    where: {
      ...payload,
    },
  });
  if (!user) {
    return res.status(400).json({ ok: false });
  }
  req.session.user = {
    id: user.id,
  };
  await req.session.save();
  return res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({ method: 'POST', handler, isPrivate: false })
);
