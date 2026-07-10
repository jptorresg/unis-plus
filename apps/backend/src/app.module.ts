import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CommentsModule } from './comments/comments.module';
import { ActiveUserGuard } from './common/guards/active-user.guard';
import { CategoriesGuard } from './common/guards/categories.guard';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AppConfigModule } from './config/config.module';
import { envSchema } from './config/env.schema';
import { ForumsModule } from './forums/forums.module';
import { InstitutionalModule } from './institutional/institutional.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

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
