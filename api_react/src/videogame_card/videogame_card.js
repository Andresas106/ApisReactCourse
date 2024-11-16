import React from "react";

const VideogameCard = ({id, name, background_image, rating, released}) => {
    return(
        <div key={id} className="videogame-card">
            <img src={background_image} alt={name} />
            <h3>{name}</h3>
            <p>Rating: {rating}</p>
            <p>Released: {released}</p>  
        </div>
    );
};

export default VideogameCard;