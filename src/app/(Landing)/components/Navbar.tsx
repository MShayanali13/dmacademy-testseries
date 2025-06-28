'use client';

// import React, { useState } from 'react';
// import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//         {/* Logo / Title */}
//         <div className="text-xl font-bold text-gray-800">ExamSaaS</div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center space-x-6">
//           <FaUserCircle className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800" />
//         </div>

//         {/* Mobile menu toggle */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-gray-700 focus:outline-none"
//           >
//             {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Dropdown Menu */}
//       {menuOpen && (
//         <div className="md:hidden px-4 py-2 border-t border-gray-100 bg-white">
//           <div className="flex flex-col space-y-3">
//             {/* You can add links here */}
//             <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
//               <FaUserCircle className="text-xl" />
//               <span>Profile</span>
//             </button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {useRouter} from "next/navigation";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Exams", href: "#exams" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };
const router = useRouter();

  return (
    <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Link href="/">
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {/* <SchoolIcon sx={{ color: 'primary.main', fontSize: 40, mr: 1 }} />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                DM Academy
              </Typography> */}
                <Box sx={{width:"100%",display:"flex",justifyContent:"center",alignItems:"center",}}>
                  <Image src="/images/logos/myLogo.png" alt="Logo" width={200} height={100} style={{maxWidth:"260px",height:"auto"}}  />
                  </Box> 
            </Box>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                sx={{
                  mx: 1.5,
                  color: 'text.primary',
                  '&:hover': { color: 'primary.main' },
                  fontWeight: 500
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
           
             <SignedOut>
          <SignInButton mode="modal"  >
             <Button 
              variant="outlined" 
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Sign In
            </Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button 
              variant="contained" 
              color="primary" 
              sx={{ fontWeight: 600 }}
            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
            <Button 
              variant="outlined" 
              color="info" 
              onClick={() => router.push("/dashboard")}
              sx={{ fontWeight: 600 }}
            >
             Go to Dashboard   →
            </Button>
       
      </SignedIn>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={toggleMobileMenu}
            sx={{ ml: 'auto', display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
      >
        <Box sx={{ width: 250, pt: 2 }} role="presentation">
          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton onClick={() => handleNavClick(item.href)}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <SignedOut>
          <SignInButton mode="modal"    >
             <Button 
              variant="outlined" 
              color="primary"
              sx={{ fontWeight: 600 }}
              fullWidth
            >
              Sign In
            </Button>
        </SignInButton>

        <SignUpButton mode="modal">
          <Button 
              variant="contained" 
              color="primary" 
              sx={{ fontWeight: 600 }}
              fullWidth

            >
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
            <Button 
              variant="outlined" 
              color="info" 
              onClick={() => router.push("/dashboard")}
              sx={{ fontWeight: 600 }}
            >
             Go to Dashboard   →
            </Button>
       
      </SignedIn>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

