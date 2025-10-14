import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Box, Alert, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import toast from 'react-hot-toast';

import { uploadEventGpx } from '../../api/events';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface EventFileUploadProps {
  eventId: string;
  onUploadSuccess?: () => void;
}

const EventFileUpload = ({ eventId, onUploadSuccess }: EventFileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.name.endsWith('.gpx')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setSelectedFile(null);
        setError('Please select a GPX file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadEventGpx(eventId, selectedFile);
      toast.success('GPX file uploaded successfully!');
      setSelectedFile(null);
      onUploadSuccess?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to upload GPX file.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom>
        Upload GPX File
      </Typography>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={uploading}
      >
        {selectedFile ? selectedFile.name : 'Choose GPX File'}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} accept=".gpx" />
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {uploading && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Uploading...
          </Typography>
        </Box>
      )}
      {selectedFile && !uploading && !error && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          sx={{ mt: 2, ml: 2 }}
        >
          Upload
        </Button>
      )}
    </Box>
  );
};

export default EventFileUpload;
