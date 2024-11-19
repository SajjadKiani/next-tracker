
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const getTokens = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/tokens')
        const result = await response.json()
        return result
    } catch (e) {
        console.log(e);
    }
}

export default async function Page () {

    const tokens = await getTokens()

    return (
        <div className="h-full flex flex-col gap-3">
            {tokens.result.map((token, index) => 
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
                            <Button variant='outline'>
                                <Bookmark />
                            </Button>
                            <Button asChild>
                                <Link href={'detail/' + token.tokenAddress}>
                                    <MoveRight className="" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
