import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPostById } from "../../services/ApiServices/PostService";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
} from "@mui/material";

export function PostDetails() {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await GetPostById(id); // Use the imported function
        setPost(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching the post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]); // Fetch the post whenever the ID changes

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="800px" mx="auto">
      <Card>
        {post.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={post.imageUrl}
            alt={post.title}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <div dangerouslySetInnerHTML={{__html:post.description}}>
            {/* {post.description} */}
          </div>
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
