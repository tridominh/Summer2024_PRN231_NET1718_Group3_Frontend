import React, { useEffect, useState } from "react";
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
  Button,
  Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  DeletePost,
  GetAllPost,
  UpdatePost,
} from "../../services/ApiServices/PostService";
import { GetUserInfo } from "../../services/ApiServices/UserService";
// import { AuthContext } from "../context/AuthProvider";
import { CreatePostPage } from './CreatePostPage'; 

export function PostPage({ id }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState({});
  const [tutorProfile, setTutorProfile] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State for delete confirmation dialog
  const [postIdToDelete, setPostIdToDelete] = useState(null); // State to store the postId to delete
  const navigate = useNavigate();
  // const { auth } = useContext(AuthContext);
  const [createPostDialogOpen, setCreatePostDialogOpen] = useState(false);
 
  const handleOpenCreatePostDialog = () => {
    setCreatePostDialogOpen(true);
  };

  const handleCloseCreatePostDialog = () => {
    setCreatePostDialogOpen(false);
  };

  const fetchPosts = async () => {
    try {
      const data = await GetAllPost();
      console.log(data);
      const activePosts = data.filter((post) => post.status === "ACTIVE");
      setPosts(activePosts);

      const userPromises = activePosts.map((post) => GetUserInfo(post.userId));
      const usersData = await Promise.all(userPromises);
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      setUsers(usersMap);

    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            "An error occurred. Please try again later."
        );
      } else {
        setError("An error occurred. Please try again later.");
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

  const handlePopoverOpen = (event, postId, userId) => {
    if (id && userId == id) {
      setPopoverAnchorEl(event.currentTarget);
      setCurrentPostId(postId);
    }
    console.log(id);
    console.log(userId);
  };

  const openPopover = Boolean(popoverAnchorEl);

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setCurrentPostId(null);
  };

  const handleUpdatePost = async (postId, userId) => {
    if (id && userId === id) {
      try {
        await UpdatePost(postId);
        console.log(`Post with ID ${postId} updated successfully.`);
      } catch (error) {
        console.error("Error updating post:", error);
      } finally {
        handlePopoverClose();
      }
    }
  };

  const handleDeleteButtonClick = (postId, userId) => {
    if (id && userId === id) {
      setPostIdToDelete(postId);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await DeletePost(postIdToDelete);
      console.log(`Post with ID ${postIdToDelete} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteDialogOpen(false);
      fetchPosts(); // Reload posts after deletion
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPostIdToDelete(null);
  };

  const createMarkup = (htmlString) => {
    return { __html: htmlString };
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h6">No Posts</Typography>
      </Box>
    );
  }

  return (
    <Box p={2} maxWidth="2000px" mx="auto">
      <Typography
        sx={{ fontWeight: "bold" }}
        variant="h4"
        gutterBottom
        align="center"
      >
        NEWSFEED
      </Typography>
      {posts.map((post) => (
        <Box key={post.id} mb={3} mx="auto" maxWidth={600}>
          <Card
            sx={{
              backgroundColor: "#6c757d4d",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              className="ml-2 mt-2"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={1}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  src={users[post.userId]?.avatar}
                  alt={users[post.userId]?.userName}
                />
                <Typography
                  variant="body1"
                  sx={{
                    marginLeft: 1,
                    fontSize: "17px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => handleUserClick(post.userId)}
                >
                  {users[post.userId]?.userName}
                </Typography>
              </Box>
              {/* {JSON.stringify(post.userId)} */}
              {id && post.userId == id && (
                <Button
                  className="mb-2"
                  style={{
                    marginLeft: "300px",
                    fontSize: "20px",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={(event) => handlePopoverOpen(event, post.id, post.userId)}
                >
                  ...
                </Button>
              )}
            </Box>
            <Typography
              className="ml-2"
              variant="body2"
              color="text.secondary"
              sx={{ p: 1 }}
            >
              {new Date(post.createdDate).toLocaleDateString()}
            </Typography>
            <Typography className="ml-2" variant="h5" component="div" sx={{ p: 1 }}>
              {post.title}
            </Typography>
            <Typography
              className="ml-2"
              variant="body1"
              sx={{ p: 1, whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={createMarkup(post.description)}
            />
            {post.imageUrl && (
              <CardActionArea
                onClick={() => navigate(`/posts/${post.id}`)}
                sx={{ flexGrow: 1 }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.imageUrl}
                  alt={post.title}
                  sx={{ objectFit: "cover" }}
                />
              </CardActionArea>
            )}
          </Card>
          <br></br>
        </Box>
      ))}
      <Popover
        open={openPopover}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box p={2}>
          <Button
            variant="text"
            onClick={() => {
              handleUpdatePost(currentPostId, id);
            }}
          >
            Update
          </Button>
          <Button
            variant="text"
            onClick={() => {
              handleDeleteButtonClick(currentPostId, id);
            }}
          >
            Delete
          </Button>
        </Box>
      </Popover>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this post?
          </Typography>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
            Yes
          </Button>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>    
        </DialogActions>
      </Dialog>
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
                {tutorProfile.credentials &&
                  tutorProfile.credentials.map((credential, index) => (
                    <div key={index}>
                      <Typography className="block" variant="body1" component="p">
                        - {credential.name}:
                      </Typography>
                      <img
                        src={credential.image}
                        alt={`Credential ${index + 1}`}
                        style={{
                          display: "flex",
                          maxWidth: "60%",
                          margin: "10px auto",
                        }}
                      />
                      <br />
                    </div>
                  ))}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProfileDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={createPostDialogOpen}
        onClose={handleCloseCreatePostDialog}
        aria-labelledby="create-post-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="create-post-dialog-title">Create New Post</DialogTitle>
        {/* <DialogContent>
          {auth?.user?.id && <CreatePostPage userId={auth.user.id} />} 
        </DialogContent> */}
      </Dialog>
    </Box>
  );
}