import { Body, Controller, Get, Post, UseGuards, Req, Param, Patch, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get() findAll() { return this.coursesService.findAll(); }
  
  @Get(':id') findOne(@Param('id') id: string) { return this.coursesService.findOne(id); }

  @UseGuards(JwtAuthGuard) @Get('my-courses') findMyCourses(@Req() req: any) { return this.coursesService.findMyCourses(req.user); }
  @UseGuards(JwtAuthGuard) @Get('my-enrollments') findMyEnrollments(@Req() req: any) { return this.coursesService.findMyEnrollments(req.user); }
  @UseGuards(JwtAuthGuard) @Get('admin/all') findAllForAdmin(@Req() req: any) { return this.coursesService.findAllForAdmin(req.user); }
  
  @UseGuards(JwtAuthGuard) 
  @Post() 
  @UseInterceptors(FileInterceptor('coverImage', {
    storage: diskStorage({ destination: join(process.cwd(), 'uploads'), filename: (req, file, cb) => cb(null, `cover-${Date.now()}${extname(file.originalname)}`) }),
  }))
  create(@Body() dto: any, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    if (!dto.title || !dto.description) throw new BadRequestException('Champs manquants');
    const coverImage = file ? `http://localhost:4000/uploads/${file.filename}` : undefined;
    return this.coursesService.create({ title: dto.title, description: dto.description, subject: dto.subject, exam: dto.exam, price: parseInt(dto.price, 10) }, req.user, coverImage);
  }

  @UseGuards(JwtAuthGuard) @Post(':id/enroll') enroll(@Param('id') id: string, @Req() req: any) { return this.coursesService.enroll(id, req.user); }
  @UseGuards(JwtAuthGuard) @Patch(':id/status') updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) { return this.coursesService.updateStatus(id, status, req.user); }

  @UseGuards(JwtAuthGuard)
  @Post(':id/lessons')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({ destination: join(process.cwd(), 'uploads'), filename: (req, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`) }),
  }))
  addLesson(@Param('id') id: string, @Body() body: any, @Req() req: any, @UploadedFile() file?: Express.Multer.File) {
    const fileUrl = file ? `http://localhost:4000/uploads/${file.filename}` : undefined;
    const fileType = file ? file.mimetype : undefined;
    return this.coursesService.addLesson(id, body, req.user, fileUrl, fileType);
  }

  // --- NOUVELLE ROUTE AVIS ---
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  addReview(@Param('id') id: string, @Body() body: { rating: number, comment: string }, @Req() req: any) {
    return this.coursesService.addReview(id, body.rating, body.comment, req.user);
  }
}