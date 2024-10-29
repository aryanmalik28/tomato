import React from 'react'
import "./Footer.css"
import { assets } from '../../assets/assets'

// import 'font-awesome/css/font-awesome.min.css';
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className='footer-content'>
                <div className='footer-content-left'>
                 <img src={assets.logo}/>
                 <div className='footer-social-icon footer-links'>
                 <a href="https://www.linkedin.com/in/aryan-malik-12bb6b231" target="_main" className="icon"><FaLinkedin /></a>
          <a href="https://github.com/aryanmalik28" target="_main" className="icon"><FaGithub /> </a>
          <a href="https://www.facebook.com/share/Dhy5XXfPbFgX29db/?mibextid=qi2Omg" target="_main" className="icon"><FaFacebook /></a>
          <a href="https://www.instagram.com/kn0wnasmalik/?igsh=czlzemQ0d3ZtOHky" target="_main" className="icon"><FaSquareInstagram /></a>
          <a href="mailto:aryanmalik282003@gmail.com" target="_main" className="icon"><MdEmail /> </a>
                    {/* <img src={assets.facebook_icon} alt=''/>
                    <img src={assets.twitter_icon} alt=''/>
                    <img src={assets.linkedin_icon} alt=''/> */}
                 </div>
                </div>
                {/* <div className='footer-content-center'>
                     <h2>COMPANY</h2>
                     <ul>
                        <li> Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Ploicy</li>
                     </ul>
                </div> */}
                <div className='footer-content-right'>
                    <h2> GET IN TOUCH</h2>
                    <ul>
                        <li>+91-8445967061</li>
                        <li>aryanmalik282003@gmail.com</li>
                    </ul>
                </div>

            </div>
            <hr/>
            <p className='footer-copyright'>Copyright 2024 Tomato.com - All Right Reserve.</p>
        </div>
    
    )
}

export default Footer
