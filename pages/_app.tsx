import { MetaMaskInpageProvider } from '@metamask/providers';
import '../styles/globals.css'
import type { AppProps } from 'next/app'

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
