import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req, res) {
  try {
    // Parse the request body
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, {status: 400});
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, {status: 401});
    }

    // Compare the provided password with the hashed token in the database
    const isPasswordValid = await bcrypt.compare(password, user.token);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, {status: 401});
    }

    // Create a cookie with the hashed token
    cookies().set('auth_token', user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      path: '/',
    });

    // Respond with success
    return NextResponse.json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
}
