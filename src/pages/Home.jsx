import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Grid, GridColumn, GridRow, TransitionGroup } from 'semantic-ui-react';
import MenuBar from '../components/MenuBar';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useAuth } from '../context/auth';

export const GET_POSTS = gql`
  query GetPosts {
    posts {
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

export default function Home() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const { user } = useAuth();
  if (error) return `Error! ${error.message}`;
  return (
    <Grid columns={3}>
      <GridRow className="page-title">
        <h1>Recent Posts</h1>
      </GridRow>
      <GridRow>
        {user && (
          <GridColumn>
            <PostForm />
          </GridColumn>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TransitionGroup>
            {data &&
              data.posts.map((post) => (
                <GridColumn style={{ marginBottom: 10 }} key={post.id}>
                  <PostCard post={post} />
                </GridColumn>
              ))}
          </TransitionGroup>
        )}
      </GridRow>
    </Grid>
  );
}
