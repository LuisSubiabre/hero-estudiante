// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import { useAuth } from "@/context/AuthContext";
// //import { checkToken } from "@/utils/authUtils";

// export const useAuthCheck = () => {
//   const { setIsAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("TokenLeu");

//     const verifyToken = async () => {
//       if (token) {
//         try {
//           const isValid = await checkToken(token);

//           setIsAuthenticated(isValid);
//           if (!isValid) {
//             //  router.push("/login"); // Redirige si el token no es válido
//           }
//         } catch (error) {
//           console.error("Error verificando el token:", error);
//           setIsAuthenticated(false);
//           navigate("/login");
//         }
//       } else {
//         setIsAuthenticated(false);
//         navigate("/login");
//       }
//     };

//     verifyToken();
//   }, [setIsAuthenticated]);
// };
