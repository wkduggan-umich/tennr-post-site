import { TRPCReactProvider } from "~/trpc/react";

export default function UserLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <TRPCReactProvider>{children}</TRPCReactProvider>
    );
}
