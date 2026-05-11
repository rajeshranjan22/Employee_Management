import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { EmployeeContext } from "../context/EmployeeContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { searchTerm, setSearchTerm } = useContext(EmployeeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <div
      style={{
        height: "75px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        borderBottom: "1px solid var(--border-color)",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgba(30, 41, 59, 0.6)",
          padding: "0.6rem 1.2rem",
          borderRadius: "12px",
          width: "350px",
          border: "1px solid var(--border-color)",
          transition: "all 0.3s ease",
        }}
        className="search-container"
      >
        <SearchIcon
          style={{ color: "var(--text-muted)", marginRight: "12px", fontSize: "20px" }}
        />
        <input
          type="text"
          placeholder="Search everywhere..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-main)",
            outline: "none",
            width: "100%",
            fontSize: "0.95rem",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton sx={{ color: "var(--text-muted)" }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "var(--border-color)" }} />

        {/* User Profile */}
        <Box 
          onClick={handleClick}
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px", 
            cursor: "pointer",
            padding: "6px 12px",
            borderRadius: "10px",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(255,255,255,0.05)"
            }
          }}
        >
          <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
            <Typography sx={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-main)", lineHeight: 1.2 }}>
              {user?.name || "User"}
            </Typography>
            <Chip 
              label={user?.role?.name || "Guest"} 
              size="small" 
              sx={{ 
                height: "18px", 
                fontSize: "0.65rem", 
                fontWeight: "700", 
                background: "rgba(59, 130, 246, 0.15)",
                color: "var(--accent-color)",
                mt: "4px"
              }} 
            />
          </Box>
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: "var(--accent-color)",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
            }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            className: "glass-panel",
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: 180,
              background: "var(--secondary-bg) !important",
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'var(--secondary-bg)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" sx={{ color: "var(--text-muted)" }} />
            </ListItemIcon>
            My Profile
          </MenuItem>
          <Divider sx={{ my: 1, borderColor: "var(--border-color)" }} />
          <MenuItem onClick={handleLogout} sx={{ color: "var(--danger-color)" }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "var(--danger-color)" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Navbar;
