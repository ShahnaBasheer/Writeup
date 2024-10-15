import { User } from "./user.model";



export interface AuthResponse {
    data: any;
    user: User;
    message: string;
  }

