import React from 'react';
import { Image, Row, Col, Badge, Button, ProgressBar, Modal } from 'react-bootstrap';
// import { alertWarning } from '../../../../utils/alertUse';

const API_KEY = 'AIzaSyBZVhgsakLaP7bqV9CpC7QCpIS_jpzLtUk';

export default class UserDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',

            show: false,
            setShow: false,
        }
    }

    getMapsPosition = () => {
        const coord = `${this.props.info.latitude},${this.props.info.longitude}`;
        const imgUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${coord}&zoom=13&size=635x350&markers=${coord}&key=${API_KEY}`;
        return (
            <Image src={imgUrl} fluid />
        );
    }

    /*
    ** ------------  Fake report  ------------
    */
    postUserReport = () => {
        console.log(`Report of user "${this.props.info.username}"`);
        // alertWarning(`Signalement de ${this.props.info.username}`)();
        this.handleClose();
    }

    handleClick = (event) => {
        this.props.onClick(event);
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleShow = () => {
        this.setState({ show: true });
    }


    // ************************************************

    render() {
        const { username, first_name: firstName, last_name: lastName, latitude
            , img1, img2, img3, img4, img5, age, gender, orientation, biography
            , lastConnection, pop_score: popScore, tags, commonTags, id, distance
            , locality, liked, likedBy, blocked, blockedBy, online } = this.props.info;

        const STATIC_SERVER_URL = 'http://localhost:5000/';
        const defaultImage = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20171%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16b4118378f%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16b4118378f%22%3E%3Crect%20width%3D%22171%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2259.9296875%22%20y%3D%2294.5%22%3E%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';

        const image1 = (img1 !== null) ? `${STATIC_SERVER_URL}img/${img1}` : defaultImage;
        const image2 = (img2 !== null) ? `${STATIC_SERVER_URL}img/${img2}` : defaultImage;
        const image3 = (img3 !== null) ? `${STATIC_SERVER_URL}img/${img3}` : defaultImage;
        const image4 = (img4 !== null) ? `${STATIC_SERVER_URL}img/${img4}` : defaultImage;
        const image5 = (img5 !== null) ? `${STATIC_SERVER_URL}img/${img5}` : defaultImage;

        const borderOnline = (online) ? 'var(--success)' : 'var(--danger)';
        const opacityBlocked = (blocked || blockedBy) ? '0.5' : '1'; 

        const today = new Date();
        const year = today.getFullYear();
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const day = today.getDate();
        const completeDate = `${day}/${month}/${year}`;
        const displayDate = (lastConnection === completeDate) ? "Aujourd'hui" : lastConnection;

        const likeName = (!liked) ? 'Like' : 'Unlike';
        const likeColor = (!liked) ? 'primary' : 'outline-primary';

        const blockName = (!blocked) ? 'Block' : 'Unblock';
        const blockColor = (!blocked) ? 'danger' : 'outline-danger';

        const colorPopScore =
            (popScore < 4) ? 'danger' :
                (popScore >= 4 && popScore < 5) ? 'warning' : 'success';


        const colorProgress =
            (distance <= 20) ? 'success' :
                (distance > 20 && distance <= 100) ? '' :
                    (distance > 100 && distance <= 200) ? 'warning' : 'danger';
        const distanceMin = (distance === 0) ? '< 1' : distance;

        const genderName = (gender === 0) ? 'Femme, ' : (gender === 1) ? 'Homme, ' : '';
        const orientationName =
            (orientation === 0) ? 'recherche une femme' :
                (orientation === 1) ? 'recherche un homme' :
                    'sans limites (Bi) !';

        const maps = (latitude) ? this.getMapsPosition() : '';

        return (
            <div className="UserDetails mb-5">
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <Image style={{ border: `2px solid ${borderOnline}`, opacity: opacityBlocked }} src={image1} id="img1" className="mr-4" roundedCircle fluid />
                        <div>
                            <h3>{username}, <span className="text-muted font-weight-light">{age}</span></h3>
                            {!online ? (
                                <p className="mb-0">Dernière connexion : <span className="font-italic">{displayDate}</span></p>
                            ) : (
                                    <p className="text-success font-italic mb-0">En ligne</p>
                                )}
                            {likedBy === 1 && (<p className="mb-0">Ce membre vous a liké !</p>)}
                            {blockedBy === 1 && (<p className="mb-0">Ce membre vous a bloqué</p>)}


                            {parseInt(sessionStorage.getItem('id_user')) !== id && !blockedBy &&
                                <div>
                                    {img1 && !blocked &&
                                        <Button
                                            variant={likeColor}
                                            name="like"
                                            onClick={this.handleClick}
                                            className="mt-3 mr-2"
                                        >{likeName}</Button>
                                    }
                                    <Button
                                        variant={blockColor}
                                        name="block"
                                        onClick={this.handleClick}
                                        className="mt-3"
                                    >{blockName}</Button>
                                </div>
                            }
                        </div>
                    </div>
                    <div>
                        <Badge style={{ fontSize: '1.3em' }} variant={colorPopScore} pill>{popScore}</Badge>
                    </div>
                </div>

                <hr />

                {tags.slice(0, 5).map((tag, i) => (
                    <Badge style={{ fontSize: '1em' }} className="mr-2 mb-1" key={i} variant="dark" pill>#{tag}</Badge>
                ))}

                {parseInt(sessionStorage.getItem('id_user')) !== id &&
                    <p className="font-italic mt-2">Vous avez
                        <span className="font-weight-bold"> {commonTags} </span>
                        tags en communs avec
                        <span className="font-weight-bold"> {username}</span>
                    </p>
                }

                <hr />

                <ProgressBar now={distance} max={250} label={`${distanceMin}km`} variant={colorProgress} min={-30} />
                <br />
                <Row>
                    <Col >
                        <h5>
                            <span className="text-capitalize">{firstName} {lastName}</span>,
                            <span className="font-weight-light"> Région de {locality}</span>
                        </h5>
                        <h5 className="text-muted font-weight-light">{genderName} {orientationName}</h5>
                        <br />
                        <p>{biography}</p>
                    </Col>
                    <Col xs={12} md={7}>
                        {maps}
                    </Col>
                </Row>

                <hr />

                <div className="d-flex justify-content-between flex-wrap">
                    <Image xs={6} md={3} src={image2} id="img2" fluid className="mb-5" />
                    <Image xs={6} md={3} src={image3} id="img3" fluid className="mb-5" />
                    <Image xs={6} md={3} src={image4} id="img4" fluid className="mb-5" />
                    <Image xs={6} md={3} src={image5} id="img5" fluid className="mb-5" />
                </div>

                <hr />

                <div>
                    <Button variant="warning" onClick={this.handleShow}>Signaler {username}</Button>

                    <Modal 
                        show={this.state.show} 
                        onHide={this.handleClose}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Signalement d'un utilisateur</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Attention !
                            <br />
                            Vous souhaitez signaler l'utilisateur <strong>{username}</strong> comme étant un faux compte.
                            Ce signalement sera verifié par notre belle équipe d'administration.
                            <br />
                            <br />
                            Êtes-vous certain de vouloir affectuer ce signalement ?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Annuler
                            </Button>
                            <Button variant="warning" onClick={this.postUserReport}>
                                Oui, je signale
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}