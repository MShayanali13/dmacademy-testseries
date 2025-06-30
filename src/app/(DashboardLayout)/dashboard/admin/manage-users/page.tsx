"use client";
export const dynamic = 'force-dynamic'

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Edit, Delete, Cancel } from "@mui/icons-material";
import PageContainer from "../../components/container/PageContainer";
import { SubjectWithChaptersType, getUniqueSubjects, getChaptersBySubject } from "@/lib/getSubjectWiseChapter";
import { useRouter } from "next/navigation";
import QuestionTypeSelector from "../../components/questionTypeSelector";
import { unstable_noStore as noStore } from "next/cache";

import * as XLSX from "xlsx";
import Loading from "../../loading";

// Define the type for a question
export interface UserData {
  _id: string;
  clerkId: string,
   username:string,
   email: string,
   name: string,
   role:  string,
    
   
   isIndividual: boolean,
   isSubscribed: boolean,
}


export default function ManageQuestionBank() {
  // Use the Question type for the state

  noStore()

  const [users, setUsers] = useState<UserData[]>([]);
 const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading,setIsLoading]=useState(true)
    

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/Fetch-Users",{cache:"no-store"});
      if (!res.ok) {
        console.error("Failed to fetch Users");
        return;
      }
     
      const data = await res.json();
      setUsers(data.users || []);
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`/api/Delete-User/${id}`,{cache:"no-store",
        method: 'DELETE',
      });
  
      if (res.ok) {
        alert('User deleted successfully');
        // Update UI without full reload
        setUsers(prevUsers => prevUsers.filter(q => q._id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong while deleting.');
    }
  };
  


const [isSubmitted, setIsSubmitted] = useState(false);
const [isUserModalOpen, setIsUserModalOpen] = useState(false);
const [editingUser, setEditingUser] = useState<Partial<UserData> | null>(null);

const openAddUserModal = () => {
  setEditingUser(null);
  setIsUserModalOpen(true);
};

const openEditUserModal = (user: UserData) => {
  setEditingUser(user);
  setIsUserModalOpen(true);
};

const handleUserSubmit = async (formData: Partial<UserData>) => {
  try {
    const isEdit = !!editingUser;

    const response = await fetch(
      isEdit ? `/api/Edit-User/${editingUser!._id}` : "/api/Create-User",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      alert(isEdit ? "User updated!" : "User created!");
      setIsUserModalOpen(false);
      setEditingUser(null);

      const updated = await response.json();
      setUsers((prev) => {
        if (isEdit) {
          return prev.map((u) => (u._id === updated.user._id ? updated.user : u));
        } else {
          return [...prev, updated.user];
        }
      });
    } else {
      alert("Failed to save user");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


const handleDownloadExcel = () => {
  const exportData = users.map((u) => ({
    username: u.username?? "",
    email: u.email ?? "",
    isSubscribed: u.isSubscribed ?? "",

    
    name: u.name ?? "",
    role: u.role ?? "",
    
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData, {
    header: [
      "username",
      "email",
      "isSubscribed",
      "name",
      "role",
      
    ],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  XLSX.writeFile(workbook, "Users.xlsx");
};


useEffect(()=>{
if(users){
  setIsLoading(false)
}
},[users])


if(isLoading){
  return <Loading />
}


  return (
    
    <PageContainer title="Manage Users" description="this is manage Users page">
      <Box  mb={3}>
        <Typography variant="h4" mb={4}>
          Users
        </Typography>
      <Grid container justifyContent={"space-between"}> 
        <Grid item>
<Button
  variant="contained"
  color="primary"
  onClick={handleDownloadExcel}
  sx={{ marginTop: "20px" }}
>
  Export Users
</Button>

{/* </Grid>   */}
{/* <Grid item> */}
<Button
  variant="contained"
  color="primary"
  onClick={openAddUserModal}
  sx={{  marginTop: "20px", marginLeft: "15px" }}
>
  Add New User
</Button>
</Grid>
<Grid item> 
{selectedUsers.length > 0 && (
  <Button
  variant="contained"
  color="error"
  sx={{ marginTop: "20px", marginLeft: "15px" }}
  onClick={async () => {
    const confirmDelete = confirm("Are you sure you want to delete selected Users?");
    if (!confirmDelete) return;
    
    try {
      const res = await fetch("/api/Bulk-Delete-Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedUsers }),
      });

      if (res.ok) {
        alert("Selected Users deleted successfully");
        setUsers(prev => prev.filter(q => !selectedUsers.includes(q._id)));
        setSelectedUsers([]);
      } else {
        alert("Failed to delete selected Users");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }}
  >
    Delete Selected ({selectedUsers.length})
  </Button>
)}
</Grid>
</Grid>
      </Box>

      {/* ✅ Table Scroll Wrapper */}
      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 780 }}>
        <TableContainer
  component={Paper}
  elevation={1}
  sx={{
    maxHeight: 500,
    borderRadius: 3,
    overflow: "auto",
  }}
>

<Table
  stickyHeader
  sx={{
    borderCollapse: "collapse",
    width: "100%",
    fontFamily: "Inter, sans-serif",
    "& thead th": {
      backgroundColor: "#f4f5f7", // subtle gray header
      color: "#333",
      fontWeight: 600,
      fontSize: "0.9rem",
      
      border: "1px solid rgb(197, 197, 197)",
      
      textAlign: "left",
    },
    "& tbody td": {
      // borderBottom: "1px solid #e0e0e0",
      border: "1px solid rgb(197, 197, 197)",
      fontSize: "0.87rem",
      color: "#2c2c2c",
      backgroundColor: "#ffffff",
    },
    "& tbody tr:nth-of-type(even) td": {
      backgroundColor: "#fafafa",
    },
    "& tbody tr:hover td": {
      backgroundColor: "#f0f2f5",
      transition: "background 0.3s ease",
    },
  }}
>


    <TableHead>
      {/* <TableRow sx={{ backgroundColor: "#1976d2" }}>
        {[
          "Subject",
          "Chapter",
          "Level",
          "Question",
          "Options",
          "Answer",
          "Actions",
        ].map((header) => (
          <TableCell
            key={header}
            sx={{
              color: "#fff",
              fontWeight: "bold",
              border: "1px solid #efefef",
            
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow> */}
      <TableRow>
  <TableCell
    padding="checkbox"
    sx={{
      position: "sticky",
      top: 0,
      zIndex: 1,
    padding:"10px 21px"
    }}
  >
    <input
      type="checkbox"
      checked={users.length > 0 && selectedUsers.length === users.length}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedUsers(users.map((q) => q._id));
        } else {
          setSelectedUsers([]);
        }
      }}
    />
  </TableCell>
  {["Username", "Email", "Is Subscribed", "Name", "Role","Actions"].map((header) => (
    <TableCell
      key={header}
      sx={{
        color: "#fff",
        fontWeight: "bold",
        border: "1px solid #efefef",
      
        position: "sticky",
        top: 0,
        zIndex: 1,
        
        
      }}
    >
      {header}
    </TableCell>
  ))}
</TableRow>

    </TableHead>

    <TableBody>
      {users.map((u, index) => (
        <TableRow
          key={u._id}
          hover
          sx={{
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
            "&:hover": { backgroundColor: "#e3f2fd" },
          }}
        >
          <TableCell padding="checkbox" sx={{padding:"0 21px 0 21px"}}>
  <input
    type="checkbox"
    checked={selectedUsers.includes(u._id)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedUsers((prev) => [...prev, u._id]);
      } else {
        setSelectedUsers((prev) => prev.filter((id) => id !== u._id));
      }
    }}
  />
</TableCell>

          <TableCell >{u.username}</TableCell>
          <TableCell >{u.email}</TableCell>
          <TableCell >
            <Chip
              label={u.isSubscribed?"Yes":"No"}
              size="small"
              sx={{
                fontWeight: 600, fontSize:"16px", padding:"3px 7px",
                backgroundColor:
                  u.isSubscribed
                    ? "#E6FFFA"
                    // : "#FFF8E1"
                    : "#FDEDE8"
                    ,
                color:
                  u.isSubscribed
                    ? "#02b3a9"
                    // : "#ae8e59",
                    : "#f3704d",
              }}
            />
          </TableCell>
         
           <TableCell >{u.name}</TableCell>
           
           <TableCell >{u.role}</TableCell>
          <TableCell >
            <IconButton onClick={() => openEditUserModal(u)} sx={{ color: "#1976d2" }}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => handleDelete(u._id)} sx={{ color: "#d32f2f" }}>
              <Delete />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

        </Box>
        <UserFormModal
  open={isUserModalOpen}
  onClose={() => setIsUserModalOpen(false)}
  onSubmit={handleUserSubmit}
  initialData={editingUser || undefined}
/>

      </Box>
    </PageContainer>
  );
}




function UserFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserData>) => void;
  initialData?: Partial<UserData>;
}) {
  const [formData, setFormData] = useState<Partial<UserData>>({
    username: "",
    email: "",
    name: "",
    role: "student",
    isSubscribed: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        email: initialData.email || "",
        name: initialData.name || "",
        role: initialData.role || "student",
        isSubscribed: initialData.isSubscribed || false,
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof UserData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.username || !formData.email || !formData.name || !formData.role) {
      alert("Please fill all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialData ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
        <TextField
          label="Username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          fullWidth
        />
        <TextField
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          fullWidth
        />
        <TextField
          label="Role"
          select
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
          fullWidth
        >
          {["student", "teacher", "college", "admin"].map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Is Subscribed"
          select
          value={formData.isSubscribed ? "true" : "false"}
          onChange={(e) => handleChange("isSubscribed", e.target.value === "true")}
          fullWidth
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}