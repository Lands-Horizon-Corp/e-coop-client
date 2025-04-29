// import { useMatch, useNavigate } from '@tanstack/react-location';

// const ImageDetail = ({ images1w }) => {
//   const match = useMatch(); // Try logging the output here
//   console.log('match:', match); // Debugging: Check if match contains `params.id`

//   const { id } = match?.params || {}; // Safe destructuring to avoid errors
//   const navigate = useNavigate();
//   console.log('id', id); // Debugging: Check if match contains `params.id`

//   // Optional: Find the image by id if needed
//   const image = images.find((img) => img.id === id);

//   if (!image) {
//     return <div>Image not found</div>;
//   }

//   return (
//     <div>
//       <h2>{image.title}</h2>
//       <img src={image.src} alt={image.title} />
//       <button onClick={() => navigate({ to: '/' })}>Back to Gallery</button>
//     </div>
//   );
// };

// export default ImageDetail;
