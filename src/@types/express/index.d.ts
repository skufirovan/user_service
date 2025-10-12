import { JwtPayload } from "../../service/token-service";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
