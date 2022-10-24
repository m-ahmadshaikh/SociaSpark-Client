import jwtDecode from 'jwt-decode';
import { createContext, useContext, useReducer } from 'react';

const context = createContext();

export const useAuth = () => {
  const auth = useContext(context);
  return auth;
};

const initialState = {
  user: null,
};
if (localStorage.getItem('token')) {
  const jwt = jwtDecode(localStorage.getItem('token'));
  if (jwt.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  } else {
    initialState.user = jwt;
  }
}

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LOGIN':
      return { ...state, user: payload };
    case 'LOGOUT':
      return { ...state, user: null };

    default:
      return state;
  }
};

export default function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(authReducer, initialState);
  const login = (data) => {
    localStorage.setItem('token', data.token);
    setTimeout(() => {
      dispatch({ type: 'LOGOUT' });
    }, +jwtDecode(data.token).exp * 1000);

    dispatch({ type: 'LOGIN', payload: data });
  };
  const logout = () => {
    localStorage.removeItem('token');

    dispatch({ type: 'LOGOUT' });
  };

  return (
    <context.Provider value={{ login, logout, user }}>
      {children}
    </context.Provider>
  );
}
