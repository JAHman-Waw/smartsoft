export type IAuthTokenRequest = IAuthTokenRequestPassword | IAuthTokenRequestRefreshToken;

export interface IAuthTokenRequestPassword {
    grant_type: "password";
    username: string;
    password: string;
    client_id: string;
}

export interface IAuthTokenRequestRefreshToken {
    grant_type: "refresh_token";
    refresh_token: string;
}

export interface IAuthToken {
    access_token: string;
    refresh_token: string;
    expired_in: number;
    token_type: 'bearer';
}
