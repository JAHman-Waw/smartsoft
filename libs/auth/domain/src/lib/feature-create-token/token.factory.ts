import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Guid } from "guid-typescript";

import { DomainValidationError, IFactory } from "@smartsoft001/domain-core";
import { PasswordService } from "@smartsoft001/utils";

import { User } from "../entities/user.entity";
import { TokenConfig } from "./token.config";
import { IAuthToken, IAuthTokenRequest } from "./interfaces";
import { ITokenPayloadProvider } from "./token-payload.provider";
import { ITokenValidationProvider } from "./token-validation.provider";
import { ITokenUserProvider } from "./token-user.provider";

@Injectable()
export class TokenFactory
  implements
    IFactory<
      IAuthToken,
      {
        request: IAuthTokenRequest;
        payloadProvider?: ITokenPayloadProvider;
        validationProvider?: ITokenValidationProvider;
        userProvider?: ITokenUserProvider;
      }
    > {
  private _invalidUsernameOrPasswordMessage = "Invalid username or password";

  constructor(
    private config: TokenConfig,
    @InjectRepository(User) private repository: Repository<User>,
    private jwtService: JwtService
  ) {}

  static getQuery(config: IAuthTokenRequest): Partial<User> {
    return config.grant_type === "password"
      ? { username: config.username }
      : { authRefreshToken: config.refresh_token };
  }

  static checkDisabled(user: User) {
    if (user.disabled) throw new DomainValidationError("user disabled");
  }

  async create(options: {
    request: IAuthTokenRequest;
    payloadProvider?: ITokenPayloadProvider;
    validationProvider?: ITokenValidationProvider;
    userProvider?: ITokenUserProvider;
  }): Promise<IAuthToken> {
    this.valid(options.request);

    const query = TokenFactory.getQuery(options.request);
    const user = options.userProvider
      ? await options.userProvider.get(query, options.request)
      : await this.repository.findOne(query);

    if (!options.validationProvider || !options.validationProvider.replace) {
      this.checkUser(options.request, user);
      TokenFactory.checkDisabled(user);
      await this.checkPassword(options.request, user);
    }

    if (options.validationProvider) {
      await options.validationProvider.check({
        request: options.request,
        user,
      });
    }

    const refreshToken = Guid.raw();
    await this.repository.update(query, {
      authRefreshToken: refreshToken,
    });

    const payload = {
      permissions: user.permissions,
      scope: options.request.scope,
    };

    if (options.payloadProvider) {
      await options.payloadProvider.change(payload, {
        user,
        request: options.request,
      });
    }

    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      expired_in: this.config.expiredIn,
      // eslint-disable-next-line @typescript-eslint/camelcase
      token_type: "bearer",
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.config.expiredIn,
        subject: user.username,
      }),
      // eslint-disable-next-line @typescript-eslint/camelcase
      refresh_token: refreshToken,
    };
  }

  private checkUser(config: IAuthTokenRequest, user: User): void {
    if (!user)
      throw new DomainValidationError(
        config.grant_type === "password"
          ? this._invalidUsernameOrPasswordMessage
          : "Invalid token"
      );
  }

  private async checkPassword(
    config: IAuthTokenRequest,
    user: User
  ): Promise<void> {
    if (
      config.grant_type === "password" &&
      !(await PasswordService.compare(config.password, user.password))
    )
      throw new DomainValidationError(this._invalidUsernameOrPasswordMessage);
  }

  private valid(req: NonNullable<IAuthTokenRequest>): void {
    if (!req) throw new DomainValidationError("config is empty");
    if (!req.grant_type) throw new DomainValidationError("grant_type is empty");

    // password
    if (req.grant_type === "password") {
      if (!req.username) throw new DomainValidationError("username is empty");
      if (!req.password) throw new DomainValidationError("password is empty");
      if (!req.client_id) throw new DomainValidationError("client_id is empty");
      if (!this.config.clients.some((c) => c === req.client_id))
        throw new DomainValidationError("client_id is incorrect");

      // refres token
    } else if (req.grant_type === "refresh_token") {
      if (!req.refresh_token)
        throw new DomainValidationError("refresh_token is empty");
    } else {
      throw new DomainValidationError("grant_type is incorrect");
    }
  }
}
