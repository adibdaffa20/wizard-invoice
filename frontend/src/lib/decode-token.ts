import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "@/types/auth";

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}