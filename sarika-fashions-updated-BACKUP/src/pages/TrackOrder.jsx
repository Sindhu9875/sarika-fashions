import React, { useState } from 'react' 
import { Search, PackageCheck } from 'lucide-react' 
import './InfoPages.css' 
 
export default function TrackOrder() { 
  const [orderId, setOrderId] = useState('') 
  const [message, setMessage] = useState('') 
 
  const handleTrack = (e) => { 
    e.preventDefault() 
 
    if (!orderId.trim()) { 
      setMessage('Please enter your order ID.') 
      return 
    } 
 
    setMessage( 
      'Order tracking will be available once your order has been confirmed and shipped.' 
    ) 
  } 
 
  return ( 
    <div className="info-page"> 
      <div className="info-container"> 
 
        <div className="info-hero"> 
          <PackageCheck size={38} /> 
          <h1>Track Your Order</h1> 
          <p>Stay updated on your Sarika Fashions order.</p> 
        </div> 
 
        <div className="track-card"> 
          <h2>Enter your order ID</h2> 
 
          <form onSubmit={handleTrack} className="track-form"> 
 
            <div className="track-input"> 
              <Search size={18} /> 
 
              <input 
                type="text" 
                placeholder="Example: SF12345" 
                value={orderId} 
                onChange={(e) => setOrderId(e.target.value)} 
              /> 
            </div> 
 
            <button type="submit"> 
              Track Order 
            </button> 
 
          </form> 
 
          {message && ( 
            <p className="track-message"> 
              {message} 
            </p> 
          )} 
        </div> 
 
        <div className="info-card"> 
          <h2>How order tracking works</h2> 
 
          <p> 
            Once your order is confirmed, we will process and carefully 
            prepare your saree for dispatch. 
          </p> 
 
          <p> 
            After your order is shipped, tracking information will be 
            provided so you can follow its delivery status. 
          </p> 
        </div> 
 
      </div> 
    </div> 
  ) 
} 