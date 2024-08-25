import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";


const UploadFiles: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  // const [recentFiles, setRecentFiles] = useState<any[]>([]);

  const [dummyFiles] = useState([
    { id: 1, name: 'file1.pdf', uploadedAt: '2024-08-20' },
    { id: 2, name: 'file2.docx', uploadedAt: '2024-08-21' },
    { id: 3, name: 'file3.xlsx', uploadedAt: '2024-08-22' },
    { id: 4, name: 'file4.jpg', uploadedAt: '2024-08-23' },
    { id: 5, name: 'file5.png', uploadedAt: '2024-08-24' },
    { id: 6, name: 'file6.txt', uploadedAt: '2024-08-25' },
    { id: 7, name: 'file7.csv', uploadedAt: '2024-08-26' },
    { id: 8, name: 'file8.mp4', uploadedAt: '2024-08-27' },
    { id: 9, name: 'file9.zip', uploadedAt: '2024-08-28' },
    { id: 10, name: 'file10.pptx', uploadedAt: '2024-08-29' },
  ]);

  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered files based on search query
  const filteredFiles = dummyFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Append file directly
    });

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/material/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      console.log(result); // Handle the response data
      alert("Files uploaded successfully!");
      setFiles([]);
      fetchRecentFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, [])

  const fetchRecentFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/material/recent/');
      if (!response.ok) {
        throw new Error('Failed to fetch recent files');
      }

      const data = await response.json();
      setRecentFiles(data.slice(0, 5)); // Show only 5 most recent files
    } catch (error) {
      console.error('Error fetching recent files:', error);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <>
      <Container sx={{ marginTop: "10vh" }}>
        <Typography variant="h4" gutterBottom>
          Upload Files
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              Select Files
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>
        <Box mt={2}>
          {files.length > 0 && (
            <Box mt={2}>
              <Typography variant="h6">Selected Files</Typography>
              <Grid container spacing={2}>
                {files.map((file, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      border={1}
                      borderRadius={1}
                      p={2}
                      borderColor="grey.400"
                    >
                      <Typography>{file.name}</Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleFileRemove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFileUpload}
            disabled={files.length === 0 || uploading}
            fullWidth
          >
            {uploading ? <CircularProgress size={24} /> : "Upload Files"}
          </Button>
        </Box>
      </Container>

      <Container>
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Uploaded Files
        </Typography>
        <TextField
          label="Search Files"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Box
          sx={{
            maxHeight: 500, // Adjust height for scrollable area
            overflowY: 'auto', // Enable vertical scroll
            border: '1px solid #ddd', // Optional: Add border for visual distinction
            borderRadius: 1, // Optional: Add rounded corners
            padding: 2, // Optional: Add padding inside the scrollable area
          }}
        >
          <List>
            {filteredFiles.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  marginBottom: 1,
                }}
              >
                <ListItemText
                  primary={file.name}
                  secondary={`Uploaded on: ${file.uploadedAt}`}
                />
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
      {/* <Container>
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Recent Uploaded Files
          </Typography>
          <List>
            {recentFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={file.file_name}
                  secondary={file.uploaded_at}
                />
              </ListItem>
            ))}
          </List>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => (window.location.href = "/manage")}
            sx={{ mt: 2 }}
          >
            View All Files
          </Button>
        </Box>
      </Container> */}
    </>
  );
};

export default UploadFiles;
