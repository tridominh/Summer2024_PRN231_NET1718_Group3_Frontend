import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TableVirtuoso } from "react-virtuoso";
import { DeletePost, GetAllPost, GetPost, GetPostById, Refund, UpdatePost } from "../../services/ApiServices/PostService";
import { SendStatusMailPost, GetUserInfo } from "../../services/ApiServices/UserService";

export function ModeratorTutorPost() {
    const [posts, setPosts] = useState([]);
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await GetAllPost();
            const pendingPosts = data.filter(post => post.status === "PENDING");
            const postsWithUserInfo = await Promise.all(pendingPosts.map(async (post) => {
                const userInfo = await GetUserInfo(post.userId);
                return {
                    ...post,
                    userName: userInfo.userName,
                    email: userInfo.email
                };
            }));
            setPosts(postsWithUserInfo);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const approvePost = async (post) => {
        try {
            const updatedDates = new Date().toISOString();
            const formData = new FormData();
            formData.append(
                "id",post.id
            )
            formData.append(
                "userId",post.userId
            )
            formData.append(
                "title",post.title
            )
            formData.append(
                "description",post.description
            )
            formData.append(
                "imageUrl",post.imageUrl
            )
            formData.append(
                "createdDate",post.createdDate
            )
            formData.append(
                "updatedDate",updatedDates
            )
            formData.append(
                "status","ACTIVE"
            )
            await UpdatePost(formData);
            await SendStatusMailPost({
                email: post.email,
                status: "ACTIVE"
            });
            await fetchPosts();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const rejectPost = async (post) => {
        try {
            const updatedDates = new Date().toISOString();
            const formData = new FormData();
            formData.append(
                "id",post.id
            )
            formData.append(
                "userId",post.userId
            )
            formData.append(
                "title",post.title
            )
            formData.append(
                "description",post.description
            )
            formData.append(
                "imageUrl",post.imageUrl
            )
            formData.append(
                "createdDate",post.createdDate
            )
            formData.append(
                "updatedDate",updatedDates
            )
            formData.append(
                "status","REJECTED"
            )
            await DeletePost(post.id);
            await Refund(post);
            await SendStatusMailPost({
                email: post.email,
                status: "REJECTED"
            });
            await fetchPosts();
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const handleViewPostDetails = async (postId) => {
        try {
            const post = await GetPost(postId);
            const userInfo = await GetUserInfo(post.userId);
            console.log(post);
            setSelectedPostDetails({
                ...post,
                userName: userInfo.userName
            });
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message ||
                "An error occurred. Please try again later."
            );
        }
    };

    const columns = [
        { width: 100, label: "ID", dataKey: "id" },
        { width: 150, label: "User Name", dataKey: "userName" },
        { width: 200, label: "Title", dataKey: "title" },
        { width: 300, label: "Description", dataKey: "description" },
        { width: 100, label: "Status", dataKey: "status" },
        { width: 300, label: "Actions", dataKey: "actions" },
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) =>
                column.dataKey !== "actions" ? (
                    <TableCell key={column.dataKey} align="left">
                        {row[column.dataKey]}
                    </TableCell>
                ) : (
                    <TableCell style={{ minWidth: "400px" }} key={column.dataKey} align="left">
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="success"
                            onClick={() => approvePost(row)}
                        >
                            Approve
                        </Button>
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="error"
                            onClick={() => rejectPost(row)}
                        >
                            Reject
                        </Button>
                        <Button
                            style={{ marginLeft: "7px" }}
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewPostDetails(row.id)}
                        >
                            View
                        </Button>
                    </TableCell>
                )
            )}
        </>
    );

    return (
        <>
            <Box
                sx={{
                    p: 4,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 3,
                    maxWidth: 1200,
                    width: "100%",
                    mt: 4,
                    mx: "auto",
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        color: "#5c6bc0",
                    }}
                >
                    Tutor Post Approval Requests
                </Typography>
                <Paper style={{ height: 400, width: "100%" }}>
                    <TableVirtuoso
                        data={posts}
                        components={{
                            Scroller: TableContainer,
                            Table: (props) => (
                                <Table {...props} sx={{ borderCollapse: "separate" }} />
                            ),
                            TableRow: ({ item: _item, ...props }) => (
                                <TableRow {...props} />
                            ),
                            TableBody: React.forwardRef((props, ref) => (
                                <TableBody {...props} ref={ref} />
                            )),
                        }}
                        fixedHeaderContent={() => (
                            <TableRow style={{background: "white"}}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.dataKey}
                                        align="left"
                                        style={{ width: column.width }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                        itemContent={rowContent}
                    />
                </Paper>
            </Box>

            <Dialog
                open={selectedPostDetails !== null}
                onClose={() => setSelectedPostDetails(null)}
                aria-labelledby="post-details-title"
            >
                <DialogTitle id="post-details-title">
                    Post Details
                </DialogTitle>
                <DialogContent>
                    {selectedPostDetails && (
                        <>
                            <Typography variant="body1">
                                <strong>ID:</strong> {selectedPostDetails.id}
                            </Typography>
                            <Typography variant="body1">
                                <strong>User Name:</strong> {selectedPostDetails.userName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Title:</strong> {selectedPostDetails.title}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Description:</strong> {selectedPostDetails.description}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong> {selectedPostDetails.status}
                            </Typography> 
                            {selectedPostDetails.imageUrl && (
                                <img
                                    src={selectedPostDetails.imageUrl}
                                    alt="Post"
                                    style={{ display: "flex",
                                        maxWidth: "60%",
                                        margin: "10px auto",}}
                                />
                            )}  
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedPostDetails(null)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ModeratorTutorPost;
