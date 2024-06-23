import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { TableVirtuoso } from "react-virtuoso";
import { GetUserInfo } from "../../services/ApiServices/UserService";
import { GetAllPost, GetPostById } from "../../services/ApiServices/PostService";

export function PendingPost({ userId }) {
    const [posts, setPosts] = useState([]);
    const [selectedPostDetails, setSelectedPostDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await GetAllPost();
            console.log(data);
            const pendingPosts = data.filter(post => post.status === "PENDING" && post.userId == userId);
            console.log(pendingPosts);
            console.log(userId);
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

    const handleViewPostDetails = async (postId) => {
        try {
            const post = await GetPostById(postId);
            const userInfo = await GetUserInfo(post.userId);
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
        { width: 100, label: "Actions", dataKey: "actions" },
    ];

    const rowContent = (_index, row) => (
        <>
            {columns.map((column) =>
                column.dataKey !== "actions" ? (
                    <TableCell key={column.dataKey} align="left">
                        {row[column.dataKey]}
                    </TableCell>
                ) : (
                    <TableCell key={column.dataKey} align="left">
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
                    Post Requests
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

export default PendingPost;
