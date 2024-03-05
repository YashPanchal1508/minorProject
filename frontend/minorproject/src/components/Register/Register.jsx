import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = () => {
  const history = useNavigate();
  const [formData, setFormData] = useState({ userName: '', email: '', password: '', retypePassword: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 

    // Perform client-side validation
    if (formData.userName.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return;
    }

    if (formData.password.length < 5) {
      toast.error("Password must be at least 5 characters long");
      return;
    }


    if (formData.password !== formData.retypePassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const response = await fetch('https://backend-pa0u.onrender.com/api/user/CreateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userName: formData.userName, password: formData.password, email: formData.email})
      });
      
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          // Display error message received from the middleware
          toast.error(data.errors[0].msg);
        } else if(data.error){
          toast.error(data.error)
        }else {
          // Default error message for unexpected errors
          toast.error("Error while Register User");
        }
       
        return;
      }

      


      if (response.ok) {
        // Registration successful, redirect to login page
        toast.success(data.message);
        history('/login');
      } 
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userName" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.userName}
                  onChange={handleChange}
                  className="p-2 font-semibold bg-transparent block w-full rounded-md border-[2px] border-slate-900 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="p-2 font-semibold bg-transparent block w-full rounded-md border-[2px] border-slate-900 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900" required>
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="border-[2px] border-slate-900 p-2 bg-transparent block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="retypePassword" className="block text-sm font-medium leading-6 text-gray-900" required>
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="retypePassword"
                  name="retypePassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.retypePassword}
                  onChange={handleChange}
                  className="border-[2px] border-slate-900 p-2 bg-transparent block w-full rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>

            <div className="text-center">
              <span className="text-sm">Already have an account? </span>
              <Link to="/login" className="font-semibold text-black hover:text-white">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
