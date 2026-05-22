import Joi from 'joi';

export const envSchema = Joi.object({
  // ─── Servidor ─────────────────────────────────────────────────────────────
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().integer().min(1).max(65535).default(3000),

  // ─── Base de datos ───────────────────────────────────────────────────────
  DATABASE_URL: Joi.string().uri().required(),

  // ─── JWT ─────────────────────────────────────────────────────────────────
  JWT_SECRET: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().min(32).required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  // ─── Cloudinary ──────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),

  CLOUDINARY_API_KEY: Joi.string().required(),

  CLOUDINARY_API_SECRET: Joi.string().required(),

  // ─── SMTP ────────────────────────────────────────────────────────────────
  SMTP_HOST: Joi.string().required(),

  SMTP_PORT: Joi.number().integer().default(587),

  SMTP_USER: Joi.string().required(),

  SMTP_PASS: Joi.string().required(),
});
