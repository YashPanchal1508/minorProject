/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import  { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogTitle from '@mui/material/DialogTitle';
// import DialogContent from '@mui/material/DialogContent';
// import DialogActions from '@mui/material/DialogActions';
// import TextField from '@mui/material/TextField';
// import { IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';

// const Modal = ({ isOpen, onClose, onSave, selectedCountry, Mode  }) => {
//   const initialData = {
//     countryName: '',
//     countryCode: '',
//     phoneCode: ''
//   };

//   const [formData, setFormData] = useState(initialData);

//   useEffect(() => {
   
//     // Update form data when selectedCountry changes
//     if (selectedCountry && Mode === 'edit') {

      
//       setFormData({
//         countryName: selectedCountry.countryname || '',
//         countryCode: selectedCountry.countrycode || '',
//         phoneCode: selectedCountry.phonecode || '',
       
//       });
//     } else {
//       setFormData(initialData);
//     }
//   }, [selectedCountry]);  

//   const handleSave = () => {
//     if(Mode === 'edit'){

//       onSave({...formData,  countryid: selectedCountry.countryid});
//     }
   
//     if(Mode === 'add'){
//         onSave(formData)
//     }
//     // console.log(formData)
//     onClose();
//     setFormData(initialData)
//   };

//   const handleChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleCancel = () => {
//     setFormData(initialData);
//   };

//   const handleClose = () => {
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onClose={handleClose}>
//       <DialogTitle className='flex justify-between'>
//        { Mode === 'edit' ? 'Update Country' : "Add Country"}
//         <IconButton aria-label="close" onClick={handleClose}>
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <TextField
//           label="Country Name"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           name="countryName"
//           value={formData.countryName}
//           onChange={handleChange}
//         />
//         <TextField
//           label="Country Code"
//           variant="outlined"
//           fullWidth
//           name="countryCode"
//           margin="normal"
//           value={formData.countryCode}
//           onChange={handleChange}
//         />
//         <TextField
//           label="Phone Code"
//           variant="outlined"
//           fullWidth
//           name="phoneCode"
//           margin="normal"
//           value={formData.phoneCode}
//           onChange={handleChange}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleCancel} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSave} color="primary">
//         {selectedCountry ? 'Update' : 'Save'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default Modal;

// import React, { useState, useEffect } from 'react';
// import { X } from 'lucide-react';

// const Modal = ({ onClose, onSaveCountry, country, Mode, onEditCountry }) => {
//   const initialFormData = {
//     countryname: '',
//     countrycode: '',
//     phonecode: '',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [validationErrors, setValidationErrors] = useState({});

//   const handleChange = (e) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};

//     // Validation for country name
//     if (formData.countryname.length > 10) {
//       errors.countryname = 'Maximum 10 characters allowed';
//     } else if (!/^[a-zA-Z]+$/.test(formData.countryname)) {
//       errors.countryname = 'Enter only alphabets';
//     }

//     // Validation for country code
//     if (formData.countrycode.length > 4) {
//       errors.countrycode = 'Maximum 4 characters allowed';
//     } else if (!/^[a-zA-Z]+$/.test(formData.countrycode)) {
//       errors.countrycode = 'Enter only alphabets';
//     }

//     // Validation for phone code
//     if (formData.phonecode.length > 3) {
//       errors.phonecode = 'Maximum 3 characters allowed';
//     } else if (!/^\d+$/.test(formData.phonecode)) {
//       errors.phonecode = 'Enter only numbers';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0; // Return true if there are no errors
//   };

//   const handleSave = () => {
//     const isFormValid = validateForm();

//     if (isFormValid) {
//       if (Mode === 'edit') {
//         onEditCountry({ ...formData, countryid: country.countryid });
//       }
//       if (Mode === 'add') {
//         onSaveCountry(formData);
//       }
//     }
//   };

//   useEffect(() => {
//     if (Mode === 'edit') {
//       const { countrycode, countryname, phonecode } = country;
//       setFormData((prevData) => ({
//         ...prevData,
//         countryname: countryname || '',
//         countrycode: countrycode || '',
//         phonecode: phonecode || '',
//       }));
//     } else {
//       setFormData(initialFormData);
//     }
//   }, [country, Mode]);

//   return (
//     <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm justify-center align-middle flex'>
//       <div className='mt-10 flex flex-col gap-5 text-white w-96 h-96'>
//         <button onClick={() => onClose()} className='place-self-end'>
//           <X size={30} />
//         </button>
//         <div className='bg-slate-600 flex items-center justify-center p-10 rounded-md'>
//           <form className='flex flex-col w-80 gap-4 '>
//             <h3 className=''>{Mode === 'edit' ? 'Update country' : 'Add country'}</h3>
//             <input
//               className='rounded p-2 text-black'
//               name='countryname'
//               value={formData.countryname}
//               onChange={handleChange}
//               placeholder='Enter country name'
//             />
//             {validationErrors.countryname && (
//               <small className='text-red-500'>{validationErrors.countryname}</small>
//             )}
//             <input
//               className='rounded p-2 text-black'
//               name='countrycode'
//               value={formData.countrycode}
//               onChange={handleChange}
//               placeholder='Enter country ID'
//             />
//             {validationErrors.countrycode && (
//               <small className='text-red-500'>{validationErrors.countrycode}</small>
//             )}
//             <input
//               className='rounded p-2 text-black'
//               name='phonecode'
//               value={formData.phonecode}
//               onChange={handleChange}
//               placeholder='Enter country Phone Code'
//             />
//             {validationErrors.phonecode && (
//               <small className='text-red-500'>{validationErrors.phonecode}</small>
//             )}
//             <div className='flex justify-between'>
//               <button type='button' onClick={handleSave}>
//                 {Mode === 'edit' ? 'Update' : 'Save'}
//               </button>
//               <button type='button' onClick={() => setFormData(initialFormData)}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Modal;

import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
    if (!formData.countryName.match(/^[A-Za-z]{1,10}$/)) {
      newErrors.countryName = 'Country name should contain only alphabets (max 10 characters)';
    }

    // Validate country code
    if (!formData.countryCode.match(/^[A-Za-z]{1,3}$/)) {
      newErrors.countryCode = 'Country code should contain only alphabets (max 3 characters)';
    }

    // Validate phone code
    if (!formData.phoneCode.match(/^\d{1,3}$/)) {
      newErrors.phoneCode = 'Phone code should contain only digits (max 3 digits)';
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

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle className='flex justify-between'>
        {Mode === 'edit' ? 'Update Country' : 'Add Country'}
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Country Name"
          variant="outlined"
          fullWidth
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
          fullWidth
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
          fullWidth
          name="phoneCode"
          margin="normal"
          value={formData.phoneCode}
          onChange={handleChange}
          error={!!errors.phoneCode}
          helperText={errors.phoneCode}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          {selectedCountry ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
