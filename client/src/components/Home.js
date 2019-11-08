import React from 'react';
import axios from 'axios'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import InfoIcon from '@material-ui/icons/Info';
import { IconButton, GridList, GridListTile, GridListTileBar } from '@material-ui/core/';
import { getUserSettings } from '../actions/settings';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import GetApiData from '../models/getApiData'
import ListFilter from './Dropdown';
import PrimarySearchAppBar from './PrimarySearchAppBar';
import LoaderScroll from './LoaderScroll';
import Loader from './Loader';
import Trailer from './Trailer'

const ReactLanguage = require('react-language');

class Home extends React.Component {

  controller = new AbortController();

  constructor(props) {
    super(props)
    this.handleScroll = this.handleScroll.bind(this);
    this.api = new GetApiData()
    this.mouseFilmId = []
    this.state = {
      films: '',
      isLoading: false,
      isBottom: false,
      page: 1,
      filter: null,
      query: '',
      needPage: true,
      isSeen: [],
      openTrailer: false,
      selectedFilm: ''
    }
    this.isFiltered = false
  }

  componentDidMount() {
    this.getFilms(1)
    this.getIsSeen(this.props.auth.user._id, this.props.auth.user.name)
    window.addEventListener("scroll", this.handleScroll, false);
    this.getUserSettings();
  }

  componentWillUnmount() {
    // cancel async requests
    this.controller.abort();
    window.removeEventListener("scroll", this.handleScroll, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.settings.data.lang) {
      ReactLanguage.setLanguage(nextProps.settings.data.lang);
      sessionStorage.setItem('lang', nextProps.settings.data.lang);
    } else {
      ReactLanguage.setLanguage('en');
      sessionStorage.setItem('lang', 'en');
    }
  }

  getUserSettings = () => {
    const userId = this.props.auth.user._id;
    this.props.getUserSettings(userId);
  }

  filterData(filter) {
    this.getFilms(1, filter)
  }

  async getFilms(page, filter, reset = null) {
    let results = ''

    if (filter) {
      if (!this.isFiltered) {
        this.setState({ page: 1, filter: filter })
        this.isFiltered = true
      } else
        this.setState({ filter: filter })
      if (this.state.query)
        results = await this.api.getMovies({ page: page, limit: 40, query_term: this.state.query, ...filter })
      if (results && !results.data.movies)
        this.setState({ films: [], isLoading: true })
      if (!results)
        results = await this.api.getMovies({ page: page, limit: 40, ...filter })
    } else {
      if (this.state.query && this.state.query !== '' && !reset)
        results = await this.api.getMovies({ page: page, limit: 40, sort_by: 'title', query_term: this.state.query })
      if (results && !results.data.movies && this.state.page > 1) {
        this.setState({ isLoading: true })
        return;
      }
      if (results && !results.data.movies)
        this.setState({ films: [], isLoading: true })
      if (!results)
        results = await this.api.getMovies({ page: page, limit: 40, sort_by: 'download_count' })
    }
    if (!results.data.movies)
      return;
    if (page > 1) {
      this.setState(prevState => ({
        films: [...prevState.films, ...results.data.movies],
        isLoading: true
      }))
    }
    else
      this.setState({ films: results.data.movies, isLoading: true })
  }

  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight && this.state.isLoading === true) {
      if (!this.state.needPage)
        return;
      const page = this.state.page
      this.setState(prevState => ({
        isLoading: false,
        isBottom: true,
        page: prevState.page + 1
      }));
      this.getFilms(page + 1, this.state.filter)
    } else {
      /*this.setState({
          isBottom: false
      });*/
    }
  }

  storeFilm(title, torrent, id, summary, imdbCode, serieInfo) {
    const hash = torrent && torrent.hash ? torrent.hash : torrent
    const size = torrent && torrent.size_bytes ? torrent.size_bytes : torrent
    let url = `/films?${title}=${title}&id=${id}&hash=${hash}&imdbCode=${imdbCode}&size=${size}&title=${title}`
    if (serieInfo.season && serieInfo.episode)
      url += `&season=${serieInfo.season}&episode=${serieInfo.episode}`
    return (
      url
    )
  }

  getBestTorrent(torrents) {
    if (!torrents)
      return (false);
    let tmpSeeds = 0
    let tmpPeers = 0
    let targetIndex = 0
    // NB: si besoin, charger 720p de preference = ameliore le temps de chargement du player.
    torrents.forEach((value, index) => {
      if (value.quality !== "3D" && value.seeds > tmpSeeds && value.peers > tmpPeers) {
        targetIndex = index
        tmpSeeds = value.seeds
        tmpPeers = value.peers
      }
    })
    return torrents[targetIndex];
  }

  // --> fetch tout les films vu par le pelo
  async getIsSeen(id, username) {
    try {
      const result = await fetch("/api/film/getSeen",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({ imdbCode: '', id: id, username: username })
        })
      const data = await result.json()
      if (data) {
        this.setState({ isSeen: data })
      }
    } catch (e) {

    }
  }

  isSeen(imdbCode, hash) {
    if (this.state.isSeen.length === 0 || !this.state.isSeen || this.state.isSeen.length === 0 || !hash)
      return;
    const cmpHash = typeof hash === 'object' ? hash.hash : hash
    for (let i = 0; i < this.state.isSeen.length; i++) {
      if (!this.state || !this.state.isSeen || !this.state.isSeen[i] || !this.state.isSeen[i].hash)
        continue;
      if (this.state.isSeen[i].hash.toLowerCase() === cmpHash.toLowerCase() && this.state.isSeen[i].imdbCode === imdbCode) {
        return (true)
      }
    }
    return (false)
  }

  updateFilms(results, query, type) {
    if (results && results.data && results.data.movie_count > 0) {
      results.data.movies = results.data.movies.filter(film => {
        const best = this.getBestTorrent(film.torrents)
        return best.seeds > 12 && best.peers > 7
      })
    }
    if (!query || !results) {
      this.setState({ query: query, page: 1 })
      this.getFilms(1, false, true)
      return;
    }
    if (results.data && results.data.movie_count > 0) {
      this.setState({ needPage: true })
      this.setState({ films: results.data.movies, query: query, page: 1 })
    }
    else if (results && !results.data) {
      this.setState({ needPage: false })
      this.setState({ films: results || [], query: query, page: 1 })
    }
    else {
      this.setState({ films: [], query: query, page: 1 })
      this.setState({ needPage: false })
    }
  }

  refreshComponent(param = null) {
    if (param === null)
      return;
    this.setState({ films: '', isLoading: false, isBottom: false, page: 1, filter: null, query: '', needPage: true, isSeen: [] })
    this.isFiltered = false
    this.getFilms(1, false, true)
    this.getIsSeen(this.props.auth.user._id, this.props.auth.user.name)
  }

  // si on a pas de trailer ...
  handleMouseClick(film) {
    if (this.setState.openTrailer === true)
      return;
    // ---> film <---
    film["url"] = this.storeFilm(film.filename || film.title, this.getBestTorrent(film.torrents) || film, film.id, film.summary || '',
      film.imdb_code || film.imdb_id || film.imdbCode, { season: film.season || '', episode: film.episode || '' })
    this.setState({ openTrailer: true, selectedFilm: film })
  }

  closeTrailer() {
    this.setState({ openTrailer: false })
  }

  getGridListCols = () => {
    if (isWidthUp('xl', this.props.width))
      return 9;
    if (isWidthUp('lg', this.props.width))
      return 6;
    if (isWidthUp('md', this.props.width))
      return 4;
    if (isWidthUp('sm', this.props.width))
      return 3;
    return 2;
  }

  getGridListTitleRow = () => {
    if (isWidthUp('xl', this.props.width))
      return 2.5;
    if (isWidthUp('lg', this.props.width))
      return 2.2;
    if (isWidthUp('md', this.props.width))
      return 2.2;
    if (isWidthUp('sm', this.props.width))
      return 2.3;
    return 1.5;
  }

  // ------> set l'url, la note, le summary dans trailer
  // qd on est over => afficher, si on passe sur un autre close le current et affiche un autre
  render() {
    const { films, isLoading } = this.state

    if (!films) return Loader(isLoading);

    return (
      <div>
        <PrimarySearchAppBar
          searchBar={true}
          refresh={this.refreshComponent.bind(this)}
          updateFilms={this.updateFilms.bind(this)}
        />
        <Trailer
          isOpen={this.state.openTrailer}
          closeTrailer={this.closeTrailer.bind(this)}
          film={this.state.selectedFilm}
        />
        <ListFilter filterData={this.filterData.bind(this)}></ListFilter>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden'
          }}>

          <GridList
            spacing={5}
            cellHeight={180}
            cols={this.getGridListCols()}
            style={{flex: 1}}
          >
            {this.state.films.map((film, index) => (
              <GridListTile
                key={index}
                cols={1}
                rows={this.getGridListTitleRow()}
                style={
                  this.isSeen(film.imdb_code || film.imdb_id || film.imdbCode, film.hash || this.getBestTorrent(film.torrents)) ?
                    { cursor: 'pointer', backdropFilter: 'drop-shadow(16px 16px 20px red) invert(75%)' } : { cursor: 'pointer', backdropFilter: '' }}
                onClick={this.handleMouseClick.bind(this, film)}>

                <img src={film.medium_cover_image || film.small_screenshot || film.posterLink} onError={() => false} alt={film.title}
                  style={this.isSeen(film.imdb_code || film.imdb_id || film.imdbCode, film.hash || this.getBestTorrent(film.torrents)) ? { filter: 'grayscale(100%)' } : { filter: '' }} />
                <GridListTileBar
                  title={film.title}
                  subtitle={<span>{film.summary}</span>}
                  actionIcon={
                    <IconButton aria-label={`info about ${film.title}`} style={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
              
            ))}
          </GridList>
        </div>
        {LoaderScroll(isLoading)}
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  settings: state.settings
})

export default connect(mapStateToProps, { getUserSettings })(withRouter(withWidth()(Home)));
