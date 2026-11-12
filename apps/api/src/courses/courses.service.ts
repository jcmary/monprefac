import { Injectable, UnauthorizedException, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: any, user: any, coverImage?: string) {
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') throw new UnauthorizedException('Accès refusé');
    return this.prisma.course.create({ 
      data: { title: dto.title, description: dto.description, price: dto.price, subject: dto.subject, exam: dto.exam, coverImage, teacherId: user.userId } 
    });
  }

  async findAll() {
    const courses = await this.prisma.course.findMany({ 
      where: { status: 'PUBLISHED' }, 
      include: { 
        teacher: { select: { id: true, fullName: true } },
        reviews: { select: { rating: true } } // On récupère les notes pour calculer la moyenne
      }, 
      orderBy: { createdAt: 'desc' } 
    });

    // Calcul de la moyenne pour chaque cours
    return courses.map(course => {
      const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
      const average = course.reviews.length > 0 ? (total / course.reviews.length).toFixed(1) : null;
      return { ...course, averageRating: average ? parseFloat(average) : 0, reviewCount: course.reviews.length };
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { 
        teacher: { select: { id: true, fullName: true } },
        lessons: { orderBy: { createdAt: 'asc' } }, 
        _count: { select: { enrollments: true } },
        reviews: { include: { student: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' } }
      },
    });
    if (!course) throw new NotFoundException('Cours introuvable');

    const total = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = course.reviews.length > 0 ? (total / course.reviews.length).toFixed(1) : null;

    return { ...course, averageRating: average ? parseFloat(average) : 0, reviewCount: course.reviews.length };
  }

  async findMyCourses(user: any) {
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') throw new UnauthorizedException('Accès refusé');
    return this.prisma.course.findMany({
      where: { teacherId: user.userId },
      include: { _count: { select: { lessons: true, enrollments: true, reviews: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForAdmin(user: any) {
    if (user.role !== 'ADMIN') throw new UnauthorizedException('Accès refusé');
    return this.prisma.course.findMany({ include: { teacher: { select: { id: true, fullName: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async updateStatus(id: string, status: any, user: any) {
    if (user.role !== 'ADMIN') throw new UnauthorizedException('Accès refusé');
    return this.prisma.course.update({ where: { id }, data: { status } });
  }

  async addLesson(courseId: string, body: any, user: any, fileUrl?: string, fileType?: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course || (course.teacherId !== user.userId && user.role !== 'ADMIN')) throw new UnauthorizedException('Accès refusé');
    return this.prisma.lesson.create({
      data: { title: body.title, content: body.content, courseId, fileUrl, fileType },
    });
  }

  async enroll(courseId: string, user: any) {
    if (user.role !== 'STUDENT') throw new UnauthorizedException('Réservé aux élèves');
    const existing = await this.prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId: user.userId, courseId } } });
    if (existing) throw new ConflictException('Déjà inscrit');
    return this.prisma.enrollment.create({ data: { studentId: user.userId, courseId } });
  }

  async findMyEnrollments(user: any) {
    if (user.role !== 'STUDENT') throw new UnauthorizedException('Réservé aux élèves');
    return this.prisma.enrollment.findMany({ where: { studentId: user.userId }, include: { course: { include: { teacher: { select: { fullName: true } } } } } });
  }

  // --- NOUVELLES METHODES POUR LES AVIS ---
  async addReview(courseId: string, rating: number, comment: string, user: any) {
    if (user.role !== 'STUDENT') throw new UnauthorizedException('Seuls les élèves peuvent noter');
    if (rating < 1 || rating > 5) throw new BadRequestException('La note doit être entre 1 et 5');

    // Vérifier que l'élève est bien inscrit
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: user.userId, courseId } }
    });
    if (!enrollment) throw new UnauthorizedException('Tu dois être inscrit pour noter ce cours');

    // Vérifier s'il n'a pas déjà noté
    const existingReview = await this.prisma.review.findUnique({
      where: { studentId_courseId: { studentId: user.userId, courseId } }
    });
    if (existingReview) throw new ConflictException('Tu as déjà noté ce cours');

    return this.prisma.review.create({
      data: { rating, comment, studentId: user.userId, courseId }
    });
  }
}