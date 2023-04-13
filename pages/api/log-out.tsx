import { NextApiRequest, NextApiResponse } from 'next';
import { ResponseType, withApiSession } from '../../lib/server/withSession';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  req.session.destroy();
  res.json({ ok: true });
}

export default withApiSession(handler);
