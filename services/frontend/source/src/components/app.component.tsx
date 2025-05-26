import React from "react";
import { Route, Routes } from "react-router-dom";
import { UserRole } from "../client/generated";
import { Dashboard } from "./dashboard.component";
import { Login } from "./login.component";
import { NotFound } from "./not-found.component";
import { RequireAuth } from "./require-auth.component";

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      path="/"
      element={
        <RequireAuth
          requiredRoles={[UserRole.USER]}
          component={<Dashboard />}
        />
      }
    />

    <Route path="/404" element={<RequireAuth component={<NotFound />} />} />
    <Route path="*" element={<RequireAuth component={<NotFound />} />} />
  </Routes>
);

export default App;
