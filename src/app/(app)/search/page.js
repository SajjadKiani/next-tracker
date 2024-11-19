"use client"
import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Loading from '@/components/common/loding';
import moment from 'moment';
import { Separator } from '@/components/ui/separator';
import { Bookmark, ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Page () {
    const router = useRouter();
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
    
        // Update the URL query string without reloading the page
        router.push(`/search/?q=${searchTerm}`);
    };

    useEffect(() => {
        if (query) {
          setSearchTerm(query);
          fetchSearchResults(query); // Trigger API call on query change
        } else {
          setResults([]); // Clear results if query is empty
        }
    }, [query]);

    const fetchSearchResults = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:3001/api/tokens/${query}`);
          const data = await response.json();
          setResults(data.result || []);
        } catch (error) {
          console.error('Failed to fetch search results:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
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

      const createBookmark = async (data) => {
        try {
            const response = await fetch('http://localhost:3001/api/bookmarks', {method: 'POST', body: JSON.stringify(data)})
            const result = await response.json()
            return result        
        } catch (error) {
            console.log(err);
        }
    }

    return (
        <div className='h-full flex flex-col gap-3'>
            <form onSubmit={handleSearch} className="w-full max-w-md space-y-4">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    
                />
                <Button
                    type="submit"
                    className='w-full'
                >
                    Search
                </Button>
            </form>


            {!isLoading ? results.pairs && results.pairs.map((pair, index) =>
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
                                onClick={() => createBookmark({price: 0, contract: pair.baseToken?.address})}
                            >
                                <Bookmark className='w-7 h-7' />
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
            ) : 
                <Loading />
            }          

        </div>
    )
}