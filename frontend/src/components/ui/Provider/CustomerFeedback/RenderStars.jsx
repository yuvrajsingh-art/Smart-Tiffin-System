import { FaStar, FaRegStar } from 'react-icons/fa';

  const RenderStars = ({rating}) =>
  Array.from({ length: 5 }, (_, index) =>
    index < rating ? <FaStar key={index} className="text-yellow-400" /> : <FaRegStar key={index} className="text-gray-300" />
  );

  export default RenderStars