import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPost } from "../../services/ApiServices/PostService";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Snackbar,
  Button,
} from "@mui/material";

export function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  let location = useLocation();
  const navigate = useNavigate();
  let { openPost } = location.state || { openPost: false };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    navigate("/posts/" + id);
    openPost = false;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await GetPost(id);
        console.log(data);

        // Check if imageUrl is a JSON string or a single URL
        if (data.imageUrl.startsWith('[') && data.imageUrl.endsWith(']')) {
          data.imageUrlList = JSON.parse(data.imageUrl);
        } else {
          data.imageUrlList = [data.imageUrl];
        }
        
        console.log(data.imageUrlList); // Kiểm tra danh sách URL hình ảnh
        setPost(data);
      } catch (err) {
        setError(err.message || "An error occurred while fetching the post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

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
    <Box p={2} maxWidth="700px" mx="auto">
      <Card>
        {post.imageUrlList && post.imageUrlList.length > 0 && (
          post.imageUrlList.map((image, index) => (
            <CardMedia
              key={index}
              component="img"
              height="400"
              image={image}
              alt={post.title}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src="fallback-image-url.jpg"; // Thay thế bằng một URL ảnh mặc định
              }}
            />
          ))
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <div dangerouslySetInnerHTML={{ __html: post.description }}></div>
          <Typography variant="caption" color="text.secondary">
            {new Date(post.createdDate).toLocaleDateString()}
          </Typography>
        </CardContent>
      </Card>
      <Box mt={2}>
        <Button variant="contained" color="primary" component={Link} to="/newsfeed">
          Back to newsfeed
        </Button>
      </Box>
      <Snackbar open={openPost} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Your post is being waited for accept
        </Alert>
      </Snackbar>
    </Box>
  );
}
