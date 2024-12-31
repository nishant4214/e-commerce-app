// Import React and necessary hooks
import React, { useState } from 'react';
import '../styles/ProfilePage.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const ProfilePage = () => {

  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({ ...user });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src="data:image/png;base64,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"
          alt="Profile"
          className="profile-image"
        />
        {isEditing ? (
          <div className="profile-form">
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={userObj.username}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={userObj.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={userObj.mobile_no}
                onChange={handleChange}
              />
            </label>
            <button onClick={handleEditToggle}>Cancel</button>
          </div>
        ) : (
          <div className="profile-details">
            <h2>{userObj.username}</h2>
            <p>Email: {userObj.email}</p>
            <p>Phone: {userObj.mobile_no}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


