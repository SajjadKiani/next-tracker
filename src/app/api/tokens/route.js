
import { NextResponse } from "next/server";

export async function GET (req, res) {

    try {
        const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1')
        const result = await response.json()
        return NextResponse.json({result})
    } catch (e) {
        return NextResponse.json({error: e}, {status: 500})
    }
}