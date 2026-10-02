import { Body, Controller, Post } from '@nestjs/common';

import { ApiEndpoint, Auth, CurrentUser } from '@/common/decorators';
import { IdParamDto } from '@/common/dto';

import { AuthService } from './AuthService';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/request';
import { AuthDto } from './dto/response';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiEndpoint({
    summary: 'Register a new user',
    description:
      'Creates an account with the USER role. Log in afterwards to get tokens.',
  })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Post('/login')
  @ApiEndpoint({
    summary: 'Log in',
    description: 'Returns the user and an access and refresh token pair.',
    type: AuthDto,
  })
  async login(@Body() dto: LoginDto): Promise<AuthDto> {
    return this.authService.login(dto);
  }

  @Post('/refresh-token')
  @ApiEndpoint({
    summary: 'Refresh tokens',
    description: 'Swaps a valid refresh token for a new token pair.',
    type: AuthDto,
  })
  async refreshToken(@Body() dto: RefreshTokenDto): Promise<AuthDto> {
    return this.authService.refresh(dto);
  }

  @Post('/logout')
  @Auth()
  @ApiEndpoint({
    summary: 'Log out',
    description: 'Revokes every access and refresh token of the current user.',
  })
  async logout(@CurrentUser('sub') { id }: IdParamDto): Promise<void> {
    await this.authService.logout(id);
  }
}
