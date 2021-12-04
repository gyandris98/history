import React, { FunctionComponent } from 'react';
import { Redirect, RouteProps } from 'react-router';
import { Route } from 'react-router-dom';
import { useAuth } from '../../../lib/auth';

interface ProtectedRouteProps {
  role?: 'Admin' | 'Editor' | 'Reader';
}

const ProtectedRoute: FunctionComponent<RouteProps & ProtectedRouteProps> = ({
  role = 'Editor',
  ...rest
}) => {
  const { user } = useAuth();
  const isAuthenticated = user && (user.role === role || user.role === 'Admin');
  return (
    <Route {...rest}>
      {isAuthenticated ? rest.children : <Redirect to="/login" />}
    </Route>
  );
};

export default ProtectedRoute;
