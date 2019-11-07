import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Container, CircularProgress, Grid, Link, Typography, CardContent, Card, Button, TextField } from '@material-ui/core/';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import circularStyle from '../css/circular';
import registerStyle from '../css/register';
import { movieViewTranslate } from '../translate';
import '../css/global.css';

const circular = circularStyle;
const classes = registerStyle;
const ReactLanguage = require('react-language');
ReactLanguage.setLanguage('xxx');

class VideoView extends React.Component {

  controller = new AbortController();

  constructor(props) {
    super(props)
    this.state = {
      src: '',
      isLoaded: false,
      playing: false,
      controls: false,
      subtitleEn: '',
      subtitleFr: '',
      comValue: '',
      comments: [],
      imdb: 0,
      settings: '',
      lang: '',
      data: '',
      query: '',
      isSubSet: false
    }
    this.downloadSpeed = 0
    this.duration = 0
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.settings) {
      this.setState({
        lang: nextProps.settings.data.lang,
        settings: nextProps.settings.data
      });
    }
  }

  setDuration(duration) {
    this.duration = duration
  }

  createQuery(params) {
    const esc = encodeURIComponent;
    return Object.keys(params)
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
  }

  handleChange = (e) => {
    const value = e.target.value
    this.setState({ comValue: value })
  }

  // --->
  getFilm() {
    let searchParams = new URLSearchParams(this.props.location.search || this.props.location);
    const hash = searchParams.get('hash')
    const size = searchParams.get('size')
    const title = searchParams.get('title')
    const id = searchParams.get('id')
    let season = searchParams.get('season')
    let episode = searchParams.get('episode')
    const imdbCode = searchParams.get('imdbCode')
    if (season === 0 || episode === 0) {
      const regex = /S\w+E\w+/g;
      const match = title.match(regex);
      const parts = match[0].split('E')
      episode = parseInt(parts[1])
      season = parseInt(parts[0].replace('S', ''))
    }
    const url = 'http://localhost:3000/api/film/films?' + this.createQuery({ hash: hash, size: size, title: title, id: id, imdbCode: imdbCode, episode: episode, season: season })
    const query = {
      size: size,
      title: title,
      serie: season && episode ? { season: season, episode: episode } : '',
      hash: hash,
      imdbCode: imdbCode
    }
    this.setState({ src: url, isLoaded: true, imdb: imdbCode, query: query })
    this.getComments(imdbCode)
    this.addIsSeen(this.props.auth.user._id, this.props.auth.user.username, imdbCode)
  }

  // --->
  loadPlayer = (player) => {
    if (this.downloadSpeed === 0 && player.loadedSeconds > 0) {
      this.downloadSpeed = this.duration / player.loadedSeconds
      let diff = this.duration - this.downloadSpeed
      if (diff < 0) {
        let waitingTime = -diff
        setTimeout(() => this.setState({ playing: true, controls: true }, waitingTime))
      } else {
        this.setState({ playing: true, controls: true })
      }
    }
  }

  componentDidMount() {
    this.getFilm()
    this.setState({ lang: this.props.settings.data.lang || '' })
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  addIsSeen(id, username, imdbCode) {
    try {
      fetch("/api/film/addSeen",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({ imdbCode: imdbCode, id: id, username: username })
        })
    } catch (e) {
      return false
    }
  }

  async getIsSeen(id, username, imdbCode) {
    try {
      const result = await fetch("/api/film/getSeen",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({ imdbCode: imdbCode, id: id, username: username })
        })
      await result.json()
    } catch (e) {
      return false
    }
  }

  addSubtitleToPlayer(frSub, enSub, prefLang) {
    if (this.state.isSubSet)
      return;
    function createTrack(src, label, lang) {
      let track = document.createElement("track");
      track.kind = "captions";
      track.label = label;
      track.srclang = lang;
      track.src = src;
      return (track)
    }
    const video = document.querySelector("video")
    let firstTrack, secondTrack = ''
    if (prefLang === 'en' || prefLang === '') {
      firstTrack = createTrack(enSub, "English", "en", prefLang)
      firstTrack.default = 'true'
      secondTrack = createTrack(frSub, "French", "fr", prefLang)
    }
    if (prefLang === 'fr') {
      firstTrack = createTrack(frSub, "French", "fr", prefLang)
      firstTrack.default = 'true'
      secondTrack = createTrack(enSub, "English", "en", prefLang)
    }
    firstTrack.addEventListener("load", function () {
      this.mode = "showing";
      video.textTracks[0].mode = "showing";
    });
    video.appendChild(firstTrack);
    video.appendChild(secondTrack);
    secondTrack.addEventListener("load", function () {
      this.mode = "showing";
      video.textTracks[1].mode = "showing";
    });
  }

  async findSubtitle(imdbCode, title, serie, hash, size) {
    try {
      const result = await fetch("/api/film/subtitles",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({
            imdbCode: imdbCode, title: title,
            serie: serie ? { season: serie.season, episode: serie.episode } : '', hash: hash, size: size
          })
        })
      const content = await result.json();
      if (content && Array.isArray(content.path)) {
        let en, fr, frPath, enPath = ''
        if (content[0] && content[0].lang) {
          en = content.path[0].path.split('/')
          enPath = '/getSub/' + en[en.length - 3] + '/' + en[en.length - 2] + '/' + en[en.length - 1]
        }
        if (content[1] && content[1].lang) {
          fr = content.path[1].path.split('/')
          frPath = '/getSub/' + fr[fr.length - 3] + '/' + fr[fr.length - 2] + '/' + fr[fr.length - 1]
        }
        this.addSubtitleToPlayer(frPath || '', enPath || '', this.state.lang)
        this.setState({ isSubSet: true })
        this.setState({ subtitleEn: encodeURI(enPath), subtitleFr: encodeURI(frPath), isLoaded: true })
      } else if (Array.isArray(content)) {
        let en, fr, frPath, enPath = ''
        if (content[0] && content[0].lang) {
          en = content[0].lang === 'English' ? content[0].path.split('/') : content[1].path.split('/')
          enPath = '/getSub/' + en[en.length - 3] + '/' + en[en.length - 2] + '/' + en[en.length - 1]
        }
        if (content[1] && content[1].lang) {
          fr = content[1].lang === 'French' ? content[1].path.split('/') : content[0].path.split('/')
          frPath = '/getSub/' + fr[fr.length - 3] + '/' + fr[fr.length - 2] + '/' + fr[fr.length - 1]
        }
        this.addSubtitleToPlayer(frPath || '', enPath || '', this.state.lang)
        this.setState({ isSubSet: true })
        this.setState({ subtitleEn: encodeURI(enPath), subtitleFr: encodeURI(frPath), isLoaded: true })
      }
    } catch (e) {
      this.setState({ subtitleEn: true, subtitleFr: true, isLoaded: true })
    }
  }

  async addComment(imdbCode, name) {
    if (this.state.comments.length > 0)
      this.setState({ comments: [...this.state.comments, { imdbCode: this.imdb, username: this.props.auth.user.username, value: this.state.comValue }] })
    else
      this.setState({ comments: [{ imdbCode: this.imdb, username: this.props.auth.user.username, value: this.state.comValue }] })
    try {
      await fetch("/api/film/addComments",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({ imdbCode: this.state.imdb, name: this.props.auth.user.username, value: this.state.comValue })
        })
      this.setState({ comValue: '' })
    } catch (e) {
      return false
    }
  }

  async getComments(imdbCode) {
    try {
      const result = await fetch("/api/film/getComments",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({ imdbCode: imdbCode })
        })
      if (result.status === 200) {
        const content = await result.json();
        this.setState({ comments: content })
      }
    } catch (e) {
      return false
    }
  }

  setLang() {
    if (this.state.lang === 'en' || this.state.lang === '') {
      return (
        {
          file: {
            tracks: [
              { kind: 'subtitles', src: this.state.subtitleEn, srcLang: 'en', default: true },
              { kind: 'subtitles', src: this.state.subtitleFr, srcLang: 'fr' }
            ]
          }
        }
      )
    }
    if (this.state.lang === 'fr') {
      return (
        {
          file: {
            tracks: [
              { kind: 'subtitles', src: this.state.subtitleFr, srcLang: 'fr', default: true },
              { kind: 'subtitles', src: this.state.subtitleEn, srcLang: 'en' }
            ]
          }
        }
      )
    }
  }

  saveComment = () => {
    if (this.state.comValue !== '') {
      this.addComment()
    }
  }
  render() {
    // ??
    if (!this.state.isLoaded || !this.state.src) {
      return (
        <div>
          <PrimarySearchAppBar searchBar={false} />
          <Grid
            container
            spacing={0}
            direction="column"
            justify="center"
            alignItems="center"
            style={{ marginBottom: '2%' }}

          >
            <Grid item xs={3}>
              <CircularProgress className={circular.progress} />
            </Grid>
          </Grid>
        </div>
      )
    }
    const query = this.state.query

    return (
      <div className="VideoView">
        <PrimarySearchAppBar searchBar={false} />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={0}
          style={{ marginBottom: '2%' }}
        >
          <ReactPlayer
            controls={true}
            url={this.state.src}
            width='100%'
            height='100%'
            onError={() => false}
            onProgress={this.loadPlayer}
            onDuration={this.setDuration.bind(this)}
            onReady={() => this.findSubtitle(query.imdbCode, query.title,
              query.serie.season && query.serie.episode ? { season: query.season, episode: query.episode } : '', query.hash, query.size)}
          />
        </Grid>
        <Container maxWidth="md">
          <Typography style={{ marginBottom: '1%' }}>
            {movieViewTranslate('comments')}
          </Typography>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {this.state.comments.map((comment, index) => (
              <Card style={{
                width: '100%',
                marginBottom: '0.5em',
              }} key={index}>
                <CardContent>
                  <Typography>
                    <Link href={'/user/' + comment.username} target="_blank" variant="subtitle2" style={{ color: 'rgba(145,145,145,1)' }}>
                      {comment.username}
                    </Link>
                  </Typography>
                  <Typography variant="body2" component="p" style={{ marginLeft: '1em', marginTop: '1em' }}>
                    {comment.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
            <hr />
            <TextField
              placeholder={sessionStorage.lang === 'fr' ? "Ajoutez un commentaire" : "Add a comment"}
              multiline={true}
              rows={4}
              rowsMax={4}
              onChange={this.handleChange}
              value={this.state.comValue}
              style={{ width: '100%' }}
              variant="filled"
              required
            />
          </Grid>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            style={{ marginTop: '2%', marginBottom: '10%' }}
          >
            <Button
              type="button"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.saveComment}
              fullWidth
            >
              {movieViewTranslate('post')}
              </Button>
          </Grid>
        </Container>
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
