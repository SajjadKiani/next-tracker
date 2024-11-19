
"use client"

import Loading from "@/components/common/loding"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { BookMarked } from "lucide-react"
import moment from "moment"
import { ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import {ArrowUp, ArrowDown} from 'lucide-react'

export default function Page () {
    const [bookmarks, setBookmarks] = useState([])
    const [loading, setLoading] = useState(false)

    const handleBookmarks = async () => {
        setLoading(true);
      
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/bookmarks');
          const result = await response.json();
      
          if (Array.isArray(result.bookmarks)) {
            // Map all queries to fetchSearchResults promises
            const fetchPromises = result.bookmarks.map((bookmark) =>
              fetchSearchResults(bookmark.contract)
            );
      
            // Wait for all promises to resolve
            await Promise.all(fetchPromises);
          } else {
            console.error('Invalid bookmarks response format.');
          }
        } catch (e) {
          console.error('Failed to fetch bookmarks:', e);
        } finally {
          setLoading(false);
        }
    };

    const fetchSearchResults = async (query) => {
        try {
          // Fetch search results for the given query
          const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/tokens/${query}`);
          const data = await response.json();
      
          // Assuming results is an array of all search results
          setBookmarks((prevResults) => [...prevResults, ...data.result.pairs]);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        }
    };

    const formatNumber = (value) => {
        return value ? value.toLocaleString() : 'N/A';
      };
    
      const formatPriceChange = (value) => {
        try{
          const priceChange = parseInt(value)
          return (
            <span className={`${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange}%
              {priceChange >= 0 ?
                <ArrowUp className='w-3 h-3 text-green-500 inline-block' />
                :
                <ArrowDown className='w-3 h-3 text-red-500 inline-block' />
              }
            </span>
          )
        } catch {
          <span>N/A</span>
        }
      }

    useEffect(() => {
        handleBookmarks()
    }, [])
    
    return (
        <div className="h-full flex flex-col gap-2">
            {!loading ?
                bookmarks.map((pair, index) =>
                    <Card key={index}>
                        <CardContent className='py-3'>
                        <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    {pair.info?.imageUrl && (
                                        <Image src={pair.info.imageUrl} alt={pair.baseToken?.symbol} width={40} height={40} className="w-10 h-10 mr-2 rounded-full" />
                                    )}
                                    <h2 className="text-lg font-semibold">{`${pair.baseToken?.symbol || 'Unknown'}/${pair.quoteToken?.symbol || 'Unknown'}`}</h2>
                                </div>
                                <Button variant='ghost' size='small'
                                    // onClick={() => createBookmark({price: 0, contract: pair.baseToken?.address})}
                                >
                                    <BookMarked className='w-7 h-7' />
                                </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 truncate">{`${pair.baseToken?.name || 'Unknown'} / ${pair.quoteToken?.name || 'Unknown'}`}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                <p><strong>Chain:</strong> {pair.chainId || 'N/A'}</p>
                                <p><strong>DEX:</strong> {pair.dexId || 'N/A'}</p>
                                <p><strong>Price (USD):</strong> ${pair.priceUsd ? parseFloat(pair.priceUsd) : 'N/A'}</p>
                                <p><strong>Price (Native):</strong> {pair.priceNative || 'N/A'}</p>
                                </div>
                                <div>
                                <p><strong>Liquidity (USD):</strong> ${formatNumber(pair.liquidity?.usd)}</p>
                                <p><strong>FDV:</strong> ${formatNumber(pair.fdv)}</p>
                                <p><strong>Market Cap:</strong> ${formatNumber(pair.marketCap)}</p>
                                <p><strong>CreatedAt:</strong> {moment(pair.pairCreatedAt).fromNow()}</p>
                                </div>
                            </div>
                            <Separator />
                            {['m5', 'h1', 'h6', 'h24'].map((time, index) =>
                            <div className='text-sm grid grid-cols-3' key={index} >
                                <strong className='mr-2'> {time}: </strong>
                                <p>{formatPriceChange(pair?.priceChange?.[time])} </p>
                                <p>${formatNumber(pair?.volume?.[time])} </p>
                            </div>
                            )}
                            <Separator />
                            <div className="mt-2 flex flex-wrap gap-2">
                                {pair.url && (
                                <a
                                    href={pair.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm flex items-center hover:underline"
                                >
                                    View on DEX <ExternalLinkIcon className="h-4 w-4 ml-1" />
                                </a>
                                )}
                                {/* {pair.baseToken?.address && (
                                <Link
                                    to={`/token/${pair.chainId}/${pair.baseToken.address}`}
                                    className="text-blue-500 text-sm flex items-center hover:underline"
                                >
                                    Token Details <ExternalLinkIcon className="h-4 w-4 ml-1" />
                                </Link>
                                )} */}
                                {pair.info?.websites?.map((website, index) => (
                                <a
                                    key={index}
                                    href={website.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm flex items-center hover:underline"
                                >
                                    Website <ExternalLinkIcon className="h-4 w-4 ml-1" />
                                </a>
                                ))}
                                {pair.info?.socials?.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 text-sm flex items-center hover:underline"
                                >
                                    {social.type} <ExternalLinkIcon className="h-4 w-4 ml-1" />
                                </a>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )
            :
                <Loading />
            }
        </div>
    )
}