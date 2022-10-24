import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Button, Form, FormField, FormInput } from 'semantic-ui-react';
import useForm from '../hooks/useForm';
import { GET_POSTS } from '../pages/Home';

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      username
      createdAt
      comments {
        body
        id
        username
        createdAt
      }
      likes {
        id
        createdAt
        username
      }
      likeCount
      commentCount
    }
  }
`;

export default function PostForm() {
  const [createPost, { data, loading, error }] = useMutation(CREATE_POST);
  const client = useApolloClient();

  const { onSubmit, changeHandler, values } = useForm({ body: '' }, () => {
    createPost({ variables: { body: values.body } });
  });

  useEffect(() => {
    if (data) {
      let { posts } = client.readQuery({
        query: GET_POSTS,
      });
      posts = [data.createPost, ...posts];
      client.writeQuery({ query: GET_POSTS, data: { posts } });
      values.body = '';
    }
  }, [data]);
  return (
    <div>
      <Form onSubmit={onSubmit} className={loading ? 'loading' : ''}>
        <h2>Create Post</h2>
        <FormField>
          <FormInput
            value={values.body}
            placeholder="body"
            name="body"
            onChange={changeHandler}
            error={Boolean(error)}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </FormField>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}
