import {
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Avatar,
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
  const createMarkup = (htmlString) => {
    return { __html: htmlString };
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

      {posts.map((post) => (
        <Box key={post.id} mb={3} mx="auto" maxWidth={600}>
          <Card sx={{ boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            {/* Avatar and username */}
            <Box display="flex" alignItems="center" p={1}>
              <Avatar src={post.avatarUrl} alt={post.username} />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>{post.username}</Typography>
            </Box>
            {/* Date */}
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              {new Date(post.createdDate).toLocaleDateString()}
            </Typography>
            {/* Title */}
            <Typography variant="h5" component="div" sx={{ p: 1 }}>
              {post.title}
            </Typography>
            {/* Description */}
            <Typography
              variant="body1"
              sx={{ p: 1, whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={createMarkup(post.description)}
            />
            {/* Image */}
            {post.imageUrl && (
              <CardActionArea onClick={() => navigate(`/posts/${post.id}`)} sx={{ flexGrow: 1 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
              </CardActionArea>
            )}
          </Card>
        </Box>
      ))}
    </Box>
  );
}
