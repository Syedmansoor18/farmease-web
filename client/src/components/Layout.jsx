import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />

      {/* Main Content */}
      <div className="w-full md:ml-20 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;