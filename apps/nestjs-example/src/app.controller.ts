// Packages
import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// Services
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

// Guards
import { LocalAuthGuard } from './auth/local-auth.guard';

// Dtos
import { RefreshTokenDto } from './auth/dto/refresh-token.dto';
import { RegisterUserDto } from './auth/dto/register-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get()
  getAvailableResources(): Observable<Array<string>> {
    return this.appService.getAvailableResources();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() request) {
    return this.authService.login(request);
  }

  @Post('auth/register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('auth/refresh')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto);
  }
}
