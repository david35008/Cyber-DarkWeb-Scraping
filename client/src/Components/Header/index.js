import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import {
  Menu, MenuItem, Badge, InputBase, Typography,
  IconButton, Toolbar, AppBar, Button
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import ErrorIcon from "@material-ui/icons/Error";
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import AnnouncementIcon from "@material-ui/icons/Announcement";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { blue } from '@material-ui/core/colors';
import SvgIcon from '@material-ui/core/SvgIcon';
import KeyWordModal from '../Modals/keyWordsModal';
import useDebounce from '../../Helpers/Debounce';
import useEventSource from '../../Helpers/eventSourceHook';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    marginBottom: '64px'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    link: {
      marginTop: '30px',
      textDecoration: 'none',
      fontSize: '0.875rem',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center'

    },
    linkButton: {
      marginTop: '30px',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center'
    }
  },
}));

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export default function PrimarySearchAppBar({ url, setData }) {
  const classes = useStyles();

  const [openKeyWordModal, setOpenKeyWordModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const data = useEventSource("http://localhost:8000/api/v1/notifications");
  useEffect(() => {
    if (data) {
      setNotifications((prev) => [...prev, data]);
    }
  }, [data]);

  const [keyWordsData, setKeyWordsData] = useState([]);

  const fetchKeyWordsData = async () => {
    const { data } = await axios.get("/api/v1/keyword");
    setKeyWordsData(data);
  };

  useEffect(() => {
    fetchKeyWordsData();
  }, []);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = (event) => {
    setIsMobileMenuOpen(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(null);
  };

  const [isNotificationsMenuOpen, SetIsNotificationsMenuOpen] = useState(false);

  const handleNotificationsMenuOpen = (event) => {
    if (notifications.length > 0) {
      SetIsNotificationsMenuOpen(event.currentTarget);
    }
  };

  const handleNotificationsMenuClose = () => {
    SetIsNotificationsMenuOpen(null);
    handleMobileMenuClose();
  };

  const [searchInput, setSearchInput] = useState('')
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const fetchData = async () => {
    try {
      const query = searchInput ? `?query=${searchInput}` : "";
      const { data: dataFromDb } = await axios.get(`${url}${query}`);
      setData(dataFromDb);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchData();
    } else {
      fetchData();
    }
    // eslint-disable-next-line
  }, [debouncedSearchTerm, url])

  const handleReadAll = () => {
    handleNotificationsMenuClose()
    setNotifications([]);
  };

  const handleClose = (index) => {
    handleNotificationsMenuClose()
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
  };

  const menuId = 'primary-search-account-menu';
  const renderComputerMenu = (
    <Menu
      anchorEl={isNotificationsMenuOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotificationsMenuOpen}
      onClose={handleNotificationsMenuClose}
    >
      {notifications.length > 0 ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            className={classes.title}
            style={{ paddingLeft: 5 }}
          >
            Notifications
                </Typography>
          <Button onClick={() => handleReadAll()}>
            Mark All As Read
                </Button>
        </div>
      ) : null}
      {notifications.length > 0
        ? notifications.map((element, index) => {
          if (element.name === "notifications-alerts") {
            return (
              <MenuItem
                key={element.name + index}
                onClick={() => { handleClose(index); }}
              >
                <Link className={classes.link} style={{ textDecoration: 'none' }} to="/alerts">
                  <div
                    style={{
                      color: "blue",
                      display: "flex",
                      justifyContent: "center",
                    }}
                    className={classes.linkButton}
                  >
                    <AnnouncementIcon />
                    {element.message}
                  </div>
                </Link>
              </MenuItem>
            );
          } else if (element.name === "scrapperFailed") {
            return (
              <MenuItem
                key={element.name + index}
                onClick={() => handleClose(index)}
              >
                <div
                  style={{
                    color: "red",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ErrorIcon />
                  {element.message}
                </div>
              </MenuItem>
            );
          } else {
            return (
              <MenuItem
                key={element.name + index}
                onClick={() => handleClose(index)}
              >
                <div
                  style={{
                    color: "green",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon />
                  {element.message}
                </div>
              </MenuItem>
            );
          }
        })
        : null}
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={isMobileMenuOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link className={classes.link} style={{ textDecoration: 'none' }} to="/alerts">
          <Button
            edge="start"
            className={classes.menuButton}
            style={{
              alignItems: 'center',
              alignContent: 'center',
              justifyContent: 'center'
            }}
            color="default"
            aria-label="menu"
          >
            Alerts
              </Button>
        </Link>
      </MenuItem>
      <MenuItem>
        <Button onClick={() => setOpenKeyWordModal(true)}>KeyWords</Button>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="fixed">
        <Toolbar>
          <Link to='/' >
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
            >
              <HomeIcon style={{ color: blue[50] }} />
            </IconButton>
          </Link>
          <Typography className={classes.title} variant="h6" noWrap>
            Cyber Insights Scrapper DarkWeb
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              onChange={handleInputChange}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link className={classes.link} style={{ textDecoration: 'none' }} to="/alerts">
              <Button
                edge="start"
                className={classes.menuButton}
                style={{
                  alignItems: 'center',
                  alignContent: 'center',
                  justifyContent: 'center'
                }}
                color="default"
                aria-label="menu"
              >
                Alerts
              </Button>
            </Link>
            <Button onClick={() => setOpenKeyWordModal(true)}>KeyWords</Button>
            <KeyWordModal
              open={openKeyWordModal}
              setOpen={setOpenKeyWordModal}
              keyWordsData={keyWordsData}
              fetchKeyWordsData={fetchKeyWordsData}
            />
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleNotificationsMenuOpen}
              color="inherit"
            >
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>

          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderComputerMenu}
    </div>
  );
}


/*




  const handleClose = (index) => {
    setAnchorEl(null);
    const newNotifications = [...notifications];
    newNotifications.splice(index, 1);
    setNotifications(newNotifications);
  };


*/
