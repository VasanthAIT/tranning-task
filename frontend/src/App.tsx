import { useEffect, useState } from 'react';
import { getAllPosts } from './api/posts';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';

function App() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts()
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          📝 Blog Posts
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper elevation={3}>
            <List>
              {posts.map((post) => (
                <ListItem key={post._id} divider>
                  <ListItemText primary={post.title} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;
