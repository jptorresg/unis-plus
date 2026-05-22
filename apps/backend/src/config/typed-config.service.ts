import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentVariables } from './config.types';

@Injectable()
export class TypedConfigService extends ConfigService<
  EnvironmentVariables,
  true
> {}
