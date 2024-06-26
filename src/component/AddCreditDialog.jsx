import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PayService } from "../services/ApiServices/VnpayService";
import { formatPrice } from "../services/formatPrice";

export function AddCreditDialog({ open, handleClose, userId }) {
    const [credit, setCredit] = useState(0.0);
    const [errorMessage, setErrorMessage] = useState("");

    const addCredit = async () => {
        try {
            let payDto = {
                userId: userId,
                amount: parseFloat(credit),
                orderInfo: "Add Credit",
            }
            const response = await PayService(payDto);
            //console.log(response);
            window.location.href = response.data;
            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    // Function to handle changes in the input field
    const handleChangeCredit = (event) => {
        const inputValue = event.target.value;

        // Regex to validate decimal numbers
        const decimalRegex = /^-?\d*\.?\d*$/;

        if (decimalRegex.test(inputValue)) {
            setCredit(inputValue);
        }
    };

    return (
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add more credit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              className="mt-1"
              label="Enter the amount to add (in VND)"
              value={credit}
              InputProps={{
                  endAdornment: <InputAdornment position="end">₫</InputAdornment>,
              }}
              onChange={(e) => handleChangeCredit(e)}
              fullWidth
            />
            <div className="text-red-500">{errorMessage}</div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addCredit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
}
