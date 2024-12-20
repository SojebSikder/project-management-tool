// external imports
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
//internal imports
import { PrismaService } from '../../prisma/prisma.service';
import { UserRepository } from '../../common/repository/user/user.repository';
// import { StripeMethod } from '../../common/lib/Payment/stripe/Stripe';

@Injectable()
export class AuthService extends PrismaClient {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    super();
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const _password = pass;
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (user) {
      const _isValidPassword = await bcrypt.compare(_password, user.password);
      if (_isValidPassword) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new UnauthorizedException('Password not matched');
      }
    }
    return null;
  }

  async login({ email, userId }) {
    const payload = { email: email, sub: userId };
    const token = this.jwtService.sign(payload);
    return {
      // access_token: token,
      message: 'Logged in successfully',
      authorization: {
        token: token,
        type: 'bearer',
      },
    };
  }

  async register({ fname, lname, username, email, password }) {
    // Check if email and username is exists
    const userEmailExist = await UserRepository.exist({
      field: 'email',
      value: String(email),
    });

    if (userEmailExist) {
      return {
        statusCode: 401,
        message: 'Email already exist',
      };
    }

    const userUserExist = await UserRepository.exist({
      field: 'username',
      value: String(username),
    });

    if (userUserExist) {
      return {
        statusCode: 401,
        message: 'Username already exist',
      };
    }

    const user = await UserRepository.createUser({
      username: username,
      email: email,
      password: password,
    });

    if (user) {
      // create stripe customer
      // await StripeMethod.addNewCustomer({
      //   user_id: user.id,
      //   name: `${user.fname} ${user.lname}`,
      //   email: user.email,
      // });
    }

    return {
      statusCode: 401,
      message: 'Account created successfully',
    };
  }
}
