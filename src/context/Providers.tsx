'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";

export default function Providers({
    children
}: {
    children: React.ReactNode
}) {

    const client = new QueryClient();

    return (
        <SessionProvider>
            <QueryClientProvider client={client}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </SessionProvider>
    );
}
