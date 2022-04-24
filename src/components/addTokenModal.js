import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';
import { Button, FormControl, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function AddTokenModal(props) {
  const classes = useStyles();

  const handleOpen = () => {
    // setOpen(true);
  };

  const handleClose = () => {
    props.setToggleModel(false)
    // setOpen(false);
  };
const inputChangeHandler = (value) =>{
  props.setContractValue(value)
}
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.isOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        
      >
        <Fade in={props.isOpen}>
          <div className="modal-wrap" style={{width: '400px'}}>
          <div className='modal-paper'>
            <div style={{width: '100%'}}>
              <img className="close-ico" src="imgs/xshape.png" alt="" style={{position: 'absolute', filter: 'invert(0.5)'}} onClick={()=> props.setToggleModel(false)}/>
            </div>
            <h2 id="transition-modal-title ml-0">Add Custom Token </h2>
            {/* <TextField placeholder="Enter Token Address"  id="outlined-basic" label="Token" variant="outlined" /> */}

            {/* <Input  id="my-input" aria-describedby="my-helper-text" /> */}
            <FormControl margin={'dense'} focused={true} size={'medium'} fullWidth={true}>
            <TextField onInput={(e) => inputChangeHandler(e.target.value)} placeholder="Enter Token Address"  id="outlined-basic"  variant="outlined" />
            </FormControl> 
          <div style={{textAlign: 'right'}}>
          <Button  variant="contained" onClick={() =>props.addTokenHandler(props.contractValue)}>Add Token</Button>
          </div>
          </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}