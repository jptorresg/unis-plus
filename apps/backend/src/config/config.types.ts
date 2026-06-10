export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';

  PORT: number;

  DATABASE_URL: string;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
}
