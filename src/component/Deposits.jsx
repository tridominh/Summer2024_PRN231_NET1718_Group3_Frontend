import React, { useState, useEffect } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Title from "./Title";
import moment from "moment";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";
import getEndpoint from "../services/getEndpoint";

function preventDefault(event) {
  event.preventDefault();
}

export async function GetAllTransactions() {
  const response = await axios.get(`${getEndpoint()}/api/Transaction/GetAll`);
  return response.data;
}

export default function Deposits({ transactions }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [allTransactions, setAllTransactions] = useState([]);

  const totalAmount = transactions.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount;
  }, 0);

  const handleClickOpen = async () => {
    const data = await GetAllTransactions();
    setAllTransactions(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const bookingTransactions = allTransactions.filter(transaction => transaction.amount !== 10000);
  const postTransactions = allTransactions.filter(transaction => transaction.amount === 10000);

  return (
    <React.Fragment>
      <Title>Recent Transfers</Title>
      <Typography variant="h4">{totalAmount} VNĐ</Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        on {moment().format('DD MMMM, YYYY')}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={handleClickOpen}>
          View
        </Link>
      </div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle><strong>Recent Transfers</strong></DialogTitle>
        <DialogContent>
          <Tabs value={value} onChange={handleChange} aria-label="transaction tabs">
            <Tab label="Bookings" />
            <Tab label="Posts" />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>CreateDate</TableCell>
                  <TableCell>Amount (20%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{moment(transaction.createdDate).format('DD-MM-yyyy')}</TableCell>
                    <TableCell>{transaction.amount * 0.2}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>UserId</TableCell>
                  <TableCell>CreateDate</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.userId}</TableCell>
                    <TableCell>{moment(transaction.createdDate).format('DD-MM-yyyy')}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
