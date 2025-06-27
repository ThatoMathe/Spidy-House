import { Link } from 'react-router-dom';
import Header from './components/header';



export default function NotFound() {


  return (
    <>
          <div className="Custheader">
            <Header title="404" />
          </div>

          <div className="Custbody">
          
    <div className="text-center p-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Page Not Found</p>
      <Link to="../../dashboard" className="btn btn-primary">Go Dashboard</Link>
    </div>

          
          </div>
    </>
  );
};