import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardActionArea,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetAllPost } from "../../services/ApiServices/PostService";
import { GetUserInfo } from "../../services/ApiServices/UserService";

export function PostPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState({});
  const [tutorProfile, setTutorProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const data = await GetAllPost();
      // Lọc những bài đăng có status là ACTIVE
      const activePosts = data.filter(post => post.status === "ACTIVE");
      setPosts(activePosts);

      const userPromises = activePosts.map(post => GetUserInfo(post.userId));
      const usersData = await Promise.all(userPromises);
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      setUsers(usersMap);
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

  const handleUserClick = (userId) => {
    const user = users[userId];
    if (user) {
      setTutorProfile(user);
      setProfileDialogOpen(true);
    }
  };

  const handleCloseProfileDialog = () => {
    setProfileDialogOpen(false);
    setTutorProfile(null);
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
    <Box p={2} maxWidth="2000px" mx="auto">
      <Typography sx={{ fontWeight: 'bold' }} variant="h4" gutterBottom align="center">
        NEWSFEED
      </Typography>
      {posts.map((post) => (
        <Box key={post.id} mb={3} mx="auto" maxWidth={600}>
          <Card sx={{ backgroundColor: "#6c757d4d", boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
            <Box display="flex" alignItems="center" p={1}>
              <Avatar src={users[post.userId]?.avatar} alt={users[post.userId]?.userName} />
              <Typography
                variant="body1"
                sx={{
                  marginLeft: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => handleUserClick(post.userId)}
              >
                {users[post.userId]?.userName}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
              {new Date(post.createdDate).toLocaleDateString()}
            </Typography>
            <Typography variant="h5" component="div" sx={{ p: 1 }}>
              {post.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{ p: 1, whiteSpace: 'pre-line' }}
              dangerouslySetInnerHTML={createMarkup(post.description)}
            />
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
          <br></br>
        </Box>
      ))}
      <Dialog
        open={profileDialogOpen}
        onClose={handleCloseProfileDialog}
        aria-labelledby="profile-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle variant="h4" id="profile-dialog-title">
          Tutor Profile
        </DialogTitle>
        <DialogContent>
          {tutorProfile && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={tutorProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    marginRight: 2,
                  }}
                />
              </Box>
              <div>
                <Typography>
                  <strong>Name: </strong>
                  {tutorProfile.userName}
                </Typography>
                <Typography>
                  <strong>Email: </strong>
                  {tutorProfile.email}
                </Typography>
                <Typography>
                  <strong>Phone Number: </strong>
                  {tutorProfile.phoneNumber}
                </Typography>
                <Typography>
                  <strong>Address: </strong>
                  {tutorProfile.address}
                </Typography>
                <Typography>
                  <strong>Gender: </strong>
                  {tutorProfile.gender}
                </Typography>
                <Typography>
                  <strong>Credentials:</strong>
                </Typography>
                {tutorProfile.credentials && tutorProfile.credentials.map(
                  (credential, index) => (
                    <div key={index}>
                      <Typography className="block" variant="body1" component="p">
                        - {credential.name}:
                      </Typography>
                      <img
                        src={credential.image}
                        alt={`Credential ${index + 1}`}
                        style={{
                          display: 'flex',
                          maxWidth: '60%',
                          margin: '10px auto',
                        }}
                      />
                      <br />
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
