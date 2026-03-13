import NavBar from "@/components/NavBar";

const Layout = ({children} : { children : React.ReactNode}) => {
  return (
    <>
      <NavBar />
      <main className="px-4 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}

export default Layout
