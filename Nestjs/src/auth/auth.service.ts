import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/users.interface';
import { RegisterUserDto } from '@/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms'
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidCheckUserPassword(
        pass,
        user.password,
      );
      if (isValid) {
        return user;
      }
    } else {
      return null;
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const {_id, name, email, role} = user
    const payload = { 
      sub: 'token login',
      iss: "from server",
      _id,
      name,
      email,
      role
     };
    
    const refresh_token = this.createRefreshToken(payload)

    // update user with refresh token
    await this.usersService.updateUserToken(refresh_token, _id)

    // set refresh_token as cookies
    response.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED"))
    })
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token,
      _id,
      name,
      email,
      role
    };
  }

  logout = async (user: IUser, response: Response) => {
    await this.usersService.updateUserToken("", user._id);
    response.clearCookie("refresh_token");
    return  "ok"
  }


  async register(registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.register(registerUserDto)
    return ({
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    });
  }

  createRefreshToken = (payload: any) => {
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
      expiresIn: ms(this.configService.get<string>("JWT_REFRESH_EXPIRED")) / 1000,
    })

    return refresh_token;
  }

  processNewToken = async(refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
      })

      let user = await this.usersService.findUserByToken(refreshToken)
      if(user) {
        const {_id, name, email, role} = user
        const payload = { 
          sub: 'token login',
          iss: "from server",
          _id,
          name,
          email,
          role
         };

        const refresh_token = this.createRefreshToken(payload);
           
        await this.usersService.updateUserToken(refresh_token, _id.toString())

        response.clearCookie("refresh_token");

        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
          access_token: this.jwtService.sign(payload),
          refresh_token,
          _id,
          name,
          email,
          role
        };
      }
  
    } catch (error) {
      throw new BadRequestException(`Refresh token không hợp lệ . Vui lòng login.`)      
    }
  }


}
