import React from "react";
import "./Home.css";
import trackImage from "../Images/trackImg.png";
import saveImage from "../Images/saveImg.jpg";
import growImage from "../Images/growImage.png";
import investImage from "../Images/investImage.png";

const Home = () => {
  return (
    <div className="body">
      <div className="main-quote">
        <h1>Track Your Finances For Financial Growth!</h1>
      </div>
      <div className="details">
        <div className="detailsCard">
          <h1 className="trackh1">Track</h1>

          <img src={trackImage} className="cardImg" id="trackImg" />
        </div>
        <div className="detailsCard">
          <h1>Save</h1>
          <img src={saveImage} className="cardImg" id="saveImg" />
        </div>
        <div className="detailsCard">
          <h1>Invest</h1>
          <img src={investImage} alt="" className="cardImg" id="investImg" />
        </div>
        <div className="detailsCard">
          <h1>Grow</h1>
          <img src={growImage} className="cardImg" id="growImg" />
        </div>
      </div>
    </div>
  );
};

export default Home;
