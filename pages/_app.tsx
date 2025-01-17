import '../styles/globals.css'

import { ApolloProvider } from '@apollo/client'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import type { ReactElement, ReactNode } from 'react'

import client from '../src/clients/awellOrchestrationGraphQlClient'
import { MobileNav } from '../src/components/Header/MobileNav'
import { MobileMenu } from '../src/components/Sidebar/Menu/'
import { AppProvider } from '../src/contexts/app/AppContext'
import { ThemeProvider } from '../src/hooks/useTheme'

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: ReactNode) => page)
  const router = useRouter()
  const isExamplePage = router.asPath.includes('examples')
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/png" href="/awell-favicon.png" />
        <link
          rel="apple-touch-icon"
          type="image/png"
          href="/awell-webclip.png"
        />
      </Head>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
                `}
      </Script>

      {/* Example pages don't need theming, apollo, search, nav, ... */}
      {isExamplePage && (
        <ApolloProvider client={client}>
          <AppProvider>{getLayout(<Component {...pageProps} />)}</AppProvider>
        </ApolloProvider>
      )}

      {!isExamplePage && (
        <ApolloProvider client={client}>
          <ThemeProvider>
            <AppProvider>
              {getLayout(<Component {...pageProps} />)}
              <MobileMenu />
              <MobileNav />
              <div id="search"></div>
            </AppProvider>
          </ThemeProvider>
        </ApolloProvider>
      )}
    </>
  )
}

export default MyApp
