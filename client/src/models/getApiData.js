export default class GetApiData {

  async getMovies(params) {
    let url = 'https://yts.lt/api/v2/list_movies.json?', response = '';
    if (params) {
      const lastItem = params[Object.keys(params).length - 1]
      for (const [key, value] of Object.entries(params)) {
        if (value !== lastItem)
          url += key + '=' + value + '&'
        else
          url += key + '=' + value
      }
      try{
        response = await fetch(url, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          method: "GET"
        })
      }catch(e){
        return false;
      }
      return (response.json())
    }
    url = 'https://yts.lt/api/v2/list_movies.json';
    try{
      response = await fetch(url, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: "GET"
      })
    }catch(e){
      return false;
    }
    return (response.json())
  }
}
