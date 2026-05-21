import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ForumsModule } from './forums/forums.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { InstitutionalModule } from './institutional/institutional.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    // Variables de entorno (global)
    ConfigModule.forRoot({ isGlobal: true }),

    // Infraestructura compartida
    PrismaModule,
    CloudinaryModule,
    MailModule,

    // Dominios de negocio
    AuthModule,
    UsersModule,
    ForumsModule,
    PostsModule,
    CommentsModule,
    NotificationsModule,
    InstitutionalModule,
    AdminModule,
  ],
})
export class AppModule {}
