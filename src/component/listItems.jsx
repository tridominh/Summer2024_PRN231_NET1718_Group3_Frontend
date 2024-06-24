import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';

export const MainListItems = () => (
  <React.Fragment>
    <ListItemButton component={RouterLink} to="/profile">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/students-management"> 
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Students" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/tutors-management"> 
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Tutors" />
    </ListItemButton>
    <ListItemButton component={RouterLink} to="/admin/subject-level">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Subjects &amp; Levels" />
    </ListItemButton>
<<<<<<< HEAD
    <ListItemButton component={RouterLink} to="/admin/transfer-to-tutor">
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Transfer to Tutor" />
=======
    <ListItemButton component={RouterLink} to="/admin/booking">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Bookings" />
>>>>>>> 35bed97129aa67578fb3ec5dfadc6e04403afa17
    </ListItemButton>
  </React.Fragment>
);

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  backgroundColor: 'brown',
  color: 'white',
  '&:hover': {
    backgroundColor: 'brown',
  },
}));

export const SecondaryListItems = ({ logout }) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
    <CustomListItemButton  onClick={logout}>
      <ListItemIcon>
      </ListItemIcon>
      <div style={{marginLeft:"18px"}}>
      <ListItemText  primary="Logout" />
      </div>
    </CustomListItemButton >
  </React.Fragment>
);


