import { TRPCReactProvider } from "~/trpc/react";

export default function ThreadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <TRPCReactProvider>{children}</TRPCReactProvider>
    );
}
