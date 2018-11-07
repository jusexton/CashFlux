import { Action } from "@ngrx/store";
import { AuthenticationState, } from "../reducers/authentication.reducer";
import { AuthenticationCredentials, AuthenticationResponse } from "../../services/authentication.service";
import { RegisterResponse } from "../../services/register.service";

export const LOGIN = '[Authentication] Login process started';
export const LOGIN_SUCCESS = '[Authentication] Login was a success';
export const LOGIN_FAIL = '[Authentication] Login was a failure';
export const LOAD_PREVIOUS_LOGIN = '[Authentication] Previous login info loaded';
export const LOGOUT = '[Authentication] Logged out';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: AuthenticationCredentials) { }
}

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;

  constructor(public payload: AuthenticationResponse | RegisterResponse) { }
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;

  constructor(public payload?: any) { }
}

export class LoadPreviousLogin implements Action {
  readonly type = LOAD_PREVIOUS_LOGIN;

  constructor(public payload: AuthenticationState) { }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type Actions = Login | LoginSuccess | LoginFail | LoadPreviousLogin | Logout;