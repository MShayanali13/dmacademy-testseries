import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Stack
} from "@mui/material";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon
} from "@mui/icons-material";
import SchoolIcon from "@mui/icons-material/School";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: 'grey.900', color: 'white', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 8 }}>
          {/* Company Info */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%', lg: '1 1 22%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ fontSize: 32, color: 'white', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                DM Academy Academy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 3 }}>
              Helping students achieve their dreams of getting into top colleges through quality test preparation and guidance.
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton size="small" sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}>
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: 'grey.500', '&:hover': { color: 'white' } }}>
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
          
          {/* Quick Links */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%', lg: '1 1 22%' } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {[
                { text: 'Home', href: '#' },
                { text: 'Features', href: '#features' },
                { text: 'Exams', href: '#exams' },
                { text: 'Pricing', href: '#pricing' },
                { text: 'Testimonials', href: '#testimonials' },
                { text: 'Contact Us', href: '#contact' }
              ].map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1.5 }}>
                  <Link 
                    href={link.href} 
                    underline="hover" 
                    sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Exam Resources */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%', lg: '1 1 22%' } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Exam Resources
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              {[
                { text: 'JEE Main & Advanced', href: '#' },
                { text: 'NEET', href: '#' },
                { text: 'Karnataka CET', href: '#' },
                { text: 'Maharashtra CET', href: '#' },
                { text: 'Free Resources', href: '#' },
                { text: 'Study Material', href: '#' }
              ].map((link) => (
                <Box component="li" key={link.text} sx={{ mb: 1.5 }}>
                  <Link 
                    href={link.href} 
                    underline="hover" 
                    sx={{ color: 'grey.400', '&:hover': { color: 'white' } }}
                  >
                    {link.text}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>
          
          {/* Newsletter */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 45%', lg: '1 1 22%' } }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mb: 3 }}>
              Subscribe to our newsletter for the latest updates, exam tips, and special offers.
            </Typography>
            <Box component="form">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Your email address"
                size="small"
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'grey.800',
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'grey.700',
                    },
                    '&:hover fieldset': {
                      borderColor: 'grey.600',
                    },
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ borderRadius: '0 4px 4px 0', height: '100%', minWidth: 'auto' }}
                      >
                        <SendIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" sx={{ color: 'grey.600' }}>
                We respect your privacy. Unsubscribe at any time.
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Footer Bottom */}
        <Divider sx={{ borderColor: 'grey.800' }} />
        
        <Box 
          sx={{ 
            pt: 3, 
            mt: 3, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'center', md: 'center' } 
          }}
        >
          <Typography variant="body2" sx={{ color: 'grey.500', mb: { xs: 2, md: 0 } }}>
            © {currentYear} DM Academy Academy. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((text) => (
              <Link 
                key={text} 
                href="#" 
                underline="hover" 
                sx={{ color: 'grey.500', '&:hover': { color: 'white' }, fontSize: '0.875rem' }}
              >
                {text}
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
