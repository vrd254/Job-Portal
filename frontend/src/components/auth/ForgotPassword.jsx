import axios from 'axios';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:8000/api/v1/user/forgot-password', // ✅ Full URL
        { email },
        { withCredentials: true } // ✅ Important if using cookies or CORS
      );

      toast.success(res.data.message || 'Reset link sent!');
    } catch (err) {
      console.error("Forgot Password Error:", err);
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto my-10 border p-6 rounded">
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Enter your email"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
