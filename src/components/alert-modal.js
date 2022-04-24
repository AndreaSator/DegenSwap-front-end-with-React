import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button } from '@material-ui/core';

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

export default function AlertModal(props) {
  const classes = useStyles();

  const handleOpen = () => {
    // setOpen(true);
  };

  const handleClose = () => {
    props.toggleAlert(false)
    // setOpen(false);
  };

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
          <div style={{width: '400px'}}>
          <div className='modal-paper'>
            {/* <div style={{width: '100%', position: 'relative'}}>
              <img src="imgs/xshape.png" alt="" style={{position: 'absolute', right: '-30px', top: '-15px', cursor: 'pointer', filter: 'invert(0.5)'}} onClick={()=> handleClose()}/>
            </div> */}
            <div className='alert-popup-header'></div>
            <h2 id="transition-modal-title">
                Please open metamask
                 and {props.alertText}. </h2>
            <div style={{width: '100%', textAlign: 'center', paddingTop: '24px'}}>
            <Button className='b-alert-close' variant="contained" onClick={()=> handleClose()}>Close</Button>
            </div>
          </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}