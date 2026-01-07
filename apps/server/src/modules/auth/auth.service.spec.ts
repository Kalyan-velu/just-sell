import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findOneByEmail: jest.fn(),
      setRefreshToken: jest.fn(),
      findById: jest.fn(),
      clearRefreshToken: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if password matches', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
      };

      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', password);
      expect(result).toEqual({ id: user.id, email: user.email });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const password = 'password';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        email: 'test@example.com',
        password: hashedPassword,
      };

      (usersService.findOneByEmail as jest.Mock).mockResolvedValue(user);

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
