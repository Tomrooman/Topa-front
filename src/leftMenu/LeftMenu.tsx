import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import Box from '@mui/material/Box';
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
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        background: 'rgb(243 243 243)'
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar sx={{
                    background: 'rgb(243 243 243)'
                }}>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            margin: 'auto',
                            fontFamily: 'Outfit',
                            fontWeight: "900",
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        TOPA
                    </Typography>
                </Toolbar>
                <Divider />
                <List sx={{
                    padding: 0,
                }}>
                    {['Analysis'].map((text) => (
                        <ListItem key={text} disablePadding onClick={() => setPageSelection(text)} sx={{
                            fontFamily: 'Lexend',
                            backgroundColor: pageSelection === text ? '#253248' : 'inherit',
                            color: pageSelection === text ? 'primary.contrastText' : 'inherit',
                        }}>
                            <ListItemButton sx={{
                                fontFamily: 'Lexend'
                            }}>
                                <ListItemIcon sx={{
                                    color: pageSelection === text ? 'primary.contrastText' : 'inherit',
                                }}>
                                    <CandlestickChartIcon />
                                </ListItemIcon>
                                <ListItemText sx={{
                                    '& .MuiListItemText-primary': {
                                        fontFamily: 'Lexend',
                                        fontWeight: pageSelection === text ? '400' : '300',
                                    }
                                }} primary={text} />
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