import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import './About.css'

// Use the group image you just generated or your editorial image
import aboutBg from '../assets/editorial.jpg' 
// If you saved the group image as festive-group.jpg, use:
// import aboutBg from '../assets/festive-group.jpg'

export default function About(){
  return (
    <div className="about-page">

      {/* HERO WITH COMPLETE BACKGROUND PLACEHOLDER */}
      <section className="about-hero-full" style={{ backgroundImage: `url(${aboutBg})` }}>
        <div className="about-hero-overlay" />
        <div className="container about-hero-full-content">
          <div className="about-hero-copy">
            <span className="eyebrow">Our Heritage</span>
            <h1>Woven With <em>Stories.</em></h1>
            <p>
              I am building this brand with passion, dedication, and a commitment to offering 
              carefully selected collections that blend tradition with modern style. Every saree 
              you see here is chosen with the hope of making someone feel special.
              <br/><br/>
              This is more than a business. It is a journey of empowering women through 
              elegance, one saree at a time.
              <br/><br/>
              Thank you for being part of our story.
            </p>
            <Link to="/shop" className="btn btn-primary">
              Explore Sarees <ArrowUpRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}