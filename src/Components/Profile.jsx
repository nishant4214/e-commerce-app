// Import React and necessary hooks
import React, { useState } from 'react';
import '../styles/ProfilePage.css'
const ProfilePage = () => {

  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  console.log(userObj)
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

//   const handleSave = () => {
//     setUser({ ...formData });
//     setIsEditing(false);
//   };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src="https://via.placeholder.com/150"
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
            {/* <label>
              Bio:
              <textarea
                name="bio"
                value={userObj.bio}
                onChange={handleChange}
              />
            </label> */}
            {/* <button onClick={handleSave}>Save</button> */}
            <button onClick={handleEditToggle}>Cancel</button>
          </div>
        ) : (
          <div className="profile-details">
            <h2>{userObj.username}</h2>
            <p>Email: {userObj.email}</p>
            <p>Phone: {userObj.mobile_no}</p>
            {/* <button onClick={handleEditToggle}>Edit Profile</button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


