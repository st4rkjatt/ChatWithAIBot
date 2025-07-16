import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Screen/Auth/Login";
import Registration from "./Screen/Auth/Registration";
import ForgetPassword from "./Screen/Auth/ForgetPassword";
import Dashboard from "./Screen/Auth/Dashboard";
import { isTokenValid } from "./General/TokenValidation";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from "./Screen/UserProfile";
import { useEffect } from "react";
import { setAutoLogout } from "./utils/authUtils";

// toast.configure();
const ProtectedRoute = ({ children }: any) => {
  if (!isTokenValid()) {
    // If the token is not valid, show a toast and redirect to the login page
    toast.error("Your token has been expired. Please login again.");
    return <Navigate to="/" replace />;
  }
  return children;
};
function App() {


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAutoLogout(token, () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;



// import { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { fetchRoutes } from './services/api';
// import Loading from './Components/Loading';
// import Error from './Components/Error';
// import Layout from './Components/Layout';
// import Home from './pages/Home';
// import DynamicPage from './pages/DynamicPage';
// import NotFound from './pages/NotFound';


// interface ApiRoute {
//   id: string;
//   path: string;
// }

// function App() {
//   const [routes, setRoutes] = useState<ApiRoute[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const loadRoutes = async () => {
//       try {
//         const apiRoutes: ApiRoute[] = await fetchRoutes();
//         setRoutes(apiRoutes);
//         setLoading(false);
//       } catch (err: any) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     loadRoutes();
//   }, []);

//   if (loading) return <Loading />;
//   if (error) return <Error message={error} />;
// console.log(routes)
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           {routes.map((route) => (
//             <Route
//               key={route.id}
//               path={route.path}
//               element={<DynamicPage pageId={route.id} />}
//             />
//           ))}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// }

// export default App;