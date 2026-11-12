import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: dto.name,
        email: dto.email,
        subject: dto.subject,
        message: dto.message,
      },
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}