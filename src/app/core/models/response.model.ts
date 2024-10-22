import { User } from "./user.model";



export interface AuthResponse {
    data: {
      user: User;
      profile?: User;
      email?:string;
      token?: string;
    };
    message: string;
  }

