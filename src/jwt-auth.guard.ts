// src/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth) throw new UnauthorizedException('Authorization header missing');
    const parts = auth.split(' ');
    if (parts.length !== 2) throw new UnauthorizedException('Bad authorization header');
    const token = parts[1];
    try {
      const secret = process.env.JWT_SECRET || 'CHANGE_ME';
      const payload = jwt.verify(token, secret);
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
