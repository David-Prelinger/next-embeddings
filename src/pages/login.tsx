import { FormEvent, useState } from 'react';
import useUser from '../utils/useUser';

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
    <form onSubmit={handleSubmit}>
      <label>
        Enter password
        <input type='password' name='password' required />
        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
      </label>

      <button type='submit'>Login</button>

      {errorMsg && <p>{errorMsg}</p>}
    </form>
  );
}