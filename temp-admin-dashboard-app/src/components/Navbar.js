import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
//mui components
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
//icons
import TimeLapse from '@material-ui/icons/Timelapse';
import Home from '@material-ui/icons/Home';
import Business from '@material-ui/icons/Business';
import RecentActors from '@material-ui/icons/RecentActors';

const drawerWidth = 240;

const styles = theme => ({
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
});

const Navbar = (props) => {
  const { classes } = props
  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Twine Administrators Dashboard
        </Typography>
        </Toolbar>
      </AppBar>
      <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="left">
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {[['Home', <Home />], ['Logs', <TimeLapse />], ['Organisations', <Business />], ['Admin Codes', <RecentActors />]].map(([text, icon]) => (
            <Link to={text.toLowerCase().replace(' ', '-').replace('home', '')} key={text}>
              <ListItem button >
                <ListItemIcon> {icon} </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
      </Drawer>
    </Fragment>
  )
}

export default withStyles(styles)(Navbar);