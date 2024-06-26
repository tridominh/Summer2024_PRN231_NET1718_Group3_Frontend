import { useState, useEffect } from "react";
import { TextField, Button, Box, Typography, Grid, Paper, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AddPost } from "../../services/ApiServices/PostService";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { formatPrice } from '../../services/formatPrice';
import { PayService } from "../../services/ApiServices/VnpayService";

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

export function CreatePostPage({ userId }) {
  const [fields, setFields] = useState([
    { name: "title", value: "", type: "text" },
    { name: "description", value: "", type: "richtext" },
  ]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [openConfirmPost, setOpenConfirmPost] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirmCredit, setOpenConfirmCredit] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const handleFieldChange = (name, value, type) => {
    setFields(prevFields =>
      prevFields.map(field => (field.name === name ? { ...field, value, type } : field))
    );
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleCloseConfirmPost = () => {
    setOpenConfirmPost(x => !x);
  };

  const handleCloseConfirmCredit = () => {
    setOpenConfirmCredit(x => !x);
  };

  const handleConfirmPost = () => {
    handleSubmit();
  };

  const handleConfirmCredit = () => {
    addCredit();
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

  const addCredit = async () => {
    try {
      let payDto = {
        userId: userId,
        amount: 10000,
        orderInfo: "Add Credit",
      }
      const response = await PayService(payDto);
      window.location.href = response.data;
      handleCloseConfirmCredit();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("Title", fields.find(field => field.name === "title").value);
    formData.append("Description", fields.find(field => field.name === "description").value || " ");
    formData.append("UserId", userId);

    imageFiles.forEach((file) => {
      formData.append("ImageFiles", file);
    });

    try {
      const newPost = await AddPost(formData);
      handleCloseConfirmPost();
      navigate(`/posts/${newPost.id}`, { state: { openPost: true } });
      setSnackbarMessage("Your post is being waited for accept");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response.status === 400 && error.response.data === "Not enough credit") {
        handleCloseConfirmPost();
        setOpenConfirmCredit(true);
      } else {
        setSnackbarMessage("Error creating post");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        console.error("Error creating post:", error);
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <CustomPaper elevation={3}>
        <Typography variant="h4" align="center" gutterBottom>
          Create New Post
        </Typography>

        <form onSubmit={(e) => {
          e.preventDefault()
          handleCloseConfirmPost()
        }}>
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
            <div className="text-red-500">{`You need ${formatPrice(10000)} to create a post.`}</div>
            <Grid item xs={12} align="center">
              <CustomButton type="submit" variant="contained" color="primary">
                Create Post
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      </CustomPaper>
      <Dialog open={openConfirmPost} onClose={handleCloseConfirmPost}>
        <DialogTitle>Are you sure to upload this post</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <div className="font-semibold text-lg">
              This will use {formatPrice(10000)} of your credit balance.
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmPost}>Cancel</Button>
          <Button onClick={handleConfirmPost} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmCredit} onClose={handleCloseConfirmCredit}>
        <DialogTitle>You don't have enough credit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <div className="font-semibold text-lg">
              Do you want to add {formatPrice(10000)} to your credit balance.
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmCredit}>Cancel</Button>
          <Button onClick={handleConfirmCredit} color="primary">
            Add more credit
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
