import React from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios'
// IS LOGGED ?

export default class Search extends React.Component{

  constructor(props){
    super(props)
    this.state = {searchValue:'', results:''}
    this.handleChange = this.handleChange.bind(this)
    this.classes = this.props.classes
  }

  // 1 - afficher la search bar que pour l'accueil + quand on est log.
  // => modal pour le film + comment... close = accueil
  // 2 - historique des films vues...
  async setQueryResults(query){
    // ----> pirate bay si on trouve pas... <---
    if (!query){
      this.props.updateFilms(false, query)
      return ;
    }
    const response = await fetch(
      'https://yts.lt/api/v2/list_movies.json?query_term='+query+'&sort_by=title&limit=50&page=1&order_by=asc',
    {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: "GET"
      })
    const results = await response.json()
    //console.log(results)
    if (results.data.movie_count === 0){
      try {
        const dataSearch = await fetch('/api/film/search', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': axios.defaults.headers.common['Authorization']
          },
          method: "POST",
          body: JSON.stringify({name:query})
        })
        // ----> data sort by names !

        if (dataSearch.status === 200){
          const datares = await dataSearch.json()
          console.log('DATA RES: ')
          console.log(datares)
          //console.log(datares)
          // type === serie
          this.props.updateFilms(datares, query, 'serie')
        }
      }catch(e){
        console.log(e)
      }
      //const datares = await dataSearch.json()
    }else
      this.props.updateFilms(results, query)
  }

  handleChange(event){
    this.setState({searchValue:event.target.value})
    console.log('query '+event.target.value)
    this.setQueryResults(event.target.value)
  }

  render(){
    if (!this.props.displaySearch)
      return ( <div style={{display:'none'}}></div>);

    return (
      <div className={this.classes.search}>
        <div className={this.classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          classes={{
            root: this.classes.inputRoot,
            input: this.classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={this.handleChange}
          value={this.searchValue}
        />
      </div>
    )
  }
}
