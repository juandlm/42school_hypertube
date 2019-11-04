import React from 'react';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import PrimarySearchAppBar from './navBar';
import circularStyle from '../css/circular';
import ReactPlayer from 'react-player';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import registerStyle from '../css/register';
import '../css/global.css'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios'


const circular = circularStyle;
const classes = registerStyle;

class VideoView extends React.Component {

  constructor(props){
    super(props)
    console.log(props)
    this.state = {
      src:'',
      isLoaded:false,
      playing:false,
      controls:false,
      subtitleEn:'',
      subtitleFr:'',
      comValue:'',
      comments:[],
      imdb:0,
      settings: '',
      lang:'',
      data:'',
      query:'',
      isSubSet:false
    }
    this.downloadSpeed = 0
    this.duration = 0
    console.log(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
      //console.log(nextProps)
      if (nextProps.settings){
        console.log(nextProps.settings)
        this.setState({
            lang:nextProps.settings.data.langue,
            settings: nextProps.settings.data
        });
      }
  }

  setDuration(duration){
    //console.log(duration)
    this.duration = duration
  }

  createQuery(params){
    const esc = encodeURIComponent;
    return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&');
  }

  handleChange(e){
    const value = e.target.value
    this.setState({comValue:value})
    console.log('comm value'+ value)
  }

 // --->
  getFilm(){
    let searchParams = new URLSearchParams(this.props.location.search || this.props.location);
    const hash = searchParams.get('hash')
    const size = searchParams.get('size')
    const title = searchParams.get('title')
    const id = searchParams.get('id')
    let season = searchParams.get('season')
    let episode = searchParams.get('episode')
    const imdbCode = searchParams.get('imdbCode')
    if (season === 0 || episode === 0){
      const regex = /S\w+E\w+/g;
      const match = title.match(regex);
      const parts = match[0].split('E')
      episode = parseInt(parts[1])
      season = parseInt(parts[0].replace('S', ''))
    }
    const url = 'http://localhost:3000/api/film/films?'+this.createQuery({hash:hash, size:size, title:title, id:id, imdbCode:imdbCode, episode:episode, season:season})
    const query = {
      size:size,
      title:title,
      serie: season && episode ? {season: season, episode: episode} : '',
      hash:hash,
      imdbCode:imdbCode
    }
    this.setState({src:url, isLoaded:true, imdb:imdbCode, query:query})
    //this.setState({})

    this.getComments(imdbCode)
    this.addIsSeen(this.props.auth.user._id, this.props.auth.user.username, imdbCode)
  }

 // --->
  loadPlayer(player){
    if (this.downloadSpeed === 0 && player.loadedSeconds > 0){
      this.downloadSpeed = this.duration / player.loadedSeconds
      let diff = this.duration - this.downloadSpeed
      if (diff < 0) {
        let waitingTime = -diff
        console.log('Need to wait time before loading video :'+waitingTime)
        setTimeout(() => this.setState({playing:true, controls:true}, waitingTime))
      }else {
        this.setState({playing:true, controls:true})
      }
    }
  }

  componentDidMount(){
    this.getFilm()
    this.setState({lang:this.props.settings.data.langue || ''})
  }

  addIsSeen(id, username, imdbCode){
    try {
      fetch("/api/film/addSeen",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        method: "POST",
        body: JSON.stringify({imdbCode:imdbCode, id:id, username:username})
      })
    }catch(e){

    }
  }

  //
  async getIsSeen(id, username, imdbCode){
    try {
      const result = await fetch("/api/film/getSeen",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        method: "POST",
        body: JSON.stringify({imdbCode:imdbCode, id:id, username:username})
      })
      const data = await result.json()
      // si imdbCode == imdbCode && hash == hash => oui
      console.log(data)
    }catch(e){

    }
  }

  addSubtitleToPlayer(frSub, enSub, prefLang){
    if (this.state.isSubSet)
      return ;
    function createTrack(src, label, lang) {
      let track = document.createElement("track");
      track.kind = "captions";
      track.label = label;
      track.srclang = lang;
      track.src = src;
      return (track)
    }
    const video = document.querySelector("video")
    //console.log(prefLang)
    let firstTrack, secondTrack = ''
    if (prefLang === 'en' || prefLang === ''){
      firstTrack = createTrack(enSub, "English", "en", prefLang)
      firstTrack.default = 'true'
      secondTrack = createTrack(frSub, "French", "fr", prefLang)
    }
    if (prefLang === 'fr'){
      firstTrack = createTrack(frSub, "French", "fr", prefLang)
      firstTrack.default = 'true'
      secondTrack = createTrack(enSub, "English", "en", prefLang)
    }
    firstTrack.addEventListener("load", function() {
      this.mode = "showing";
      video.textTracks[0].mode = "showing"; // thanks Firefox mdr
    });
    video.appendChild(firstTrack);
    video.appendChild(secondTrack);
    secondTrack.addEventListener("load", function() {
      this.mode = "showing";
      video.textTracks[1].mode = "showing"; // thanks Firefox mdr
    });
  }

  async findSubtitle(imdbCode, title, serie, hash, size){
    try {
      const result = await fetch("/api/film/subtitles",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        method: "POST",
        body: JSON.stringify({imdbCode:imdbCode, title:title,
          serie: serie ? {season: serie.season, episode: serie.episode} : '', hash:hash, size:size})
      })
      const content = await result.json();
      //console.log(content)
      console.log(content)
      if (content && Array.isArray(content.path)){
        const en = content.path[0].path.split('/')
        const fr = content.path[1].path.split('/')
        const frPath = '/getSub/'+fr[fr.length - 3]+'/'+fr[fr.length - 2]+'/'+fr[fr.length - 1]
        const enPath = '/getSub/'+en[en.length - 3]+'/'+en[en.length - 2]+'/'+en[en.length - 1]
        console.log(frPath)
        this.addSubtitleToPlayer(frPath, enPath, this.state.lang)
        this.setState({isSubSet:true})
        this.setState({subtitleEn:encodeURI(enPath), subtitleFr:encodeURI(frPath), isLoaded:true})
      }else if(Array.isArray(content)){
        const en = content[0].lang === 'English' ? content[0].path.split('/') : content[1].path.split('/')
        const fr = content[1].lang === 'French' ? content[1].path.split('/') : content[0].path.split('/')
        const frPath = '/getSub/'+fr[fr.length - 3]+'/'+fr[fr.length - 2]+'/'+fr[fr.length - 1]
        const enPath = '/getSub/'+en[en.length - 3]+'/'+en[en.length - 2]+'/'+en[en.length - 1]
        console.log(frPath)
        this.addSubtitleToPlayer(frPath, enPath, this.state.lang)
        this.setState({isSubSet:true})
        this.setState({subtitleEn:encodeURI(enPath), subtitleFr:encodeURI(frPath), isLoaded:true})
      }
    } catch (e){
      //console.log(e)
      this.setState({subtitleEn:true, subtitleFr:true, isLoaded:true})
    }
  }

  //async

  async addComment(imdbCode, name){
    if (this.state.comments.length > 0)
      this.setState({comments: [...this.state.comments, {imdbCode:this.imdb, username:this.props.auth.user.username, value:this.state.comValue}]})
    else
      this.setState({comments:[{imdbCode:this.imdb, username:this.props.auth.user.username, value:this.state.comValue}]})
    try {
      console.log(this.props.auth.user.username)
      const res = await fetch("/api/film/addComments",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        method: "POST",
        body: JSON.stringify({imdbCode:this.state.imdb, name:this.props.auth.user.username, value:this.state.comValue})
      })
      this.setState({comValue:''})
      console.log(res.status)
    }catch (e){
      console.log('error db insert comments :'+e)
    }
  }

  async getComments(imdbCode){
    try {
      const result = await fetch("/api/film/getComments",
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        method: "POST",
        body:JSON.stringify({imdbCode:imdbCode})
      })
      //console.log(result.status)
      //const content = await result.json();
      //console.log(result);
      //console.log(content);
      if (result.status === 200){
        
        const content = await result.json();
        console.log(content)
        //console.log(content)
        this.setState({comments:content})
      }else{
        // no comment
      }
    }catch (e){
      //console.log('error comments: '+ e)
    }
  }

  setLang(){
    if (this.state.lang === 'en' || this.state.lang === ''){
      console.log(this.state.subtitleFr)
      return (
        { file: {
          tracks: [
            {kind: 'subtitles', src: this.state.subtitleEn, srcLang: 'en', default: true},
            {kind: 'subtitles', src: this.state.subtitleFr, srcLang: 'fr'}
          ]
            }
        }
      )
    }
    if (this.state.lang === 'fr'){
      return (
        { file: {
          tracks: [
            {kind: 'subtitles', src: this.state.subtitleFr, srcLang: 'fr', default:true},
            {kind: 'subtitles', src: this.state.subtitleEn, srcLang: 'en'}
          ]
            }
        }
      )
    }
  }

  saveComment(){
    // add comment to commnents array
    if (this.state.comValue !== ''){
      this.addComment()
      console.log('save commnet to DB '+this.state.comValue)
    }
      //console.log('save commnet to DB '+this.state.comValue)
  }
  // S02E04
  render(){
    if (!this.state.isLoaded || !this.state.src){
      return (
        <div>
        <PrimarySearchAppBar searchBar={false} />
        <div style={{minHeight: '100%', backgroundColor: 'rgba(29,29,29,1)'}}>
          <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: '100vh' }}
          >
            <Grid item xs={3}>
              <CircularProgress className={circular.progress} />
            </Grid>
          </Grid>
        </div>
        </div>
      )
    }
    // const lang = this.state.lang
    const query = this.state.query
    return(
      <div>
        <PrimarySearchAppBar searchBar={false} />
      <div style={{minHeight: '100%', backgroundColor: 'rgba(29,29,29,1)', paddingTop:'3.25%'}} >
        <div style={{position: 'relative', paddingTop:'40.25%'}}>
        <ReactPlayer
          style={{position: 'absolute', top: '0', left:'10%'}}
          controls={true}
          url={this.state.src}
          width='80%'
          height='80%'
          onError={(err) => console.log(err)}
          onProgress={this.loadPlayer.bind(this)}
          onBuffer={() => console.log('load buffer')}
          onDuration={this.setDuration.bind(this)}
          onReady={() => this.findSubtitle(query.imdbCode, query.title,
            query.serie.season && query.serie.episode ? {season: query.season, episode: query.episode} : '', query.hash, query.size)}
            />
            </div>
            <Container
              >
              <Grid container
                direction="column"
                justify="center"
                alignItems="center">
                {this.state.comments.map((comment, index) => (
                  <Card style={{width:'80%', margin: '0.5em', backgroundColor:'#171717', color:'white'}} key={index}>
                      <CardContent>
                      <Typography>
                        <Link href={'/user/'+comment.username} target="_blank" variant="subtitle2" style={{color:'rgba(145,145,145,1)'}}>
                          {comment.username}
                        </Link>
                      </Typography>
                      <Typography variant="body2" component="p" style={{marginLeft:'1em', marginTop:'1em'}}>
                          {comment.value}
                        </Typography>
                     </CardContent>
                  </Card>
                ))}
                <textarea
                style={{height: '100px', overflow:'hidden', width:'80%', backgroundColor:'#171717',
               border:'6px solid #556677', outlineColor: 'transparent', color:'white', marginTop:'1em'}} name="body"
                onChange={this.handleChange.bind(this)}
                value={this.state.comValue}
                placeholder='Ajoutez un commentaire'
                required
                />
              </Grid>
              <Grid container direction="row"
              justify="center"
              alignItems="center" style={{marginTop:'2%'}}>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.saveComment.bind(this)}
                >
                  Poster
                </Button>
              </Grid>
            </Container>
      </div>
      </div>
      )
  }
}

VideoView.propTypes = {
    auth: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    settings: state.settings
})

export default connect(mapStateToProps, {})(withRouter(VideoView));
