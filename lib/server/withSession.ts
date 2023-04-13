import { withIronSessionApiRoute } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: 'twitterSession',
  password: '8PAg0kA8hV1TFxjKGD9rwqFTTGgszDDCd3QnLdLs',
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}
