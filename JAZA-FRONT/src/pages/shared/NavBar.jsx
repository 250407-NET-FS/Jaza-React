import logo from "../../assets/JAZA.png";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import Login from "../Login";
import Popup from "reactjs-popup";
import { AppBar, Container, Toolbar, Box, Button, IconButton, Typography } from "@mui/material";

const NavBar = () => {
    const pages = [
        { name: "Listings", path: "/listings" },
        { name: "Favorites", path: "/favorites" }
    ];
    const { user, logout } = useAuth();

    return (
        // AppBar's color prop for some reason only takes in predefined theme values leading to this double color set
        <AppBar position="static" color="transparent" sx={{ backgroundColor: "#cf7146", width: "100vw" }}>
            <Container maxWidth={false} disableGutters>
                <Toolbar>
                    <IconButton component={Link} to="/" disableRipple>
                        <img src={logo} alt="JAZA Logo" className="logo-image" />
                    </IconButton>
                    <Typography
                        variant="h4"
                        component={Link}
                        to="/"
                        className="logo-text"
                    >
                        <strong>JAZA</strong>
                    </Typography>
                    <Box sx={{ flexGrow: 1, marginLeft: "1.5rem" }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                component={Link}
                                to={page.path}
                                disableRipple
                                sx={{ color: "white" }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ marginRight: "1rem" }}>
                        <Typography>{user ? `Welcome, ${user.fullName}` : "Welcome, Guest"}</Typography>
                    </Box>
                    <Box>
                        {user?.role === "Admin" && (
                            <Button component={Link} to="/admin/Dashboard" sx={{ color: 'white' }}>
                                Admin Dashboard
                            </Button>
                        )}
                        {user?.fullName ? (
                            <Button onClick={logout} sx={{ color: 'white' }}>Logout</Button>
                        ) : (
                            <Popup
                                trigger={<Button sx={{ color: 'white' }}>Login</Button>}
                                modal
                                nested
                                overlayStyle={{ background: "rgba(0, 0, 0, 0.5)" }}
                                contentStyle={{
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "10px",
                                    padding: "30px",
                                    maxWidth: "450px",
                                    margin: "100px auto",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                                    fontFamily: "Arial, sans-serif",
                                }}
                            >
                                <Login className="Login-form" />
                            </Popup>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default NavBar