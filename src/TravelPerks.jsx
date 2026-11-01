import React, { useState } from 'react';
import { Copy, MessageSquare, Plane } from 'lucide-react';
import { DESTINATIONS, travelMessage, travelSmsUrl } from './travel.js';
import { copyText } from './clipboard.js';

function DestinationCard({ destination }) {
  const [notice, setNotice] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  async function copy() {
    const copied = await copyText(`To: 463-281-3454\n\n${travelMessage(destination)}`);
    setNotice(copied ? 'Message copied. Complete your details and send it to Roger in your text app.' : 'Copy is unavailable. Select and copy the message below.');
    setManualCopy(!copied);
  }
  return <article className="destination-card" aria-label={`${destination.name}, ${destination.region}`}>
    <div className="destination-photo"><img src={destination.image} alt={destination.alt} loading="lazy" width="960" height="640" /><span>{destination.days} Days</span></div>
    <div className="destination-content"><span className="destination-region">{destination.region}</span><h3>{destination.name}</h3><p>{destination.days}-day promotional opportunity. Ask Roger to confirm availability and complete terms.</p><a className="primary-button" href={travelSmsUrl(destination)} onClick={() => setNotice('Text app requested. Complete your details, review the message, and send it there. This website has not sent a message.')}><MessageSquare size={16} /> TEXT ROGER ABOUT THIS TRIP</a><button className="text-button" type="button" onClick={copy}><Copy size={15} /> Copy message</button><p role="status" className="travel-status">{notice}</p>{manualCopy && <textarea className="manual-travel-copy" aria-label={`${destination.name} message to copy`} readOnly value={`To: 463-281-3454\n\n${travelMessage(destination)}`} rows={8} onFocus={event => event.target.select()} />}</div>
  </article>;
}

export default function TravelPerks() {
  return <section className="travel-section content-width" aria-labelledby="travel-heading"><div className="travel-heading"><span className="eyebrow"><Plane size={18} /> INDEPENDENT PERKS FROM ROGER</span><h2 id="travel-heading">Customer Travel Perks</h2><p>Explore promotional vacation opportunities personally arranged by Roger Reed.</p></div>
    <div className="travel-disclosure"><strong>This is an independent Roger With Vivint promotional offer arranged by Roger Reed. It is not sponsored, administered, fulfilled, or guaranteed by Vivint corporate.</strong><p>Promotional travel packages require payment of applicable taxes and fees. Package availability, inclusions, eligibility, and additional terms must be confirmed before booking.</p><p>Request details only. Dates, accommodation, total costs, restrictions, and any required presentations must be confirmed in written terms. Airfare, meals, transfers, and other expenses are not represented as included. Destination photos are illustrative and do not show a promised accommodation or itinerary.</p></div>
    <div className="destination-grid">{DESTINATIONS.map(destination => <DestinationCard key={destination.id} destination={destination} />)}</div>
    <p className="field-hint travel-help">Text Roger at 463-281-3454. Complete your name, phone, and email in your own text app, then press Send. No booking, payment, or automated message is handled by this site.</p>
    <details className="photo-credits"><summary>Destination photo credits</summary><p>Photographs are displayed with a responsive crop. No photographer endorses this promotion. Attribution and licenses:</p><ul>{DESTINATIONS.map(destination => <li key={destination.id}><a href={destination.source} target="_blank" rel="noopener noreferrer">{destination.name} · {destination.author}</a> · <a href={destination.licenseUrl} target="_blank" rel="noopener noreferrer">{destination.license}</a></li>)}</ul></details>
  </section>;
}
