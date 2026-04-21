import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-20 w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;