import {
  BadRequestException,
  Body,
  Controller, Delete,
  HttpCode,
  Inject,
  Post, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ALREADY_EXISTS_ERROR } from './auth.constants';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
  ) {
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const oldUser = await this
      .authService
      .findUser(dto.login);

    if (oldUser) {
      throw new BadRequestException(ALREADY_EXISTS_ERROR);
    }
    return this.authService.createUser(dto);

  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this
      .authService
      .validateUser(login, password);

    return this.authService.login(email);
  }

  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Delete('delete')
  async delete(@Body() { login }: AuthDto) {
    return this.authService.deleteUser(login);
  }
}
