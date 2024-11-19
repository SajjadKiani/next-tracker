

import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, {status: 400});
    }

    // Hash the password
    const hashedToken = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        username,
        token: hashedToken,
      },
    });

    // Create a cookie with the hashed token
    cookies().set('auth_token', hashedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      path: '/',
    });

    // Respond with success
    return NextResponse.json({ message: 'User registered successfully', userId: user.id }, {status: 201});
  } catch (error) {
    if (error.code === 'P2002') {
      // Handle unique constraint violation (e.g., username already exists)
      return NextResponse.json({ error: 'Username is already taken' }, {status: 400});
    }

    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
}
