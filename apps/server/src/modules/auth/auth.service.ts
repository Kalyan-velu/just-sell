import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwt: JwtService) {}

  // NOTE: For simplicity, using plain-text comparison. Replace with a secure hash compare in production.
  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatch = user.password === pass;
    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid credentials');

    // Return minimal user object consumed by LocalStrategy/guards
    return { id: user.id, email: user.email };
  }

  async login(user: { id: string; email?: string | null }) {
    const payload = { sub: user.id, email: user.email ?? undefined };
    const accessToken = await this.jwt.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync(payload, { expiresIn: '7d' });
    await this.userService.setRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) throw new ForbiddenException('Access denied');
    if (user.refreshToken !== refreshToken)
      throw new ForbiddenException('Invalid token');

    // Verify token signature and subject
    const payload = await this.jwt.verifyAsync(refreshToken).catch(() => null);
    if (!payload || payload.sub !== userId)
      throw new ForbiddenException('Invalid token');

    return this.login({ id: userId, email: user.email });
  }

  async logout(userId: string) {
    await this.userService.clearRefreshToken(userId);
    return { success: true };
  }
}
