import React from 'react';
import UserInfo from './UserInfo';
import withSession from '../withSession';
import UserRecipes from './UserRecipes';
import withAuth from '../../withAuth';

const Profile = ({ session }) => (
  <div>
     <UserInfo session={session}/>
     <UserRecipes username={session.getCurrentUser.username}/>
  </div>
);

export default withAuth(session => session && session.getCurrentUser)(withSession(Profile));
