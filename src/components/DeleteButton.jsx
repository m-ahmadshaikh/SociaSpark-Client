import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
import { GET_POSTS } from '../pages/Home';

export default function DeleteButton({ postId, commentId }) {
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [deleteFn, { data, error, loading }] = useMutation(mutation);
  const [confirm, setConfirm] = useState(false);
  const client = useApolloClient();
  const navigate = useNavigate();
  function deleteHandler() {
    setConfirm(false);
    if (commentId) {
      deleteFn({ variables: { commentId, postId } });
    } else {
      deleteFn({ variables: { deletePostId: postId } });
    }
  }

  useEffect(() => {
    if (data && !Boolean(commentId)) {
      console.log('in thi');
      let { posts } = client.readQuery({
        query: GET_POSTS,
      });
      posts = posts.filter((p) => p.id !== postId);
      client.writeQuery({ query: GET_POSTS, data: { posts } });
      navigate('/', { replace: true });
    }
  }, [data]);
  return (
    <>
      <Popup
        inverted
        content={commentId ? 'Delete Comment' : 'Delete post'}
        trigger={
          <Button
            floated="right"
            as="div"
            color="red"
            onClick={() => setConfirm(true)}>
            <Icon name="trash" />
          </Button>
        }
      />

      <Confirm
        open={confirm}
        onCancel={() => setConfirm(false)}
        onConfirm={deleteHandler}
      />
    </>
  );
}

const DELETE_POST = gql`
  mutation deletePost($deletePostId: ID!) {
    deletePost(id: $deletePostId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($commentId: ID!, $postId: ID!) {
    deleteComment(commentId: $commentId, postId: $postId) {
      id
      comments {
        id
        createdAt
        username
        body
      }
      commentCount
    }
  }
`;
