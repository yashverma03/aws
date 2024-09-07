import { Link } from 'react-router-dom';

const Details = () => {
  return (
    <div className='p-4 md:p-8 lg:p-12'>
      <div className='text-lg md:text-xl lg:text-2xl font-semibold mb-4'>
        This is the Details Page
      </div>
      <Link
        to='/'
        className='inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
      >
        Go to Home page
      </Link>
    </div>
  );
};

export default Details;
