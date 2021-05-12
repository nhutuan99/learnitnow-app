import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const Auth = ({ authRoute }) => {
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext);

	let body;

	if (authLoading)
		body = (
			<div className="d-flex justify-content-center mt-2">
				<Spinner animation="border" variant="info" />
			</div>
		);
	else if (isAuthenticated) return <Redirect to="/dashboard" />;
	else
		body = (
			<>
				{authRoute === 'login' && <LoginForm />}
				{authRoute === 'register' && <RegisterForm />}
			</>
		);

	return (
		<div className="landing">
			<div className="dark-overlay">
				<div className="landing-inner">
					<h1>Learn It Now</h1>
					<h5>If You Dont Know What You Want</h5>
					<h5>Let's Learn Something New</h5>
					{body}
				</div>
			</div>
		</div>
	);
};

export default Auth;
