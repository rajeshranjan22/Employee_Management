import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HasPermission = ({ required, children, fallback = null }) => {
  const { hasPermission } = useContext(AuthContext);

  if (hasPermission(required)) {
    return children;
  }

  return fallback;
};

export default HasPermission;
