import React, { useState, useEffect } from 'react';
import Axios from "axios";

//React leaflet
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline, Polygon } from 'react-leaflet';
import { Icon } from "leaflet";

//MUI
import { Grid, AppBar, Typography, Button, Card, CardHeader, CardMedia, CardContent, CircularProgress } from "@mui/material";

//icons
import houseIconPng from './Assets/Mapicons/house.png';
import apartmentIconPng from './Assets/Mapicons/apartment.png';
import officeIconPng from './Assets/Mapicons/office.png';

//Asserts
import img1 from './Assets/img1.jpg';
import myListings from './Assets/Data/Dummydata';
import polygonOne from "./Shape";


function Listings() {

    // fetch("http://localhost:8000/api/listings/").then(response => response.json()).then(data => console.log(data))

    const houseIcon = new Icon({
        iconUrl: houseIconPng,
        iconSize: [40, 40],
    })
    const apartmentIcon = new Icon({
        iconUrl: apartmentIconPng,
        iconSize: [40, 40],
    })
    const officeIcon = new Icon({
        iconUrl: officeIconPng,
        iconSize: [40, 40],
    })

    const [latitude, setLatitude] = useState(51.48766915713159);
    const [longitude, setLongitude] = useState(-0.1271328529793388);

    function GoEast() {
        setLatitude(51.46493339070058);
        setLongitude(0.2589354991269491);
    }

    function GoCenter() {
        setLatitude(51.48766915713159);
        setLongitude(-0.1271328529793388);
    }

    const polyOne = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.12],
    ]

    const [allListings, setAllListings] = useState([])
    const [dataIsLoading, setDataIsLoading] = useState(true)

    useEffect(() => {
        const source = Axios.CancelToken.source(); // To prevent information leakage on a slow internet.
        async function GetAllListings() {
            try {
                const response = await Axios.get("http://localhost:8000/api/listings/", { cancelToken: source.token });
                // console.log(response.data);
                setAllListings(response.data);
                setDataIsLoading(false)
            } catch (error) {
                console.log(console.log(error.response));
            }
        }
        GetAllListings();
        return () => {
            source.cancel();
        }
    }, [])

    if (!dataIsLoading) {
        console.log(allListings[0].location);
    }

    if (dataIsLoading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
                <CircularProgress />
            </Grid>
        )
    }

    return (

        <Grid container>
            <Grid item xs={4}>
                {allListings.map((listing) => {
                    return (
                        <Card key={listing.id} style={{ margin: "0.5rem", border: '1px solid black', position: 'relative' }}>
                            <CardHeader
                                // action={
                                //     <IconButton aria-label="settings">
                                //         <MoreVertIcon />
                                //     </IconButton>
                                // }
                                title={listing.title}
                            />
                            <CardMedia
                                component="img"
                                image={listing.picture1}
                                alt={listing.title}
                                style={{ paddingRight: "1rem", paddingLeft: "1rem", height: "20rem", width: "32rem" }}
                            />
                            <CardContent>
                                <Typography variant="body2">
                                    {listing.description.substring(0, 200)}...
                                </Typography>
                            </CardContent>

                            {listing.property_status === "Sale" ?
                                (<Typography
                                    style={{ position: 'absolute', backgroundColor: "green", zIndex: "1000", color: "white", top: "100px", left: "20px", padding: "5px" }}>
                                    {listing.listing_type}:
                                    ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Typography>) :
                                (<Typography
                                    style={{ position: 'absolute', backgroundColor: "green", zIndex: "1000", color: "white", top: "100px", left: "20px", padding: "5px" }}>
                                    {listing.listing_type}:
                                    ${listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "} / {listing.rental_frequency}
                                </Typography>)}

                            {/* <CardActions disableSpacing>
                        <IconButton aria-label="add to favori§tes">
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton aria-label="share">
                            <ShareIcon />
                        </IconButton>

                    </CardActions> */}
                        </Card>
                    )
                })}

            </Grid>
            <Grid item xs={8} style={{ marginTop: '0.5rem' }}>
                <AppBar position="sticky">
                    <div style={{ height: "100vh" }}>
                        <MapContainer center={[51.505, -0.09]} zoom={14} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {allListings.map((listing) => {
                                function IconDisplay() {
                                    if (listing.listing_type === 'House') return houseIcon;
                                    else if (listing.listing_type === 'Apartment') return apartmentIcon;
                                    else if (listing.listing_type === 'Office') return officeIcon;
                                }
                                return (
                                    <Marker key={listing.id}
                                        icon={IconDisplay()}
                                        position={[
                                            listing.latitude,
                                            listing.longitude]}>
                                        <Popup>
                                            <Typography variant="h5"> {listing.title}</Typography>
                                            <img src={listing.picture1} style={{ height: '14rem', width: '18rem' }}></img>
                                            <Typography variant="body1"> {listing.description.substring(0, 150)}...</Typography>
                                            <Button variant="contained" fullWidth>Details</Button>
                                        </Popup>
                                    </Marker>
                                )
                            })}
                            {/* <Marker icon={officeIcon} position={[latitude, longitude]}>
                                <Popup>
                                    <Typography variant="h5"> A title</Typography>
                                    <img src={img1} style={{ height: '14rem', width: '18rem' }}></img>
                                    <Typography variant="body1"> This is some text</Typography>
                                    <Button variant="contained" fullWidth> A link</Button>
                                </Popup>
                            </Marker> */}
                        </MapContainer>
                    </div >
                </AppBar>

            </Grid>
        </Grid>
    );
}

export default Listings