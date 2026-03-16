import NavBar from "@/components/NavBar";

const Layout = ({children} : { children : React.ReactNode}) => {
  return (
    <>
      <NavBar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </>
  );
}

export default Layout
