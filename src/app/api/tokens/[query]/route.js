import { NextResponse } from "next/server";


export async function GET (req, { params }) {

    const {query} = params
    try {
        const resposne = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${query}`)
        const result = await resposne.json()
        return NextResponse.json({result})
    } catch (e) {
        return NextResponse.json({error: e}, {status: 500})
    }
}