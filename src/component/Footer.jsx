import { Box, Container, Typography } from "@mui/material";
import React from "react";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "flex-end",
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography align="center" variant="body1">
          <p>
            Copyright &copy;
            {new Date().getFullYear()} All rights reserved | This web is
            developed by SmartHead
          </p>
        </Typography>
      </Container>
    </Box>
  );
}
