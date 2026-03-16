import StreamClientProvider from "@/components/providers/StreamClientProvider";
import NavBar from "@/components/NavBar";

const Layout = ({children} : { children : React.ReactNode}) => {
  return (
    <StreamClientProvider>
      <NavBar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </StreamClientProvider>
  );
}

export default Layout
