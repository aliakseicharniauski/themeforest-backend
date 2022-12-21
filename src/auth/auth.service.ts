import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { User } from 'src/auth/user.entity';
import { AuthProvider } from './auth-provider.enum';
import { UsersRepository } from './users.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {}

  private readonly JWT_SECRET = this.configService.get('JWT_SECRET'); // TODO: replace secret key

  async validateOAuthLogin(profile, provider: AuthProvider): Promise<string> {
    try {
      const { id: thirdPartyId, name, emails, photos } = profile;

      // TODO: separate to service method
      const user: User = await this.usersRepository.findOne({
        where: { thirdPartyId },
      });

      if (!user) {
        const createUserDto = {
          thirdPartyId,
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
        };

        // TODO: separate to service method
        await this.usersRepository.createUser(createUserDto);
      }

      const payload = {
        thirdPartyId,
        provider,
      };

      const jwt: string = sign(payload, this.JWT_SECRET, {
        expiresIn: 60 * 60,
      });

      return jwt;
    } catch (err) {
      throw new InternalServerErrorException('validateOAuthLogin', err.message);
    }
  }
}
