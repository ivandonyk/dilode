import Image from "next/image";
import Home from "@/components/Home";
import Head from 'next/head'

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <Head>
        <title>Diode Crypto Price Tracker</title>
      </Head>
      <Home />
    </main>
  );
}
