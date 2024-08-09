import "@/styles/globals.css";
import Navbar from "../components/Navbar";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
