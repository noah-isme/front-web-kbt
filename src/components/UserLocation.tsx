import React from 'react';

interface UserLocationProps {
    userId: number;
    latitude: number;
    longitude: number;
}

const UserLocation: React.FC<UserLocationProps> = ({ userId, latitude, longitude }) => {
    return (
        <div>
            <h4>User {userId}</h4>
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
        </div>
    );
};

export default UserLocation;
