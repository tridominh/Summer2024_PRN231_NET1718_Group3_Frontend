import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { AddCreditDialog } from "../component/AddCreditDialog";
import { GetUserInfo } from "../services/ApiServices/UserService";
import { formatPrice } from "../services/formatPrice";

export function CreditPage({ userId }) {
    //credit dialog state
    const [openCredit, setOpenCredit] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [errorMessage, setErrorMessage] = useState();

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
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    return (
      <div style={{ height: "80vh"}}>
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
            
            <div className="text-red-500">{errorMessage}</div>
      </div>
    )
}

