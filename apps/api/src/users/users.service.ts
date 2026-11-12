import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, fullName: string, bio: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { fullName, bio },
      select: { id: true, email: true, fullName: true, bio: true, role: true },
    });
  }

  async getTeacherProfile(id: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        bio: true,
        role: true,
        courses: {
          where: { status: 'PUBLISHED' }, // On ne montre que les cours publiés
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!teacher || teacher.role !== 'TEACHER') {
      throw new NotFoundException('Professeur introuvable');
    }

    return teacher;
  }
}