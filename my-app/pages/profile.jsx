import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line import/no-unresolved, import/no-extraneous-dependencies
// import { faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
function Profile() {
  const router = useRouter();
  const [details, setDetails] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true); // New loading state
  useEffect(() => {
    if (localStorage.getItem('auth-token') === null) {
      router.push('/login');
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://sidhu-coaching-center.onrender.com/api/auth/getUser', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'auth-token': localStorage.getItem('auth-token') },
        });
        const json = await response.json();
        if (json.success === true) {
          setDetails({ name: json.user.name, email: json.user.email });
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false); // Set loading to false after the operation is complete
      }
    };

    fetchData();
  }, []);

  if (loading) {
    // Render the spinner while loading
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '105px' }}>
      <h2 className="text-center" style={{textAlign: 'center'}}>User Profile</h2>
      <hr />
      <section>
        <div className="container py-2">
          <div className="row d-flex justify-content-center align-items-center">
            <div className="card" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <div className="d-flex text-black">
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1 text-center" style={{textAlign: 'center', fontSize:'20px'}}>
                      {/* <FontAwesomeIcon icon={faUser} /> */}
                      {' '}
                      <i className="fa-solid fa-user"></i>  {details.name}
                    </h5>
                    <p className="mb-2 my-2 text-center" style={{ color: '#2b2a2a',textAlign:'center',fontSize:'20px' }}>
                      {/* <FontAwesomeIcon icon={faEnvelope} /> */}
                      {' '}
                      <i className="fa-solid fa-envelope"></i>  {details.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
