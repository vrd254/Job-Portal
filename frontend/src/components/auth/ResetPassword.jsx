import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import Navbar from '../shared/Navbar';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams(); // ✅ get token from URL
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      toast.success(res.data.message || 'Password reset successful!');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-md mx-auto my-10 border p-6 rounded">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter new password"
            className="mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Reset Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
