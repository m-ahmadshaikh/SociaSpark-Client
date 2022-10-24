import React, { Component, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Segment } from 'semantic-ui-react';
import { useAuth } from '../context/auth';

export default function MenuBar() {
  const [activeItem, setActiveItem] = useState();
  const { user, logout } = useAuth();
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    if (name === 'logout') {
      logout();
    }
  };

  return (
    <Menu pointing secondary size="massive" color="teal">
      {user ? (
        <Menu.Item name={`${user.username}`} active to="/" end as={NavLink} />
      ) : (
        <Menu.Item
          name="home"
          active={activeItem === 'home'}
          onClick={handleItemClick}
          to="/"
          end
          as={NavLink}
        />
      )}

      <Menu.Menu position="right">
        {!user && (
          <>
            <Menu.Item
              name="login"
              active={activeItem === 'login'}
              onClick={handleItemClick}
              to="/login"
              as={NavLink}
            />
            <Menu.Item
              name="register"
              active={activeItem === 'register'}
              onClick={handleItemClick}
              to="/register"
              as={NavLink}
            />
          </>
        )}
        {user && (
          <Menu.Item
            name="logout"
            active={activeItem === 'logout'}
            onClick={handleItemClick}
          />
        )}
      </Menu.Menu>
    </Menu>
  );
}
