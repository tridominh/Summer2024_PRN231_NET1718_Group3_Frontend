import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetAllPost } from "../../services/ApiServices/PostService";

export function PostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const data = await GetAllPost();
      setPosts(data);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'An error occurred. Please try again later.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">No Posts</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="1200px" mx="auto">
      <Typography variant="h4" gutterBottom align="center">
        Posts
      </Typography>

      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardActionArea onClick={() => navigate(`/posts/${post.id}`)} sx={{ flexGrow: 1 }}>
                {post.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.imageUrl}
                    alt={post.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(post.createdDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h5" component="div" gutterBottom>
                    {post.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
