import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Loader from "../components/common/Loader";

const ProtectedRoute = () => {
    const { accessToken, isInitializing  } = useAuthStore();

    if (isInitializing) {
        return <Loader />;
    }

    return accessToken  ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
