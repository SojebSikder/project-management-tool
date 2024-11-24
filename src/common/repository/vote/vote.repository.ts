import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class VoteRepository {
  /**
   * Update vote count
   * 1 = upvote, 2 = downvote
   * @returns
   */
  static async updateVoteCount(post_id: string) {
    const upvoteCount = await prisma.vote.count({
      where: {
        post_id,
        type: 1,
      },
    });

    const downvoteCount = await prisma.vote.count({
      where: {
        post_id,
        type: 2,
      },
    });

    await prisma.post.update({
      where: {
        id: post_id,
      },
      data: {
        upvote_count: upvoteCount,
        downvote_count: downvoteCount,
      },
    });
  }
}
