import React, { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './LandingPage.scss';

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      // ✅ Redirect only if the user is logged in and on "/"
      if (data.user && location.pathname === '/') {
        navigate('/transactions', { replace: true });
      }
    };

    checkUser();
  }, [navigate, location.pathname]); // ✅ Include location.pathname to prevent unwanted redirects

  return (
    <div className="landing-page">
      <Container>
        <div className="intro">
          <Typography variant="h3" className="title" gutterBottom>
            Welcome to Budget Tracker
          </Typography>
          <Typography variant="h6" className="description" paragraph>
            Manage your finances efficiently and track your spending. Let us
            help you stay on top of your budget.
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default LandingPage;
