import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { AddCreditDialog } from "../component/AddCreditDialog";
import { GetUserInfo } from "../services/ApiServices/UserService";
import { formatPrice } from "../services/formatPrice";
import { GetAllTransactionByUserId } from "../services/ApiServices/TransactionService";
import moment from "moment/moment";

export function CreditPage({ userId }) {
    //credit dialog state
    const [openCredit, setOpenCredit] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [errorMessage, setErrorMessage] = useState();
    const [transactions, setTransactions] = useState([]);

    const handleOpenCredit = () => {
        setOpenCredit((openCredit) => !openCredit);
    };

    const fetchUserInfo = async () => {
        try {
            const userInfo = await GetUserInfo(userId);
            setUserInfo(userInfo);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    };

    const fetchTransactions = async () => {
        try {
            const transactions = await GetAllTransactionByUserId(userId);
            setTransactions(transactions.data);
        } catch (error) {
            console.log(error)
            setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again later.');
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchTransactions();
    }, []);

    return (
        <div className="mb-8" style={{ minHeight: "80vh" }}>
            <Box className="credit-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                    CREDITS
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h6">Your credit balance:</Typography>
                    <Typography sx={{ ml: 1 }}>{formatPrice(userInfo.credit)}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-start" mb={2}>
                    <Button variant="contained" color="primary" onClick={handleOpenCredit}>
                        Add Credit
                    </Button>
                </Box>
            </Box>
            <AddCreditDialog open={openCredit} handleClose={handleOpenCredit} userId={userId} />

            <Box className="credit-info-wrapper" sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, maxWidth: 800, mx: 'auto', marginTop: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                    TRANSACTION
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="transaction table">
                        <TableHead>
                            <TableRow>

                                <TableCell>ID</TableCell>
                                <TableCell>TransactionId</TableCell>
                                <TableCell>Message</TableCell>
                                <TableCell>Transfer Date</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions && transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{transaction.transactionCode}</TableCell>
                                    <TableCell>{transaction.message}</TableCell>
                                    <TableCell>{moment(transaction.createDate).format("DD-MM-YYYY")}</TableCell>
                                    <TableCell>{formatPrice(transaction.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <div className="text-red-500">{errorMessage}</div>
        </div>
    )
}
