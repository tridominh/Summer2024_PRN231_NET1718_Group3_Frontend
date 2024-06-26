import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UpdatePost, GetPost } from '../../services/ApiServices/PostService';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
  display: 'none',
});

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '800px',
  backgroundColor: '#f9f9f9',
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const UpdatePostPage = ({userId}) => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await GetPost(postId);
        setPost(postData);
        setTitle(postData.title);
        setDescription(postData.description);
        setImagePreviews(postData.images.map(image => image.url));
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveImage = index => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('Id', postId);
    formData.append('Title', title);
    formData.append('Description', description);
    formData.append("UserId", userId);

    imageFiles.forEach(file => {
      formData.append('ImageFiles', file);
    });

    try {
      await UpdatePost(formData);
      setSnackbarMessage('Post updated successfully');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate(`/posts/${postId}`, { state: { openPost: true } });
    } catch (error) {
      setSnackbarMessage('Failed to update post');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      console.error('Error updating post:', error);
    }
  };

  useEffect(() => {
    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <CustomPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Update Post
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="Title"
                fullWidth
                variant="outlined"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Description
                </Typography>
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => setDescription(editor.getData())}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <label htmlFor="image-upload">
                <Input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
                <CustomButton variant="contained" component="span" startIcon={<PhotoCamera />}>
                  Upload Images
                </CustomButton>
              </label>
              <Box mt={2} display="flex" flexWrap="wrap">
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative" mr={1} mb={1}>
                    <img
                      src={preview}
                      alt={`Image Preview ${index}`}
                      style={{ width: 100, height: 100, objectFit: 'cover' }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleRemoveImage(index)}
                      style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} align="center">
              <CustomButton type="submit" variant="contained" color="primary">
                Update Post
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </CustomPaper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UpdatePostPage;
