import {Inter} from 'next/font/google'
import './globals.css'
import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import LINKS from "@/app/links";

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'IS Entities',
    description: 'A next app to manage the entities for IS course.',
}

const DRAWER_WIDTH = 240;

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
                <link rel="icon" href={"favicon.ico"} />
                <link rel="apple-touch-icon" href={"logo192.png"} />
                <link rel="manifest" href={"manifest.json"} />
                <title>Systems Integration - Entities</title>
        </head>
        <body>
        <ThemeRegistry>
            <AppBar position="fixed" sx={{zIndex: 2000}}>
                <Toolbar sx={{backgroundColor: 'background.paper', userSelect: "none" }}>
                    <img alt={""} src={"logo512.png"} style={{height: 32, marginRight: 2 }}/>
                    <Typography variant="h6" noWrap component="div" color="black">
                        Systems Integration - Entities
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        top: ['48px', '56px', '64px'],
                        height: 'auto',
                        bottom: 0,
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Divider/>
                <List>
                    {LINKS.map(({text, href, icon: Icon}) => (
                        <ListItem key={href} disablePadding>
                            <ListItemButton component={Link} href={href}>
                                <ListItemIcon>
                                    <Icon/>
                                </ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{mt: 'auto'}}/>
                <small>Integração de Sistemas @ESTG/IPVC</small>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflow: "auto",
                    bgcolor: 'white',
                    ml: `${DRAWER_WIDTH}px`,
                    mt: ['48px', '56px', '64px'],
                    p: 3,
                }}
            >
                {children}
            </Box>
        </ThemeRegistry>
        </body>
        </html>
    );
}