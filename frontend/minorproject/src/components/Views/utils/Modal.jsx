/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Container } from '@mui/material';

const Modal = ({ isOpen, onClose, onSave, selectedCountry, Mode }) => {
  const initialData = {
    countryName: '',
    countryCode: '',
    phoneCode: ''
  };

  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Update form data when selectedCountry changes
    if (selectedCountry && Mode === 'edit') {
      setFormData({
        countryName: selectedCountry.countryname || '',
        countryCode: selectedCountry.countrycode || '',
        phoneCode: selectedCountry.phonecode || ''
      });
    } else {
      setFormData(initialData);
    }
  }, [selectedCountry]);

  const validateForm = () => {
    const newErrors = {};

    // Validate country name
    if (!formData.countryName.match(/^[A-Za-z]{1,50}$/)) {
      newErrors.countryName = 'Country name should contain only alphabets (max 50 characters)';
    }

    // Validate country code
    if (!formData.countryCode.match(/^[A-Za-z]{1,2}$/)) {
      newErrors.countryCode = 'Country code should contain only alphabets (max 2 characters)';
    }

    // Validate phone code
    if (!formData.phoneCode.match(/^\d{1,4}$/)) {
      newErrors.phoneCode = 'Phone code should contain only digits (max 4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSave = () => {
    if (validateForm()) {
      if (Mode === 'edit') {
        onSave({ ...formData, countryid: selectedCountry.countryid });
      }
      if (Mode === 'add') {
        onSave(formData);
      }
      onClose();
      setFormData(initialData);
    }
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleCloseCancle = () => {
    if (selectedCountry && Mode === 'edit') {
      onClose();
    }
    setFormData(initialData);
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} PaperProps={{ style: { width: '25%' } }}   >
  <DialogTitle className='flex justify-between'>
    {Mode === 'edit' ? 'Update Country' : 'Add Country'}
    <IconButton aria-label="close" onClick={handleClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent className='flex flex-col'>
    <TextField
      label="Country Name"
      variant="outlined"
      margin="normal"
      name="countryName"
      value={formData.countryName}
      onChange={handleChange}
      error={!!errors.countryName}
      helperText={errors.countryName}
    />
    <TextField
      label="Country Code"
      variant="outlined"
      name="countryCode"
      margin="normal"
      value={formData.countryCode}
      onChange={handleChange}
      error={!!errors.countryCode}
      helperText={errors.countryCode}
    />
    <TextField
      label="Phone Code"
      variant="outlined"
      name="phoneCode"
      margin="normal"
      value={formData.phoneCode}
      onChange={handleChange}
      error={!!errors.phoneCode}
      helperText={errors.phoneCode}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseCancle} color="primary">
    {selectedCountry ? 'Cancel' : 'Cancel'}
    </Button>
    <Button onClick={handleSave} color="primary">
      {selectedCountry ? 'Update' : 'Save'}
    </Button>
  </DialogActions>
</Dialog>


  );
};

export default Modal;
