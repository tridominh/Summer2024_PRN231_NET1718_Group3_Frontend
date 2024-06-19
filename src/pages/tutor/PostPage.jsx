import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react"
import { GetAllPost } from "../../services/ApiServices/PostService";

export function PostPage() {
    const [posts, setPosts] = useState([])
    const [error, setError] = useState("")

    const fetchPosts = async (e) => {
        let data = null;
        try {
          data = await GetAllPost();
          setPosts(data);
        }
        catch (err) {
            //console.log(err);
          if (err.response.data.message) {
            // If the error response contains a message, set it as the error message
            setError(err.response.data.message);
          }
          else if (err.response.data[0].description) {
            setError(err.response.data[0].description);
          }
          else if (err.response.data) {
            setError(err.response.data);
          }
          else {
            // If the error is something else, set a generic error message
            setError('An error occurred. Please try again later.');
          }
          return;
        }
      };

    useEffect(() => {
        fetchPosts()
    }, [])

    if(posts.length == 0) {
        return (
            <div>
                No Posts
            </div>
        )
    }

    return (
        <div>
            {/*JSON.stringify(posts)*/}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow
                      key={post.title}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {post.title}
                      </TableCell>
                      <TableCell align="right">{post.description}</TableCell>
                      <TableCell align="right">{post.imageUrl}</TableCell>
                      <TableCell align="right">{post.createdDate}</TableCell>
                      <TableCell align="right">{post.updatedDate}</TableCell>
                      <TableCell align="right">{post.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
        </div>
    )
}

