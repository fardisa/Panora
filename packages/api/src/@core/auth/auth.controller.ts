import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoggerService } from '@@core/logger/logger.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiKeyDto } from './dto/api-key.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private logger: LoggerService,
  ) {
    this.logger.setContext(AuthController.name);
  }

  @ApiOperation({ operationId: 'signUp', summary: 'Register' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201 })
  @Post('register')
  async registerUser(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @ApiOperation({ operationId: 'signIn', summary: 'Log In' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201 })
  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @ApiOperation({ operationId: 'getUsers', summary: 'Get users' })
  @ApiResponse({ status: 200 })
  @Get('users')
  async users() {
    return this.authService.getUsers();
  }

  @ApiOperation({ operationId: 'getApiKeys', summary: 'Retrieve API Keys' })
  @ApiResponse({ status: 200 })
  @Get('api-keys')
  async apiKeys() {
    return this.authService.getApiKeys();
  }

  @ApiOperation({ operationId: 'generateApiKey', summary: 'Create API Key' })
  @ApiBody({ type: ApiKeyDto })
  @ApiResponse({ status: 201 })
  @UseGuards(JwtAuthGuard)
  @Post('generate-apikey')
  async generateApiKey(@Body() data: ApiKeyDto): Promise<{ api_key: string }> {
    return this.authService.generateApiKeyForUser(
      data.userId,
      data.projectId,
      data.keyName,
    );
  }
}
