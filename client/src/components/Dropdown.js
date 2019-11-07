import React from 'react';
import { InputLabel, MenuItem, Typography, FormControl, Select, Grid, Box, Button, Hidden } from '@material-ui/core/';
import PrettoSlider from '../css/slider';

export default class ListFilter extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openFilter: false,
      openSort: false,
      sort_by: '',
      genre: '',
      minimum_rating: 0,
      displaySmall: false
    }
  }

  handleChange(type, e) {
    this.setState({ [type]: e.target.value })
    this.props.filterData({ ...this.state, [type]: e.target.value })
  }

  handleClose(type) {
    this.setState({ [type]: false })
  }

  handleOpen(type) {
    this.setState({ [type]: true })
  }

  handleSliderChange = (e, newValue) => {
    this.setState({ minimum_rating: newValue })
  }

  handleCommit = () => {
    this.props.filterData({ ...this.state })
  }

  displaySmallMenu = () => {
    if (this.state.displaySmall)
      this.setState({ displaySmall: false })
    else
      this.setState({ displaySmall: true })
  }

  renderMobileMenu = () => {
    return (
      <React.Fragment>
        <Box mt={0} mb={0} mx={5} width="100%">
          <Typography gutterBottom>
            Note IMDB
          </Typography>
          <PrettoSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={0}
            onChange={this.handleSliderChange}
            onChangeCommitted={this.handleCommit}
            max={9}
            step={1}
          />
        </Box>
        <Box my={1} mx={5} width="100%">
          <FormControl style={{ minWidth: '100%' }}>
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
        </Box>
        <Box mt={1} mb={5} mx={5} width="100%">
          <FormControl style={{ minWidth: '100%' }}>
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
        </Box>
      </React.Fragment>
    )
  }

  renderDesktopMenu = () => {
    return (
      <React.Fragment>
        <Box my={7} mx={6} width={300}>
          <Typography gutterBottom>
            Note IMDB
          </Typography>
          <PrettoSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            defaultValue={0}
            onChange={this.handleSliderChange}
            onChangeCommitted={this.handleCommit}
            max={9}
            step={1}
          />
        </Box>
        <Box pb={2.5} mx={4} width={230}>
          <FormControl style={{ minWidth: '100%' }}>
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
        </Box>
        <Box pb={2.5} my={2} mx={2} width={230}>
          <FormControl style={{ minWidth: '100%' }}>
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
        </Box>
      </React.Fragment>
    )
  }

  // Filtre par genre / note minimum (de 0 à 9)
  // Tri asc par défaut
  // Tri par année, titre, note
  render() {
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
      >

        <Hidden mdUp>
          <Box m={4}>
            <Button variant="contained" onClick={this.displaySmallMenu}>
              Filters & sorts
          </Button>
          </Box>
        </Hidden>

        {!this.state.displaySmall ? (
          <Hidden smDown>
            {this.renderDesktopMenu()}
          </Hidden>
        ) : (
            this.renderMobileMenu()
          )}

      </Grid>
    )
  }
}
