import "@/styles/globals.css";
import "@/styles/guides.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpotlightProvider } from "@/components/Spotlight";
import { Notifications } from "@mantine/notifications";
import Navbar from "@/components/Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PlausibleProvider from "next-plausible";
import { DefaultSeo } from "next-seo";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <PlausibleProvider
      domain="fmhy.net"
      selfHosted={true}
      customDomain="https://a.bignutty.xyz"
      trackOutboundLinks={true}
      taggedEvents={true}
      // trackLocalhost={true}
      // enabled={true}
    >
      <MantineProvider
        theme={{
          colorScheme: "dark",
        }}
      >
        <QueryClientProvider client={queryClient}>
          <SpotlightProvider>
            <DefaultSeo
              title="FreeMediaHeckYeah"
              description="Largest collection of free stuff on the internet!"
              openGraph={{
                type: "website",
                locale: "en_IE",
                url: "https://www.fmhy.net/",
                siteName: "FreeMediaHeckYeah",
                images: [{ url: "https://www.fmhy.net/logo.png" }],
              }}
              canonical="https://www.fmhy.net/"
            />

            <div className="flex flex-col h-screen gap-2">
              <Notifications />
              <Navbar />
              <div className="px-2 flex-1 flex overflow-scroll">
                <Component {...pageProps} />
              </div>
            </div>
          </SpotlightProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </MantineProvider>
    </PlausibleProvider>
  );
}
