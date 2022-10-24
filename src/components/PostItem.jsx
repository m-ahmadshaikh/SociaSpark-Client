import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LikeButton from './LikeButton';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMeta,
  Form,
  FormInput,
  Grid,
  GridColumn,
  GridRow,
  Icon,
  Image,
  Label,
} from 'semantic-ui-react';
import { useAuth } from '../context/auth';
import DeleteButton from './DeleteButton';

export default function PostItem() {
  const params = useParams();
  const { user } = useAuth();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { postId: params.postId },
  });
  const [createComment, { data: commentData }] = useMutation(CREATE_COMMENT);
  const [comment, setComment] = useState('');

  function submitCommentHandler() {
    createComment({ variables: { postId: id, body: comment } });
  }

  useEffect(() => {
    if (commentData) {
      setComment('');
    }
  }, [commentData]);
  if (loading) {
    return <p>Loading... </p>;
  }
  const {
    id,
    body,
    username,
    createdAt,
    comments,
    likes,
    likeCount,
    commentCount,
  } = data.getPost;

  return (
    <div>
      <Grid>
        <GridRow>
          <GridColumn width={2}>
            <Image
              floated="left"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </GridColumn>
          <GridColumn width={10}>
            <Card fluid>
              <CardContent>
                <CardHeader>{username}</CardHeader>
                <CardMeta>{moment(createdAt).fromNow()}</CardMeta>
                <CardDescription>{body}</CardDescription>
              </CardContent>
              <hr />
              <CardContent extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button as="div" labelPosition="right">
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} />
                )}
              </CardContent>
            </Card>
            {user && (
              <Card fluid>
                <CardContent>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}>
                    <p>Post a comment</p>
                    <FormInput
                      type="text"
                      placeholder="comment"
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                    />
                    <Button
                      type="submit"
                      color="teal"
                      as="div"
                      onClick={submitCommentHandler}
                      disabled={comment.trim() === ''}>
                      Submit
                    </Button>
                  </Form>
                </CardContent>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <CardContent>
                  {user && user.username === comment.username && (
                    <DeleteButton commentId={comment.id} postId={id} />
                  )}
                  <CardHeader>{comment.username}</CardHeader>
                  <CardMeta>{moment(comment.createdAt).fromNow()}</CardMeta>
                  <CardDescription>{comment.body}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </GridColumn>
        </GridRow>
      </Grid>
    </div>
  );
}

const GET_POST = gql`
  query post($postId: ID!) {
    getPost(postID: $postId) {
      id
      body
      username
      createdAt
      comments {
        id
        createdAt
        username
        body
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

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      body
      username
      createdAt
      commentCount
      comments {
        id
        createdAt
        username
        body
      }
      likes {
        username
      }
      likeCount
    }
  }
`;
