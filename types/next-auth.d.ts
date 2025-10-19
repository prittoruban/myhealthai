import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    dailyOilGoal?: number;
    points?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
  }
}
