"use client"
import React, { useEffect, useState } from 'react'
import { ITokenDetail } from '@/utils/types';
import Image from 'next/image';
function Home() {
    const [tokenData, setTokenData] = useState<ITokenDetail[]>([]);
    const [flashRows, setFlashRows] = useState<Set<string>>(new Set());
    const token = process.env.NEXT_PUBLIC_TOKEN;
    useEffect(() => {
        // Initialize WebSocket connection
        const websocket = new WebSocket('wss://general-api-wss-fgpupeioaa-uc.a.run.app');

        // Connection opened
        websocket.onopen = () => {
            console.log('WebSocket is connected.');
            const initialMessage = {
                type: 'market',
                authorization: token,
                payload: {
                    assets: [
                        { "name": "Bitcoin" },
                        { "name": "Ethereum" },
                        { "name": "Tether" },
                    ],
                    interval: 10
                }
            };
            websocket.send(JSON.stringify(initialMessage));
        };

        // Listen for messages
        websocket.onmessage = (event) => {
            const message = event.data;
            const new_data: ITokenDetail[] = []
            const data = JSON.parse(message).data
            Object.keys(data).map(key => {
                const new_data_detail = data[key] as ITokenDetail
                new_data.push(new_data_detail)
            })
            const dataChanged: Set<string> = new Set()
            setTokenData((prevData) => {
                Object.keys(new_data).map(key => {
                    const new_data_detail = (new_data as any)[key] as ITokenDetail
                    const previous_data = prevData.find(token => token.symbol === new_data_detail.symbol)
                    if (previous_data) {
                        const has_change = ["price", "price_change_1h", "price_change_24h", "price_change_7d", "market_cap", "volume"].find(key => (new_data_detail as any)[key] !== (previous_data as any)[key])
                        console.log(has_change)
                        if (has_change) {
                            dataChanged.add(new_data_detail.symbol)
                        }
                    }
                })
                return new_data;
            })
            setFlashRows(dataChanged)
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
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border w-3">1h%</th>
                    <th className="px-4 py-2 border w-3">24h%</th>
                    <th className="px-4 py-2 border w-3">7d%</th>
                    <th className="px-4 py-2 border">Market Cap</th>
                    <th className="px-4 py-2 border">Volume</th>
                </tr>
            </thead>
            <tbody>
                {tokenData.map((row, index) => (
                    <tr key={row.symbol} className={`transition duration-500 ease-in-out transform ${flashRows.has(row.symbol) ? "flash" : ""}`}>
                        <td className="px-4 py-2 border flex gap-2 items-center">
                            <Image src={row.logo} width={30} height={30} alt={row.symbol} />
                            <p>{row.name}</p>
                            <p className='text-gray-500 font-bold'>{row.symbol}</p>
                        </td>
                        <td className="px-4 py-2 border">${row.price}</td>
                        <td className={`px-4 py-2 border font-bold ${row.price_change_1h < 0 ? "text-red-800" : "text-green-600"}`}>{row.price_change_1h.toFixed(2)}</td>
                        <td className={`px-4 py-2 border font-bold ${row.price_change_24h < 0 ? "" : ""}`}>{row.price_change_24h.toFixed(2)}</td>
                        <td className={`px-4 py-2 border font-bold ${row.price_change_7d < 0 ? "" : ""}`}>{row.price_change_7d.toFixed(2)}</td>
                        <td className={`px-4 py-2 border`}>${row.market_cap}</td>
                        <td className={`px-4 py-2 border`}>{row.volume}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Home