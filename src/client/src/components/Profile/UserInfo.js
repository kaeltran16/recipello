import React from 'react';
import { Link } from 'react-router-dom';


const UserInfo = ({ session }) => {
   return (
     <div className='App'>
        <h3>UserInfo</h3>
        <p>Username: {session.getCurrentUser.username}</p>
        <p>Email: {session.getCurrentUser.email}</p>
        <ul>
           <h3>{session.getCurrentUser.username}'s Favorites</h3>
           {session.getCurrentUser.favorites.map(fav =>
             <li key={fav.id}>
                <Link to={`/recipe/${fav.id}`}>{fav.name}</Link>
             </li>
           )}
           {!session.getCurrentUser.favorites.length &&
           <p><strong>You have no favorite recipe. Go add some!</strong></p>
           }
        </ul>
     </div>
   );
};

export default UserInfo;
