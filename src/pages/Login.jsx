import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';
import { useAuth } from '../context/auth';
import useForm from '../hooks/useForm';
import getFormErrors from '../utils/getFormErrors';

const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput) {
    login(input: $input) {
      id
      email
      token
      username
      createdAt
    }
  }
`;

const initialState = {
  password: '',
  username: '',
};
export default function Login() {
  const [login, { data, loading, error }] = useMutation(LOGIN_USER, {});
  const [errors, setErrors] = useState({});
  const {
    onSubmit: submitHandler,
    values,
    changeHandler,
  } = useForm(initialState, () => {
    login({ variables: { input: values } });
  });
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    if (data) {
      auth.login(data.login);
      setErrors({});
      navigate('/', { replace: true });
    }
    if (error) {
      setErrors(error.graphQLErrors[0].extensions.errors);
    }
  }, [data, error]);

  return (
    <div className="form-container">
      <Form className={loading ? 'loading' : ''} onSubmit={submitHandler}>
        <Form.Input
          onChange={changeHandler}
          name="username"
          error={Boolean(errors.username)}
          label="Enter Username"
          value={values.username}
        />
        <Form.Input
          onChange={changeHandler}
          label="Enter Password"
          name="password"
          type="password"
          error={Boolean(errors.password)}
          value={values.password}
        />

        <Button primary type="submit">
          login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">{getFormErrors(errors)}</ul>
        </div>
      )}
    </div>
  );
}
