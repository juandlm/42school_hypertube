export default class GetApiData{

  async getMovies(params){
    var url = 'https://yts.lt/api/v2/list_movies.json?';
    if (params){
      const lastItem = params[Object.keys(params).length - 1]
      for (const [key, value] of Object.entries(params)) {
          if (value !== lastItem)
            url += key+'='+value+'&'
          else
            url += key+'='+value
      }
      const response = await fetch(url, {
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        //mode: "cors",
        method: "GET"
      })
      return (response.json())
    }
    url = 'https://yts.lt/api/v2/list_movies.json';
    const response = await fetch(url, {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      method: "GET"
    })
    return (response.json())
  }
}
