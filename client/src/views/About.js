import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const About = () => {
	return (
		<Row className="mt-5" style={{ marginRight: 0 }}>
			<Col className="text-center">
				<Button
					variant="primary"
					href="https://nhutuan99.github.io/personal-website/"
					size="lg"
				>
					Visit my worlddd
				</Button>
			</Col>
		</Row>
	);
};

export default About;
