import React, { useState } from 'react';
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

export default function DetectMetamaskAlert({ onClose = () => {}, ...props }) {
  const classes = useStyles();
const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false)
        onClose();
        // setTimeout(() => {
        //     setOpen(true)
        // }, 1000);
    };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        
      >
        <Fade in={open}>
          <div style={{width: '400px'}}>
          <div className='modal-paper'>
            {/* <div style={{width: '100%', position: 'relative'}}>
              <img src="imgs/xshape.png" alt="" style={{position: 'absolute', right: '-30px', top: '-15px', cursor: 'pointer', filter: 'invert(0.5)'}} onClick={()=> handleClose()}/>
            </div> */}
            <div className='alert-popup-header'>
            <img height='30'style={{margin: '5px 5px 0px 5px'}} src='imgs/exclamation.png'/>
            </div>
            <h2 id="transition-modal-title" style={{justifyContent: 'center'}}>
                Please install metamask
                and try again. </h2>
            <div style={{width: '100%', textAlign: 'center', paddingTop: '24px'}}>
                <a href='https://metamask.io/download' target='_blank'>

            <Button className='b-alert-close' variant="contained" >install</Button>
                </a>
            </div>
          </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}