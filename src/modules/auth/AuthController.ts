import { Body, Controller, HttpStatus, Post, Version } from '@nestjs/common';

import { ApiEndpoint, Auth } from '@/common/decorators';

import { AuthService } from './AuthService';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/request';
import { AuthDto } from './dto/response';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Version('1')
  @ApiEndpoint({
    summary: 'Register a new user',
    description:
      'Creates an account with the USER role. Log in afterwards to get tokens.',
    status: HttpStatus.CREATED,
  })
  @Post('/register')
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Version('1')
  @ApiEndpoint({
    summary: 'Log in',
    description: 'Returns the user and an access and refresh token pair.',
    type: AuthDto,
  })
  @Post('/login')
  async login(@Body() dto: LoginDto): Promise<AuthDto> {
    return this.authService.login(dto);
  }

  @Auth()
  @Version('1')
  @ApiEndpoint({
    summary: 'Refresh tokens',
    description: 'Swaps a valid refresh token for a new token pair.',
    type: AuthDto,
  })
  @Post('/refresh-token')
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AuthDto> {
    return this.authService.refresh(dto);
  }
}
