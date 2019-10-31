const extractParamsUrl = (getString) => {
    let result = {};

    getString = getString.split('&');
    getString.forEach((el) => {
        let param = el.split('=');
        param[0] = param[0].replace('?', '');
        result[param[0]] = param[1];
    });
    return (result);
}

export default extractParamsUrl;