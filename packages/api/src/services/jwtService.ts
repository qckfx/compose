import * as jose from "jose";

export async function createJwt(payload: Record<string, unknown>) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return jwt;
}

export async function verifyJwt(token: string) {
  const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
  return payload;
}