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
    choices: { name: string, icon: any }[];
    setPageSelection: (pageSelection: string) => void
}

const LeftMenu = ({ pageSelection, choices, setPageSelection }: PropsType) => {
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
                    {choices.map(({ name, icon }) => (
                        <ListItem key={name} disablePadding onClick={() => setPageSelection(name)} sx={{
                            fontFamily: 'Lexend',
                            backgroundColor: pageSelection === name ? '#253248' : 'inherit',
                            color: pageSelection === name ? 'primary.contrastText' : 'inherit',
                        }}>
                            <ListItemButton sx={{
                                fontFamily: 'Lexend'
                            }}>
                                <ListItemIcon sx={{
                                    color: pageSelection === name ? 'primary.contrastText' : 'inherit',
                                }}>
                                    {icon}
                                </ListItemIcon>
                                <ListItemText sx={{
                                    '& .MuiListItemText-primary': {
                                        fontFamily: 'Lexend',
                                        fontWeight: pageSelection === name ? '400' : '300',
                                    }
                                }} primary={name} />
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