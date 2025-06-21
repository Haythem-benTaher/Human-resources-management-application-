import React from "react";
import { Container, Row, Col, Button} from "reactstrap";
import backgroundImage from '../../assets/img/brand/bureau-de-recrutement.webp';
import recruiterImage from '../../assets/img/brand/cabinet-recrutement-dsi.jpg';


const styles = {
  heroContainer: {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
   
  },
  heroSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "opacity 1s ease-in-out",
    
  },
  textContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '20px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '5px',
    zIndex: 10,
    color:'#212529',
  },
  shapeContainer: {
    position: 'relative',
    color:'#212529',
  },
  separator: {
    marginTop: '50px',
  
  }
};

const keyframes = `
@keyframes slideAnimation {
  0% { opacity: 0; }
  10% { opacity: 1; }
  30% { opacity: 1; }
  40% { opacity: 0; }
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-20px); }
}
`;

const Hero = () => {
  return (
    <div style={styles.heroContainer}>
      <style>{`
        ${keyframes}
        .fadeIn-1 { animation: fadeIn 10s infinite; animation-delay: 0s; }
        .fadeIn-2 { animation: fadeIn 10s infinite; animation-delay: 2s; }
        .fadeIn-3 { animation: fadeIn 10s infinite; animation-delay: 4s; }
        .fadeIn-4 { animation: fadeIn 10s infinite; animation-delay: 6s; }
        .fadeIn-5 { animation: fadeIn 10s infinite; animation-delay: 8s; }
      `}</style>
      <div
        style={{
          ...styles.heroSlide,
          backgroundImage: `url(${backgroundImage})`,
          animation: "slideAnimation 10s infinite",
        }}
      >
        {/* Slide 1 Content */}
      </div>
      <div
        // style={{
        //   ...styles.heroSlide,
        //   backgroundImage: `url(${recruiterImage})`,
        //   animation: "slideAnimation 10s infinite",
        //   animationDelay: "5s",
        // }}
      >
        <div style={styles.textContainer} className="text-overlay">
          <div className="fadeIn-1"><h1 className="text-lightblue">You Are a Candidate</h1></div>
          <div className="fadeIn-2"><h2 className="text-lightgreen">We Are Looking For</h2></div>
          <div className="fadeIn-3"><h3 className="text-lightcoral">Efficiency</h3></div>
          <div className="fadeIn-4"><h3 className="text-lightgoldenrodyellow">Reliability</h3></div>
          <div className="fadeIn-5"><h3 className="text-lightpink">Integrity</h3></div>
        </div>
      </div>
      <div style={{ ...styles.shapeContainer, color: '#212529' }} className="shape-container d-flex align-items-center py-lg">
  <Row className="align-items-center justify-content-center">
    <Col className="text-center" lg="6">
      <h1 style={{ color: 'yourH1Color' }}>Welcome to Our Platform</h1>
      <p style={{ color: 'yourPColor' }}>
      Optimize your recruitment processes with our all-in-one, intuitive platform.
      </p>
    </Col>
  </Row>
</div>


      <div style={styles.separator} className="separator separator-bottom separator-skew zindex-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-white"
            points="2560 0 2560 100 0 100"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;
