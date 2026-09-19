import React,{useState} from 'react'
import { Mail, Phone, Clock, Send } from 'lucide-react'
import './Contact.css'
export default function Contact(){
 const [sent,setSent]=useState(false)
 const submit=e=>{e.preventDefault();setSent(true);e.currentTarget.reset()}
 return <div className="contact-page">
  <section className="simple-page-hero"><span className="eyebrow">We would love to hear from you</span><h1>Get In <em>Touch</em></h1><p>Questions about a saree, order or collection? Send us a message.</p></section>
  <section className="section"><div className="container contact-grid">
   <div className="contact-info-card"><span className="eyebrow">Contact Sarika</span><h2>Let's Create Something <em>Beautiful.</em></h2>
    <div className="contact-line"><Mail size={19}/><div><strong>Email</strong><span>madhusarika2005@gmail.com</span></div></div>
    <div className="contact-line"><Phone size={19}/><div><strong>Phone</strong><span>+91 9100389240</span></div></div>
    <div className="contact-line"><Clock size={19}/><div><strong>Business Hours</strong><span>Mon – Sat, 10 AM – 7 PM</span></div></div>
   </div>
   <form className="contact-form-card" onSubmit={submit}><h3>Send a Message</h3><div className="field-row"><div className="field"><label>Name</label><input required/></div><div className="field"><label>Phone</label><input required/></div></div><div className="field"><label>Email</label><input type="email" required/></div><div className="field"><label>Message</label><textarea rows="6" required/></div><button className="btn btn-primary" type="submit">Send Message <Send size={15}/></button>{sent&&<p className="contact-success">Thank you! Your message has been sent.</p>}</form>
  </div></section>
 </div>
}
