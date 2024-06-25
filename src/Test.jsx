import { Pagination, Stack } from "@mui/material";
import React from "react";

export default function Test() {
  return (
    <div className="w-full px-24 py-4">
      <h1>Test</h1>
      <Stack spacing={2}>
        <Pagination count={10} />
        <Pagination count={10} color="primary" />
        <Pagination count={10} color="secondary" />
        <Pagination count={10} disabled />
      </Stack>
    </div>
  );
}
