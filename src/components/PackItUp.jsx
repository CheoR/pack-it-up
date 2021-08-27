import React, { useEffect } from 'react';
import { Route, Switch, Link, useHistory } from 'react-router-dom';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import { userStorageKey } from './auth/authSettings';
import { Login } from './auth/Login';
import { Register } from './auth/Register';

import { LandingPage } from './routes/landingPage/LandingPage';
import { Navbar } from './navbar/Navbar';

import { UserPage } from './routes/userPages/UserPage';
import { ItemProvider } from './items/ItemProvider';
import { ItemList } from './items/ItemList';
import { ItemDetail } from './items/ItemDetail';
import { BoxProvider } from './boxes/BoxProvider';
import { BoxList } from './boxes/BoxList';
import { BoxDetail } from './boxes/BoxDetail';
import { MoveProvider } from './moves/MoveProvider';
import { MoveList } from './moves/MoveList';
import { MoveDetail } from './moves/MoveDetail';
import { UserProvider } from './users/UserProvider';
import logo from '../assets/images/PackItUpLogo.png';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  imgBlock: {
    width: '85px',
    margin: '0 auto',
  },
  img: {
    width: '100%',
  },
}));

export const PackItUp = () => {
  const classes = useStyles();
  const history = useHistory();

  const [value, setValue] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem(userStorageKey);
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const logout = (event) => {
    event.preventDefault();
    sessionStorage.removeItem('app_user_id');
    sessionStorage.removeItem('app_user_username');
    setIsLoggedIn(false);
    history.push('/');
  };

  return (
    <>
      <UserProvider><MoveProvider><BoxProvider><ItemProvider>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <div className={classes.imgBlock}>
              <img src={logo} className={classes.img} alt="Pack It Up Logo" />
            </div>
            {
              isLoggedIn
                ? (
                  <Button
                    color="inherit"
                    onClick={logout}
                    component={Link}
                    to="/"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    to="/login"
                  >
                    Login
                  </Button>
                )
            }

          </Toolbar>
          {
            sessionStorage.getItem(userStorageKey)
              ? <Navbar />
              : <></>
          }
        </AppBar>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/register">
            <Register />
          </Route>

          <Route exact path="/users">
            <UserPage />
          </Route>

          <Route exact path="/items">
            <ItemList />
          </Route>

          <Route exact path="/items/:itemId(\d+)">
            <ItemDetail />
          </Route>

          <Route exact path="/boxes">
            <BoxList />
          </Route>

          <Route exact path="/boxes/:boxId(\d+)">
            <BoxDetail />
          </Route>

          <Route exact path="/moves">
            <MoveList />
          </Route>

          <Route exact path="/moves/:moveId(\d+)">
            <MoveDetail />
          </Route>
        </Switch>
        <BottomNavigation
          position="sticky"
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          className={classes.root}
        >
          <BottomNavigationAction label="LinkedIn" icon={<LinkedInIcon />} />
          <BottomNavigationAction label="GitHub" icon={<GitHubIcon />} />
          <BottomNavigationAction label="Portfolio" icon={<LibraryBooksIcon />} />
        </BottomNavigation>
        {/* eslint-disable-next-line react/jsx-closing-tag-location */}
      </ItemProvider></BoxProvider></MoveProvider></UserProvider>
    </>
  );
};
