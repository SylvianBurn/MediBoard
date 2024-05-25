import { Link, useLocation, useNavigate } from "react-router-dom";
import { Role, useAuth } from "../utils/ProtectedRoute";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CircleIcon from "@mui/icons-material/Circle";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useEffect, useState } from "react";
import MediboardLogo from "../assets/mediboard-logo.webp";

export const drawerWidth = 240;

export type Pages = {
  name: string;
  path: string;
  isAdmin?: boolean;
  isAuth?: boolean;
  isHidden?: boolean;
  isNotAdmin?: boolean;
};

const pages: Pages[] = [
  { name: "Home", path: "/" },
  { name: "Login", path: "/login", isAuth: true },
  { name: "Register", path: "/register", isAuth: true },
  { name: 'Patient Management', path: '/admin/patients', isAdmin: true},
  { name: 'Doctor Management', path: '/admin/doctors', isAdmin: true},
];

const getIcon = (name: string): JSX.Element => {
  switch (name) {
    case "Home":
      return <HomeIcon />;
    case "Settings":
      return <SettingsIcon />;
    case "Profile":
      return <EditIcon />;
    case "Patient Management":
      return <PersonOutlineIcon />;
    case "Doctor Management":
      return <MedicalServicesIcon />;
    default:
      return <CircleIcon />;
  }
};

export default function ResponsiveDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useAuth();

  const isInAuthRoute =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register");

  const filteredPages = pages.filter((page) => {
    if (page.isAuth) return false; // Exclude auth-specific pages from sidebar
    if (page.isAdmin && authContext.role !== "1.0") return false; // Exclude admin pages for non-admin users
    if (page.isNotAdmin && authContext.role === "1.0") return false; // Exclude non admin pages (doctor pages) for admin users
    if (page.isHidden) return false;
    return true;
  });

  const drawer = (
    <div>
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={MediboardLogo}
          style={{ padding: 5, width: 200 }}
          alt="GMO Logo"
        />

        <p>Mediboard</p>
      </Toolbar>
      <Divider />
      <List>
        {filteredPages.map(({ name, path }) => (
          <Link
            to={path}
            style={{ textDecoration: "none", color: "black" }}
            key={name}
          >
            <ListItem disablePadding>
              <ListItemButton selected={location.pathname === path}>
                <ListItemIcon>{getIcon(name)}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          alignSelf: "flex-end",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Divider />
        <ListItem key={"Log out"} disablePadding>
          <ListItemButton
            onClick={() => {
              authContext.signOut();
              navigate("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log out" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return !isInAuthRoute ? (
    <Box sx={{ display: "flex", width: drawerWidth }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  ) : null;
}
