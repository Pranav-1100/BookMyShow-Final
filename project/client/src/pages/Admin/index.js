import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Import axios
import { message, Tabs } from 'antd'; // Import message and Tabs from Ant Design
import MovieList from './MovieList';
import TheatresTable from './TheatresTable';

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await axios.get('/api/users/get-current-user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('' + user.data.data);
        if (!user) {
          navigate('/admin');
        }

        if (user.data.data.role === 'partner') {
          navigate('/partner');
          message.error('You are not allowed to access this page');
        } else if (user.data.data.role === 'user') {
          navigate('/');
          message.error('You are not allowed to access this page');
        } else {
          navigate('/admin');
        }
      } catch (error) {
        console.error('Failed to check user', error);
        message.error('Failed to check user');
        navigate('/login'); // Redirect to login on error
      }
    };

    checkUser();
  }, [navigate]); // Add navigate to dependency array

  const tabItems = [
    {
      key: '1',
      label: 'Movies',
      children: <MovieList />,
    },
    {
      key: '2',
      label: 'Theatres',
      children: <TheatresTable />,
    },
  ];

  return (
    <div>
      <h1>Admin Page</h1>
      <Tabs items={tabItems} />
    </div>
  );
}

export default Admin;
