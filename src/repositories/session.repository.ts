import { injectable } from 'tsyringe';

import type {
  Session,
  SessionRepository as SessionRepositoryInterface,
} from '@/interfaces';

/** DynamoDB structure
 - PK: session
 - SK: user_id:{user_id}
 - Content: { access_token, refresh_token, expires_at, user_id }
 - TTL: INT
 */

@injectable()
export class SessionRepository implements SessionRepositoryInterface {
  private sessions: Session[] = [];

  async upsert(session: Session): Promise<Session> {
    const index = this.sessions.findIndex(
      (userSession) => userSession.user_id === session.user_id,
    );

    if (index !== -1) {
      // Update an existing session
      this.sessions[index] = session;
    } else {
      this.sessions.push(session);
    }

    return session;
  }

  async deleteByUserId({ user_id }: { user_id: string }): Promise<void> {
    this.sessions = this.sessions.filter(
      (session) => session.user_id !== user_id,
    );
  }

  async findByUserId({
    user_id,
  }: {
    user_id: string;
  }): Promise<Session | null> {
    const session = this.sessions.find(
      (userSession) => userSession.user_id === user_id,
    );

    return session || null;
  }
}
