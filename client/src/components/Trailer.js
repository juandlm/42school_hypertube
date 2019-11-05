import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton, Typography, Chip, Fab } from  '@material-ui/core/';
import CloseIcon from '@material-ui/icons/Close';
import VideocamIcon from '@material-ui/icons/Videocam';
import Rating from '@material-ui/lab/Rating';

export default function Trailer(props) {
    const url = props.film.yt_trailer_code ? `https://www.youtube.com/embed/${props.film.yt_trailer_code}?modestbranding=1&autoplay=1&playsinline=0&controls=2&origin=http%3A%2F%2Flocalhost:3000` : '';
    
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
                  <div className="embedresize">
                    <div>
                      <iframe 
                        title="ytplayer"
                        id="ytplayer"
                        src={url || ''}
                        frameBorder="0"
                        allowFullScreen
                        width="560"
                        height="315">
                      </iframe>
                    </div>
                  </div>
                  <DialogTitle>Synopsis</DialogTitle>
                  <DialogContentText>
                    {props.film.summary || ''}
                  </DialogContentText>
                  <DialogTitle>
                    Note : 
                    <Chip
                      label={props.film.rating || ''}
                      color="default"
                      style={{marginLeft:'1em'}}
                    />
                  </DialogTitle>
                  <DialogContentText>
                    <Rating value={props.film.rating || ''} max={10} precision={0.1} size="large" readOnly />
                  </DialogContentText>
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
