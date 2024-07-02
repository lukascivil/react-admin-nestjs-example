// Packages
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Entities
import { UserEntity } from 'src/users/entities/user.entity';

// Dtos
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Models
import { GetOneResult } from 'src/shared/models/get-one-result.model';

// Services
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<GetOneResult<UserEntity> | null> {
    const user = await this.usersService.getOneByEmail(username).toPromise();

    console.log({ username, password, user });

    if (user && user.data?.password === password) {
      // const { password, ...result } = user;

      return user;
    }

    return null;
  }

  // async validateExp(token: string): boolean {
  //   // const decodedToken:  = this.jwtService.decode(token)

  //   // if (decodedToken?.exp) {
  //   //   return false
  //   // }

  //   // const diff = differenceInMinutes(decodedToken?.exp, new Date());
  //   const cafe = this.jwtService.verify(token, {} )

  //   return null;
  // }

  login(user: any): { access_token: string; refresh_token: string } {
    const payload = { username: user.username, sub: user.userId };

    // Set access_token with 15 minutes and refresh_token with 30 minutes
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: 2700 }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: 3600 })
    };
  }

  async register(registerUserDto: RegisterUserDto): Promise<void> {
    await this.usersService.create(registerUserDto).toPromise();
  }

  refresh(refreshTokenDto: RefreshTokenDto): RefreshTokenDto {
    const refreshToken = this.jwtService.verify(refreshTokenDto.refresh_token);

    console.log({ refreshTokenDto, refreshToken });

    if (!refreshToken) {
      throw new HttpException('The token passed was not valid', HttpStatus.UNAUTHORIZED);
    }

    return {
      access_token: this.jwtService.sign({}, { expiresIn: 2700 }),
      refresh_token: this.jwtService.sign({}, { expiresIn: 3600 })
    };
  }
}
