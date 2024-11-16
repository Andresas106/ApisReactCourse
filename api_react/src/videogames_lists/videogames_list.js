import React, { useState, useEffect } from 'react';
import VideogameCard from '../videogame_card/videogame_card';


function Videogames()
{
    const [videogames, setVideogames] = useState([]); //useState por the state

    useEffect(() => {
        fetch('https://api.rawg.io/api/games?key=7ea9457a112040cc9e36b4e1ef3c6d7e')
            .then(response => response.json())
            .then(json => {
                setVideogames(json.results || []);
            });
    }, []); // [] make sure that only one time is executed when the component is charged

    return (
            <div>
                <ul className='videogames-list'>
                {videogames.map((videogame) => (
                    <VideogameCard key={videogame.id} id={videogame.id} name={videogame.name} 
                    background_image={videogame.background_image} rating={videogame.rating} released={videogame.released}/>
                ))}
                </ul>
            </div>
    );
}

export default Videogames;