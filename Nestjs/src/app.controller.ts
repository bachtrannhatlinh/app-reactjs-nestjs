import { Controller, Get, Post, Render, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { LocalAuthGuard } from '@/stateful/passport/stateful.local.auth.guard';
// import { Request, Response } from 'express';
import { AuthenticatedGuard } from './stateful/passport/stateful.local.authenticated.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './auth/decorator/customize';
import { CompaniesService } from './companies/companies.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly authService: AuthService
  ) { }


  // @Get()
  // getHomePage(@Req() req: Request, @Res() res: Response) {
  //   const isAuthenticated = req.isAuthenticated();
  //   return res.render('home', { isAuthenticated })
  // }

  // @Post('logout')
  // logout(@Req() req: Request, @Res() res: Response) {
  //   /* destroys user session */
  //   req.session.destroy(function (err) {
  //     if (err) console.log(err)
  //     return res.redirect("/")
  //   });

  // }
}
