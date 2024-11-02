import { Navigate, useLocation } from 'react-router-dom';

export interface ProtectedRouteProps {
  isVerified: boolean;
  redirectPath: string;
  children: any;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { isVerified, redirectPath, children } = props;
  const location = useLocation();

  if (!isVerified) {
    const previousState = location.pathname;
    sessionStorage.setItem('previousUrl', previousState);
    return <Navigate to={redirectPath} replace />;
  }

  if (sessionStorage.getItem('previousUrl')) {
    sessionStorage.removeItem('previousUrl');
  }
  return children;
}