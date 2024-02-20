import { useState,useEffect } from "react";
// import { useNavigate } from 'react-router-dom';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Login = () => {
  // const [userName, setUserName] = useState('');
  // const [password, setPassword] = useState('');
  // const [error, setError] = useState(null);
  // const navigate = useNavigate();
  const history = useNavigate();

  const [credentials, setCredentials] = useState({ userName: '', password: '' });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Redirect to home page if a valid token is found
      history('/home');
    }
  }, [history]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/user/loginUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userName : credentials.userName, password: credentials.password}),
      });

      if(!response.ok){
        const errorMessage = await response.json();
        toast.error(errorMessage)
      } 

      const data = await response.json();

      // console.log(data)

      if (response.ok) {
        // Login successful
        toast.success('User logged in successfully');
        localStorage.setItem('authToken', data.authToken);
        // Redirect to home page after successful login
        history('/home');
      } else {
        // Login failed
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to login. Please try again later.');
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="text"
                  required
                  value={credentials.userName}
                  onChange={handleChange}
                  style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }} 
                  className="p-2 font-semibold bg-transparent block w-full rounded-md border-[2px] border-slate-900 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                  required
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-semibold text-black hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  // style={{ boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }} 
                  className="border-[2px] border-slate-900 p-2 bg-transparent block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              >
                Log in
              </button>
            </div>
              <div className="text-center">
              <span className="text-sm"> Don't have an account? </span>
              <Link to="/" className="font-semibold text-black hover:text-white">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
