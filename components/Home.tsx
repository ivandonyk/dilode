"use client"
import React, { useEffect, useState } from 'react'
import { ITokenDetail } from '@/utils/types';
import { formatNumber } from '@/utils/common';
import DropDownIcon from './DropDownIcon';
import Image from 'next/image';
function Home() {
    const [tokenData, setTokenData] = useState<ITokenDetail[]>([]);
    const [flashRows, setFlashRows] = useState<Set<string>>(new Set());
    useEffect(() => {
        // Initialize WebSocket connection
        const websocket = new WebSocket('wss://general-api-wss-fgpupeioaa-uc.a.run.app');

        // Connection opened
        websocket.onopen = () => {
            console.log('WebSocket is connected.');
            const initialMessage = {
                type: 'market',
                authorization: process.env.NEXT_PUBLIC_TOKEN,
                payload: {
                    assets: [
                        { "name": "Bitcoin" },
                        { "name": "Ethereum" },
                        { "name": "Tether" },
                        { "name": "Pepewifhat" },
                        { "name": "Footboll Play" },
                        { "name": "test" },
                        { "name": "DOMO" },
                        { "name": "Pepe" },
                        { "name": "USDC" },
                        { "name": "USDB" },
                        { "name": "USDC.e" }
                    ],
                    interval: 10
                }
            };
            websocket.send(JSON.stringify(initialMessage));
        };

        // Listen for messages
        websocket.onmessage = (event) => {
            const message = event.data;
            const response = JSON.parse(message).data

            const newTokenData: ITokenDetail[] = []
            Object.keys(response).map(key => {
                const tokenData = response[key] as ITokenDetail
                newTokenData.push(tokenData)
            })
            console.log("newTokenData", newTokenData)

            const dataUpdated: Set<string> = new Set()
            setTokenData((prevTokenData) => {
                newTokenData.map((newTokenDetail) => {
                    const previousTokenDetail = prevTokenData.find(prevTokenDetail => prevTokenDetail.symbol === newTokenDetail.symbol)
                    if (previousTokenDetail) {
                        const hasDataChanged = ["price", "price_change_1m", "price_change_1h", "price_change_24h", "market_cap", "volume"].find(key => (newTokenDetail as any)[key] !== (previousTokenDetail as any)[key])
                        if (hasDataChanged) {
                            dataUpdated.add(newTokenDetail.symbol)
                        }
                    }
                })
                return newTokenData;
            })
            setFlashRows(dataUpdated)
        };

        // Connection closed
        websocket.onclose = () => {
            console.log('WebSocket is closed.');
        };

        // Cleanup on component unmount
        return () => {
            websocket.close();
        };
    }, []);
    useEffect(() => {
        if (flashRows.size === 0) return
        setTimeout(() => {
            setFlashRows(new Set())
        }, 1000)
    }, [flashRows])
    return (
        <table className="min-w-full border border-gray-300 border-collapse">
            <thead>
                <tr>
                    <th className="px-4 py-4 w-5">#</th>
                    <th className="px-4 py-4 text-left">Name</th>
                    <th className="px-4 py-4 text-right">Price</th>
                    <th className="px-4 py-4 w-5">1m%</th>
                    <th className="px-4 py-4 w-5">1h%</th>
                    <th className="px-4 py-4 w-5">24h%</th>
                    <th className="px-4 py-4 text-right">Market Cap</th>
                    <th className="px-4 py-4 text-right">Volume</th>
                </tr>
            </thead>
            <tbody>
                {tokenData.map((row, index) => (
                    <tr key={row.symbol} className={`transition duration-500 ease-in-out transform border ${flashRows.has(row.symbol) ? "flash" : ""}`}>
                        <td className='pl-3 py-6 text-gray-500'>{index + 1}</td>
                        <td className="px-4 py-6 border-none flex gap-2 items-center">
                            {row.logo && <Image src={row.logo} width={30} height={30} alt={row.symbol} />}
                            <p>{row.name}</p>
                            <p className='text-gray-500 font-bold'>{row.symbol}</p>
                        </td>
                        <td className="px-4 py-6 border-none font-bold text-right">$ {formatNumber(row.price)}</td>
                        <td className={`px-4 py-6 border-none font-bold ${row.price_change_1m < 0 ? "text-red-800" : "text-green-600"}`}>
                            <div className='flex items-center'>
                                <DropDownIcon iconDirection={row.price_change_1m < 0 ? "downward" : "upward"} />
                                <p>{row.price_change_1m.toFixed(2)}</p>
                            </div>

                        </td>
                        <td className={`px-4 py-6 border-none font-bold ${row.price_change_1h < 0 ? "text-red-800" : "text-green-600"}`}>
                            <div className='flex items-center'>
                                <DropDownIcon iconDirection={row.price_change_1h < 0 ? "downward" : "upward"} />
                                <p>{row.price_change_1h.toFixed(2)}</p>
                            </div>
                        </td>
                        <td className={`px-4 py-6 border-none font-bold ${row.price_change_24h < 0 ? "text-red-800" : "text-green-600"}`}>
                            <div className='flex items-center'>
                                <DropDownIcon iconDirection={row.price_change_24h < 0 ? "downward" : "upward"} />
                                <p>{row.price_change_24h.toFixed(2)}</p>
                            </div>
                        </td>
                        <td className={`px-4 py-6 border-none text-right`}><p>${formatNumber(row.market_cap)}</p></td>
                        <td className={`px-4 py-6 border-none text-right`}><p>{formatNumber(row.volume)} <span className='text-gray-500 text-sm font-bold'>{row.symbol}</span></p></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Home