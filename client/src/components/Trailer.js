import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import VideocamIcon from '@material-ui/icons/Videocam';
import { IconButton, Typography } from '@material-ui/core';
import ReactPlayer from 'react-player';

export default function Trailer(props) {
    // NB : on aime le calcul yolo du responsif !
    const websiteName = 'HYPERTUBE';
    let dx, factor, ratio = 0;
    dx = document.body.offsetWidth / 200
    ratio = document.body.offsetWidth / document.body.offsetHeight
    factor = 0.5 + (0.17 * dx * ratio)
    const scale = (ratio) / factor

    const url = props.film.yt_trailer_code ? 'https://www.youtube.com/embed/'+props.film.yt_trailer_code+'?modestbranding=1&autoplay=1&playsinline=0&controls=2&origin=http%3A%2F%2Flocalhost:3000' : ''
    console.log(props)
    return (
        <React.Fragment>
            <Dialog
                open={props.isOpen}
                maxWidth="lg"
                scroll="body"
                aria-labelledby="scroll-dialog-title"
                onClose={props.closeTrailer}
            >
                <DialogTitle disableTypography id="scroll-dialog-title" className="legalsClose">
                    <Typography component="h2" variant="h5">{props.film.title || 'No title'} ({props.film.year})</Typography>
                    <IconButton onClick={props.closeTrailer} color="primary">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                {
                  props.film && props.film.genres.map((value, index) => (
                      <Chip
                        label={value}
                        color="primary"
                        key={index}
                        style={{marginLeft:'1.3em', marginBottom:'0.8em'}}
                      />
                  ))
                }
                <DialogContent dividers style={{width:'100%', height:'100%'}}>
                  <iframe id="ytplayer" type="text/html" src={url || ''}
                    frameBorder="0"
                    allowFullScreen
                    width={Math.floor(document.body.offsetWidth * (scale * (document.body.offsetWidth < 600 ? 0.8 : 1)))}
                    height={Math.floor(document.body.offsetHeight * (scale * (document.body.offsetWidth < 600 ? 0.8 : 1.1)))}>
                  </iframe>
                  <DialogTitle>Synopsis</DialogTitle>
                  <DialogContentText>
                    {props.film.summary || ''}
                  </DialogContentText>
                  <DialogTitle>Note : {props.film.rating || ''}</DialogTitle>
                  <DialogContentText style={{textAlign:'center'}}>
                    <Fab
                      variant="extended"
                      size="medium"
                      color="primary"
                      aria-label="add"
                      href={props.film.url}
                    >
                      <VideocamIcon style={{marginRight:'0.4em'}}/>
                        Voir le film
                   </Fab>
                  </DialogContentText>
                </DialogContent>

            </Dialog>
        </React.Fragment>
    );
}
