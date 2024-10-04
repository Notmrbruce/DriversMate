import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { agrandir } from '../fonts'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${agrandir.variable} font-agrandir`}>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp