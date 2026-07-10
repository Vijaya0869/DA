import { Controller, Inject, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { REQUEST } from '@nestjs/core';

@Controller()
export class BaseController {
  private _request: Request;

  /**
   * Extracts the user ID from the Authorization header
   * @returns User ID
   */
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly jwtService: JwtService,
  ) {
    this._request = request;
  }
  protected getUserIdFromToken(): string {
    let token = this._request.query.t?.toString();
    if (!token) {
      const authHeader = this._request.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header is missing');
      }

      token = authHeader.split(' ')[1];
    }
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Verify the token (Replace 'your-secret-key' with your actual secret)
      const decoded = this.jwtService.verify(token) as any;
      return decoded.userId;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
