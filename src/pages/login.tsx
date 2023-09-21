import { FormEvent, useState } from 'react';
import useUser from '../utils/useUser';
import Layout from '@/app/layout';



export default function Login() {
  // here we just check if user is already logged in and redirect to admin
  const { mutateUser } = useUser({
    redirectTo: '/chat/chat',
    redirectIfFound: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  /// Happens when submit button is pressed
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = {
      password: e.currentTarget.password.value,
    };
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    
    if (res.status !== 200) { 
      setErrorMsg('Wrong password. Please try again.');
      return;
    }
    const user = await res.json();
    try {
      await mutateUser(user);
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  }

  return (
    <Layout>
    <div className="min-h-screen flex items-center justify-center animated-background bg-neutral-300">
  
      <form className="bg-white p-8 rounded-xl shadow-md" onSubmit={handleSubmit}>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Enter password
          </label>
          <input 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            type='password' 
            id="password"
            name='password' 
            required 
          />
          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
        </div>
  
        <div className="mt-6">
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type='submit'
          >
            Login
          </button>
        </div>
  
      </form>
      
    </div>
  </Layout>
  
  );
}