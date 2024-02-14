// /* eslint-disable react/prop-types */
// import React, { useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
// // import { useDispatch } from 'react-redux';
// // import { closeModal } from '../../../redux/stateSlice';

// const StateModal = ({ isOpen, onClose, onSave, onCancel }) => {
//     console.log(isOpen)
//     console.log(onClose)

//     const [stateName, setStateName] = useState('');

//     const handleOptionChange = () => {
//     };

//     const handleStateNameChange = (event) => {
//         setStateName(event.target.value);
//     };

//     const handleSave = () => {
//      onClose()
//     };

//     const handleCancel = () => {
//        onClose()
//     };

//     const handleClose =() => {
//         onClose()
//     }



//     return (
//         <Dialog open={isOpen} onClose={handleClose}>
//             <DialogTitle>Add State</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     select
//                     label="Select Option"
//                     onChange={handleOptionChange}
//                     fullWidth
//                     margin="normal"
//                 >
//                     <MenuItem value="Option 1">Option 1</MenuItem>
//                     <MenuItem value="Option 2">Option 2</MenuItem>
//                     <MenuItem value="Option 3">Option 3</MenuItem>
//                 </TextField>
//                 <TextField
//                     label="State Name"
//                     value={stateName}
//                     onChange={handleStateNameChange}
//                     fullWidth
//                     margin="normal"
//                 />
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={handleCancel} color="primary">
//                     Cancel
//                 </Button>
//                 <Button onClick={handleSave} color="primary">
//                     Save
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default StateModal;
