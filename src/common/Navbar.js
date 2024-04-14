import React, { useState, useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, [auth]);

  const onLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/sign-in");
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a href="/" className="btn btn-ghost text-xl">
            My Birthday Tracker
          </a>
        </div>
        <div className="flex-none gap-2">
          {user && (
            <button onClick={onLogOut} className="btn btn-primary">
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;