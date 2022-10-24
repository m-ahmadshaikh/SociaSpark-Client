import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import MenuBar from '../components/MenuBar';

export default function Layout() {
  return (
    <div>
      <Container>
        <MenuBar />
        <Outlet />
      </Container>
    </div>
  );
}
