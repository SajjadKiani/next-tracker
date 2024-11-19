import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    // Extract the token from cookies
    const token = cookies().get('auth_token').value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Find the user by token
    const user = await prisma.user.findUnique({
      where: { token },
      include: {
        bookmarks: true, // Include bookmarks in the response
      },
    });
    

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Respond with the user's bookmarks
    return NextResponse.json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
}

export async function POST(req, res) {
  try {
    // Parse the request body
    const { price, contract } = await req.json();

    if (!contract) {
      return NextResponse.json({ error: 'Price and contract are required' }, {status: 400});
    }

    // Extract the token from cookies
    const token = cookies().get('auth_token').value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Find the user by token
    const user = await prisma.user.findUnique({
      where: { token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Create a new bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        price,
        contract,
        userId: user.id, // Associate the bookmark with the user
      },
    });

    // Respond with the created bookmark
    return NextResponse.json({ message: 'Bookmark created successfully', bookmark }, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
}

export async function DELETE(req, res) {
  try {
    // Extract the bookmark ID from the query parameters
    
    // const { id } = req.query;
    const id = '1'

    // Validate the ID is provided and is a valid number
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid bookmark ID' }, {status: 400});
    }

    // Extract the token from cookies
    const token = cookies().get('auth_token').value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Find the user by token
    const user = await prisma.user.findUnique({
      where: { token },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, {status: 401});
    }

    // Check if the bookmark belongs to the user
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: parseInt(id) },
    });

    if (!bookmark || bookmark.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden: You cannot delete this bookmark' }, {status: 403});
    }

    // Delete the bookmark
    await prisma.bookmark.delete({
      where: { id: parseInt(id) },
    });

    // Respond with success
    return NextResponse.json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, {status: 500});
  }
}

