import React from 'react';
import {ArrowUpRight,HeartHandshake,Star} from 'lucide-react';
import './nextdoor-review.css';

export const NEXTDOOR_REVIEW_URL='https://nextdoor.com/page/tech-rahj-home-security-fishers-in?utm_campaign=1795375099638&share_action_id=59e99dee-76cf-4415-9b62-effc329da606';

export function NextdoorReviewLink({children='LEAVE ROGER A NEXTDOOR REVIEW',className='primary-button'}){
 return <a className={className} href={NEXTDOOR_REVIEW_URL} target="_blank" rel="noopener noreferrer"><Star size={18}/>{children}<ArrowUpRight size={17}/></a>;
}

export default function NextdoorReview(){
 return <section className="nextdoor-review-page narrow-width section-padding" aria-labelledby="nextdoor-review-heading">
  <span className="eyebrow"><Star size={18}/> A SMALL FAVOR FROM ROGER</span>
  <h1 id="nextdoor-review-heading">Enjoying Your Vivint Setup? Tell Your Neighbors! 🌟</h1>
  <p>Reviews from real customers help neighbors know what to expect when they work with me. If I installed your Vivint system, I'd appreciate you sharing your honest experience on my Tech Rahj Home Security Nextdoor page.</p>
  <div className="nextdoor-review-card">
   <HeartHandshake size={34}/>
   <h2>Your words make a difference.</h2>
   <p>Tell neighbors what your installation was like, how I treated your home, or what you found helpful. Be yourself and share only what you genuinely experienced—there's no need to leave a positive review if that isn't how you feel.</p>
   <NextdoorReviewLink/>
   <small>Opens Nextdoor in a new tab or app. Nextdoor may ask you to sign in. A review is optional and is not required to receive referral rewards.</small>
  </div>
 </section>;
}
