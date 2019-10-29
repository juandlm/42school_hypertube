import React from 'react';
import GetApiData from '../models/getApiData'
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import CircularProgress from '@material-ui/core/CircularProgress';
import PrimarySearchAppBar from './navBar';
import { Link } from 'react-router-dom'
import circularStyle from '../css/circular';
import ListFilter from './dropdown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios'

const circular = circularStyle;

class Home extends React.Component {

  controller = new AbortController();

  constructor(props){
    super(props)
    this.handleScroll = this.handleScroll.bind(this);
    this.api = new GetApiData()
    this.state = {films:'', isLoading:false,
    isBottom:false, page:1, filter:null, query:'', needPage:true, isSeen:[]}
    this.isFiltered = false
  }

  filterData(filter){
    this.getFilms(1, filter)
  }

  async getFilms(page, filter, reset = null){
    let results = ''

    if (filter){
      if (!this.isFiltered){
        this.setState({page:1, filter:filter})
        this.isFiltered = true
      }else {
        this.setState({filter:filter})
      }
      if (this.state.query)
        results = await this.api.getMovies({page:page, limit:40, query_term:this.state.query, ...filter})
      if (results && !results.data.movies)
          this.setState({films:[], isLoading:true})
      if (!results)
        results = await this.api.getMovies({page:page, limit:40, ...filter})
    }else {
      // qd on paginate et que pas de results => do nothing !
      if (this.state.query && this.state.query !== '' && !reset)
        results = await this.api.getMovies({page:page, limit:40, sort_by:'title', query_term:this.state.query})
      if (results && !results.data.movies && this.state.page > 1){
        this.setState({isLoading:true})
        return ;
      }
      if (results && !results.data.movies)
        this.setState({films:[], isLoading:true})
      if (!results)
        results = await this.api.getMovies({page:page, limit:40, sort_by:'download_count'})
    }
    console.log(results.data.movies)
    if (!results.data.movies)
      return ;
    console.log(results.data.movies)
    if (page > 1){
        this.setState(prevState => ({
          films: [...prevState.films, ...results.data.movies],
          isLoading:true
        }))
    }
    else
      this.setState({films:results.data.movies, isLoading:true})
  }

  handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight && this.state.isLoading === true) {
          if (!this.state.needPage)
            return ;
          //console.log('relog')
          const page = this.state.page
          this.setState(prevState => ({
                isLoading:false,
                isBottom:true,
                page: prevState.page + 1
          }));
          this.getFilms(page + 1, this.state.filter)
        } else {
            /*this.setState({
                isBottom: false
            });*/
        }
    }

    displayLoading(isLoading){
      if (!isLoading){
        return (
          <div style={{height: '100%',  backgroundColor: 'rgba(29,29,29,1)'}} >
          <Container>
          <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          >
              <CircularProgress className={circular.progress} />
          </Grid>
          </Container>
          </div>
        )
      }
    }

    storeFilm(title, torrent, id, summary, imdbCode, serieInfo){
      const hash = torrent && torrent.hash ? torrent.hash : torrent
      const size = torrent && torrent.size_bytes ? torrent.size_bytes : torrent
      let url = `/films?${title}=${title}&id=${id}&hash=${hash}&imdbCode=${imdbCode}&size=${size}&title=${title}`
      if (serieInfo.season && serieInfo.episode)
        url+= `&season=${serieInfo.season}&episode=${serieInfo.episode}`
      //console.log(url)
      return (
        url
      )
    }

    getBestTorrent(torrents){
      if (!torrents)
        return (false);
      let tmpSeeds = 0
      let tmpPeers = 0
      let targetIndex = 0
      torrents.forEach((value, index) => {
        if (value.quality !== "3D" && value.seeds > tmpSeeds && value.peers > tmpPeers){
          targetIndex = index
          tmpSeeds = value.seeds
          tmpPeers = value.peers
        }
      })
      return torrents[targetIndex];
    }

    // --> fetch tout les films vu par le pelo
    async getIsSeen(id, username){
      try {
        //console.log(axios.defaults.headers.common)
        const result = await fetch("/api/film/getSeen",
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({imdbCode:'', id:id, username:username})
        })
        const data = await result.json()
        console.log(data)
        if (data){
          this.setState({isSeen:data})
          console.log(data)
        }
      }catch(e){

      }
    }

    isSeen(imdbCode, hash){

      if (this.state.isSeen.length === 0)
        return ;
      const cmpHash = typeof hash === 'object' ? hash.hash : hash
      for (let i = 0; i < this.state.isSeen.length; i++){
        if (!this.state || !this.state.isSeen || !this.state.isSeen[i] || !this.state.isSeen[i].hash)
          continue;
        if (this.state.isSeen[i].hash.toLowerCase() === cmpHash.toLowerCase() && this.state.isSeen[i].imdbCode === imdbCode){
            return (true)
        }
      }
      return (false)
    }

    componentDidMount() {
        this.getFilms(1)
        this.getIsSeen(this.props.auth.user._id, this.props.auth.user.name)
        window.addEventListener("scroll", this.handleScroll, false);
    }

    componentWillUnmount() {
        this.controller.abort();
        window.removeEventListener("scroll", this.handleScroll, false);
    }


    updateFilms(results, query, type){
      //console.log(results)
      if (!query || !results){
        this.setState({query:query, page:1})
        this.getFilms(1, false, true)
        return ;
      }
      if (results.data && results.data.movie_count > 0){
        this.setState({needPage:true})
        this.setState({films:results.data.movies, query:query, page:1})
      }
      else if (results && !results.data){
        this.setState({needPage:false})
        this.setState({films:results || [], query:query, page:1})
      }
      else{
        this.setState({films:[], query:query, page:1})
        this.setState({needPage:false})
      }
    }

    refreshComponent(param = null){
      if (param === null)
        return ;
      //console.log('refresh compo')
      this.setState({films:'', isLoading:false, isBottom:false, page:1, filter:null, query:'', needPage:true, isSeen:[]})
      this.isFiltered = false
      this.getFilms(1)
      this.getIsSeen(this.props.auth.user._id, this.props.auth.user.name)
    }

  render(){
    const {films, isLoading} = this.state

    if (!films){
      return this.displayLoading(isLoading);
    }
    return (
      <div>
      <PrimarySearchAppBar searchBar={true} refresh={this.refreshComponent.bind(this)} updateFilms={this.updateFilms.bind(this)}/>
      <ListFilter filterData={this.filterData.bind(this)}></ListFilter>
      <GridList spacing={8} cols={5} style={{ display:'flex', justifyContent: 'flex-start', alignItems:'center', flexDirection:'row', backgroundColor: 'rgba(29,29,29,1)'}}>
        {this.state.films.map((film, index) => (
          <GridListTile key={index} cols={-1} rows={2}
          style={
          this.isSeen(film.imdb_code || film.imdb_id || film.imdbCode, film.hash || this.getBestTorrent(film.torrents)) ?
          {cursor:'pointer', backdropFilter: 'drop-shadow(16px 16px 20px red) invert(75%)'} : {cursor:'pointer', backdropFilter: ''}}
          component={Link} to={this.storeFilm(film.filename || film.title, this.getBestTorrent(film.torrents) || film, film.id, film.summary || '',
          film.imdb_code || film.imdb_id || film.imdbCode, {season:film.season || '', episode:film.episode || ''})}>
            <img src={film.medium_cover_image || film.small_screenshot || film.posterLink} onError={() => console.log('img error')} alt={film.title}
            style={
            this.isSeen(film.imdb_code || film.imdb_id || film.imdbCode, film.hash || this.getBestTorrent(film.torrents)) ?
            {filter: 'grayscale(100%)'} : {filter:''}}/>
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
        {this.displayLoading(isLoading)}
      </GridList>
      </div>
    );
  }
}

Home.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, {})(withRouter(Home));
