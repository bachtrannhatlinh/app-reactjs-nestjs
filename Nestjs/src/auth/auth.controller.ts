import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from '@/stateful/passport/stateful.local.auth.guard';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from './decorator/customize';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { Request, Response, response } from 'express';
import { IUser } from '@/users/users.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User Login')
  @Post('/login')
  handleLogin(
    @Req() req,
    @Res({ passthrough: true })
    response: Response,
  ) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Public()
  @ResponseMessage('Get user information')
  @Get('/account')
  handleGetDataAccount(@User() user: IUser) {
    return { user };
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @User() user: IUser,
    response: Response,
  ) {
    return this.authService.logout(user, response);
  }
}
