"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, MoveRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import Loading from "@/components/common/loding";

export default function Page () {

    const [tokens, setTokens] = useState([])
    const [loading, setLoading] = useState(false)
    const [bookmarkLoading, setBookmarkLoading] = useState(false)

    const getTokens = async () => {
        setLoading(true)    
        try {
            const response = await fetch('/api/tokens', {next: {cache: 'no-cache'}})
            const result = await response.json()
            setTokens(result.result)
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false)
        }
    }

    const createBookmark = async (data) => {
        setBookmarkLoading(true)
        try {
            const response = await fetch('/api/bookmarks', {method: 'POST', body: JSON.stringify(data)})
            const result = await response.json()
            return result        
        } catch (error) {
            console.log(err);
        } finally {
            setBookmarkLoading(false)
        }
    }
        

    useEffect(() => {
        getTokens()
    }, [])

    return (
        <div className="h-full flex flex-col gap-3">
            {tokens.map((token, index) => 
                <Card key={index}>
                    <CardContent className='flex flex-col gap-2 px-3 py-2'>
                        <Image
                            src={token.header}
                            width={300}
                            height={200}
                            className="rounded-md w-full"
                        />
                        <Image
                            src={token.icon}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        <h3 className="font-bold">
                            {token.chainId}
                        </h3>
                        <p className="font-light text-gray-600 text-justify text-xs">
                            {token.description}
                        </p>
                        <p className="font-light text-xs truncate">
                            {token.tokenAddress}
                        </p>
                        <div className="w-full flex gap-1 flex-wrap">
                            {token.links && token.links.map((link, index) =>
                                <Link href={link.url} key={index}>
                                    <Badge variant={'secondary'}>
                                        {link.label ? link.label : link.type}
                                    </Badge>
                                </Link>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            {!bookmarkLoading ?
                                <Button variant='outline'
                                    onClick={() => createBookmark({price: 0,contract: token.tokenAddress})}
                                >
                                    <Bookmark />
                                </Button>
                                :
                                <Button variant='outline'>
                                    <Loading />
                                </Button>
                            }   
                            <Button asChild>
                                <Link href={'search/?q=' + token.tokenAddress}>
                                    <Search className="" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
