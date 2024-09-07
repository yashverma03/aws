import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../utils/constants';

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('response data: ', result);
        setData(result);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='p-4 md:p-8 lg:p-12'>
      <div className='text-lg md:text-xl lg:text-2xl font-semibold mb-4'>This is the Home Page</div>
      <Link
        to='/details'
        className='inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
      >
        Go to Details page
      </Link>

      {/* API data */}
      <div className='mt-4'>
        {loading && <p className='text-gray-500'>Loading...</p>}
        {error && <p className='text-red-500'>Error: {error}</p>}
        {data && (
          <div className='mt-4 bg-gray-100 p-4 rounded-lg'>
            <h2 className='text-xl font-bold mb-2'>Data from API:</h2>
            <div className='whitespace-pre-wrap'>{JSON.stringify(data, null, 2)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
