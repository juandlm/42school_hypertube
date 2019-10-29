import React from 'react';
//import DropStyle from '../css/dropdown'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import PrettoSlider from '../css/slider'

//const classes = DropStyle

export default class ListFilter extends React.Component {

  constructor(props){
    super(props)
    this.state = {openFilter:false, openSort:false, sort_by:'', genre:'', minimum_rating:0}
  }

  handleChange(type, event) {
    this.setState({[type] : event.target.value})
    this.props.filterData({...this.state, [type] : event.target.value})
  }

  handleClose(type) {
    this.setState({[type] : false})
  }

  handleOpen(type) {
    this.setState({[type] : true})
  }

  handleSliderChange(e, newValue){
    this.setState({minimum_rating:newValue})
  }

  handleCommit(e, newValue){
    console.log(newValue)
    this.props.filterData({...this.state})
  }

  // filtrer par genre + minimun_rating (0 a 9)
  // asc par defaut
  // trier par year,title,rating
  render(){
      return (
      <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-around', margin:'2% 0 1%'}}>
      <div style={{width:300}}>
        <Typography gutterBottom>
            Note IMDB
        </Typography>
        <PrettoSlider valueLabelDisplay="auto" aria-label="pretto slider" defaultValue={0} onChange={this.handleSliderChange.bind(this)} onChangeCommitted={this.handleCommit.bind(this)} max={9} step={1}/>
      </div>
            <FormControl style={{ minWidth:150}}>
              <InputLabel htmlFor="demo-controlled-open-select">Genre</InputLabel>
              <Select
                open={this.state.openFilter}
                onClose={this.handleClose.bind(this, 'openFilter')}
                onOpen={this.handleOpen.bind(this, 'openFilter')}
                value={this.state.genre}
                onChange={this.handleChange.bind(this, 'genre')}
                inputProps={{
                  name: 'Filter',
                  id: 'demo-controlled-open-select',
                }}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                <MenuItem value={'action'}>Action</MenuItem>
                <MenuItem value={'adventure'}>Aventure</MenuItem>
                <MenuItem value={'animation'}>Animation</MenuItem>
                <MenuItem value={'crime'}>Crime</MenuItem>
                <MenuItem value={'documentary'}>Documentaire</MenuItem>
                <MenuItem value={'drama'}>Drame</MenuItem>
                <MenuItem value={'history'}>Histoire</MenuItem>
                <MenuItem value={'horror'}>Epouvante</MenuItem>
                <MenuItem value={'superhero'}>SuperHero</MenuItem>
                <MenuItem value={'thriller'}>Thriller</MenuItem>
                <MenuItem value={'war'}>Guerre</MenuItem>
                <MenuItem value={'western'}>Western</MenuItem>
              </Select>
            </FormControl>
            <FormControl style={{ minWidth:170}}>
              <InputLabel htmlFor="demo-controlled-open-select">Trier</InputLabel>
              <Select
                open={this.state.openSort}
                onClose={this.handleClose.bind(this, 'openSort')}
                onOpen={this.handleOpen.bind(this, 'openSort')}
                value={this.state.sort_by}
                onChange={this.handleChange.bind(this, 'sort_by')}
                inputProps={{
                  name: 'Trier',
                  id: 'demo-controlled-open-select',
                }}
              >
                <MenuItem value="">
                  <em>Aucun</em>
                </MenuItem>
                <MenuItem value={'year'}>Date de sortie</MenuItem>
                <MenuItem value={'title'}>Titre</MenuItem>
                <MenuItem value={'rating'}>Note</MenuItem>
              </Select>
            </FormControl>
          </div>
      )
  }
}
