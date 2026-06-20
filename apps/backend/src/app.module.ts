import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ActiveUserGuard } from './common/guards/active-user.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CategoriesGuard } from './common/guards/categories.guard';

import { envSchema } from './config/env.schema';
import { AppConfigModule } from './config/config.module';

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
    ConfigModule.forRoot({
      isGlobal: true,

      validationSchema: envSchema,

      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),

    // Configuraciones
    AppConfigModule,

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
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ActiveUserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CategoriesGuard,
    },
  ],
})
export class AppModule {}
