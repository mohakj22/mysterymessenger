/* eslint-disable */
// Disables all ESLint rules

/* tslint:disable */
// Disables TSLint rules if you're using TSLint

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth from "next-auth";
import { authOptions } from "./options";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
