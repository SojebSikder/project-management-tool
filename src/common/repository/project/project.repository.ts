import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectRepository {
  static async createProject(
    user_id: string,
    name: string,
    description?: string,
  ) {
    try {
      const data = {};
      if (name) {
        data['name'] = name;
      }
      if (description) {
        data['description'] = description;
      }

      const project = await prisma.project.create({
        data: {
          ...data,
          user_id,
        },
      });

      if (project) {
        await prisma.projectMember.create({
          data: {
            user_id: user_id,
            project_id: project.id,
            role_id: '2', // admin
          },
        });

        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
