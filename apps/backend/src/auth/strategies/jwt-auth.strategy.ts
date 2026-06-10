import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TypedConfigService } from '../../config/typed-config.service';
import type { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: TypedConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    // El payload ya fue verificado por passport-jwt (firma + expiración)
    // Retornamos directamente — se inyecta en request.user
    return payload;
  }
}
