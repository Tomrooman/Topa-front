import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

type PropsType = {
    pageSelection: string
    setPageSelection: (pageSelection: string) => void
}

const LeftMenu = ({ pageSelection, setPageSelection }: PropsType) => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {pageSelection}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            margin: 'auto',
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Topa
                    </Typography>
                </Toolbar>
                <Divider />
                <List sx={{
                    padding: 0
                }}>
                    {['Analysis'].map((text) => (
                        <ListItem key={text} disablePadding onClick={() => setPageSelection(text)} sx={{
                            backgroundColor: pageSelection === text ? 'primary.main' : 'inherit',
                            color: pageSelection === text ? 'primary.contrastText' : 'inherit',
                        }}>
                            <ListItemButton>
                                <ListItemIcon sx={{
                                    color: pageSelection === text ? 'primary.contrastText' : 'inherit',
                                }}>
                                    <CandlestickChartIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Drawer>
        </Box >
    );
}

export default LeftMenu;