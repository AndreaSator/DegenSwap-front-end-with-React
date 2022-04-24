
import loader from '../asstes/imgs/loader.gif';
// Can be a string as well. Need to ensure each key-value pair ends with ;


const MyLoader = (props) => {
  return (
      <>
          {props.loading &&
              <div className='custom-loader'>
                  <img src={loader} className='loader-image' />
              </div>
          }
      </>
      
  );
}

export default MyLoader;