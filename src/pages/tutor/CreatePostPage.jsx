import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid, Paper, Avatar, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddPost } from "../../services/ApiServices/PostService";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { Alert, Snackbar } from "@mui/material";

const Input = styled('input')({
  display: 'none',
});

const CustomPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '800px',
  backgroundColor: '#f9f9f9'
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

export function CreatePostPage({userId}) {
  const [fields, setFields] = useState([
    { name: "title", value: "", type: "text" },
    { name: "description", value: "", type: "richtext" },
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleFieldChange = (name, value, type) => {
    setFields(prevFields =>
      prevFields.map(field => (field.name === name ? { ...field, value, type } : field))
    );
  };

  useEffect(() => {
    if (imageFiles.length === 0) return;

    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imageFiles]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Title", fields.find(field => field.name === "title").value);
    formData.append("Description", fields.find(field => field.name === "description").value);
    formData.append("UserId", userId);

    imageFiles.forEach((file, index) => {
      formData.append("ImageFile", file);
    });

    try {
      await AddPost(formData);
      setSubmissionStatus('success');
      setTimeout(() => {
        navigate('/newsfeed');
      }, 2000); 
    } catch (error) {
      console.error("Error creating post:", error);
      setSubmissionStatus('error');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Snackbar
        open={submissionStatus !== null}
        autoHideDuration={6000}
        onClose={() => setSubmissionStatus(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity={submissionStatus} onClose={() => setSubmissionStatus(null)}>
          {submissionStatus === 'success'
            ? 'Post created successfully! It\'s pending approval.'
            : 'Failed to create post. Please try again.'}
        </Alert>
      </Snackbar>
      <CustomPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                label="Title"
                fullWidth
                variant="outlined"
                value={fields.find(field => field.name === "title").value}
                onChange={(e) => handleFieldChange("title", e.target.value, "text")}
              />
            </Grid>

            <Grid item xs={12}>
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Description
                </Typography>
                <CKEditor
                  editor={ClassicEditor}
                  data={fields.find(field => field.name === "description").value}
                  onChange={(event, editor) => handleFieldChange("description", editor.getData(), "richtext")}
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

              <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
                {imagePreviews.map((preview, index) => (
                  <Box key={index} position="relative">
                    <Avatar
                      variant="square"
                      alt={`Image Preview ${index + 1}`}
                      src={preview}
                      sx={{ width: 200, height: 150 }}
                    />
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleRemoveImage(index)}
                      sx={{ position: 'absolute', top: 0, right: 0 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} align="center">
              <CustomButton type="submit" variant="contained" color="primary">
                Create Post
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </CustomPaper>
    </Box>
  );
}
