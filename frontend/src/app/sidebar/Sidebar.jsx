import React from 'react';
import {
  IoIosHome,
  IoIosHeart,
  IoMdTime,
  IoMdApps,
  IoIosPeople,
  IoIosHelpCircle,
  IoIosSettings
} from 'react-icons/io';
import { useSelector } from 'react-redux';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';

const SidebarComponent = () => {
  const isMenuOpen = useSelector(state => state.toggle.isMenuOpen);

  return (
    <Sidebar
      width="220px"
      backgroundColor="gray-1000"
      rootStyles={{
        height: "fit",
        color: "white",
        borderRight: '1px solid gray',
        transition: "all 0.2s ease-in-out",
        transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
        transform: isMenuOpen ? "translateX(0)" : "translateX(-100%)",
        opacity: isMenuOpen ? 1 : 0,
        visibility: isMenuOpen ? "visible" : "hidden",
        position: isMenuOpen ? "" : "fixed",
      }}
    >
      <Menu
        menuItemStyles={{
          button: ({ active }) => ({
            color: "white",
            [`&.active`]: {
              backgroundColor: '#9C27B0',
              color: 'gray-200',
            },
            marginBottom: "15px",
            padding: "10px",
            fontSize:"0.9rem",
            border: "1px solid gray",
            borderRadius: "5px",
            transition: "all 0.1s ease-in-out",
            transform: isMenuOpen ? "translateX(0)" : "translateX(-10px)",
            opacity: isMenuOpen ? 1 : 0,
            "&:hover": {
              backgroundColor: "#7B1FA2",
            },
            marginRight:'10px',
            marginLeft:'10px',
            marginTop:"10px"
          }),
        }}
      >
        <MenuItem icon={<IoIosHome />} component={<NavLink to="/" />}> Home </MenuItem>
        <MenuItem icon={<IoIosHeart />} component={<NavLink to="/liked-videos" />}> Liked Videos </MenuItem>
        <MenuItem icon={<IoMdTime />}> History </MenuItem>
        <MenuItem icon={<IoMdApps />}> My Content </MenuItem>
        <MenuItem icon={<IoMdApps />}> Collections </MenuItem>
        <MenuItem icon={<IoIosPeople />}> Subscribers </MenuItem>
        <MenuItem icon={<IoIosHelpCircle />}> Support </MenuItem>
        <MenuItem icon={<IoIosSettings />}> Settings </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default React.memo(SidebarComponent);
