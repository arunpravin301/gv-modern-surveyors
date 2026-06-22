import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollStory() {
  const componentRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (!trackRef.current) return;
      
      const track = trackRef.current;
      let mm = gsap.matchMedia();

      // Only apply horizontal scroll pinning on desktop
      mm.add("(min-width: 1025px)", () => {
        const totalWidth = track.scrollWidth;
        const viewWidth = window.innerWidth;

        gsap.to(track, {
          x: () => -(totalWidth - viewWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: componentRef.current,
            start: 'top top',
            end: () => '+=' + totalWidth,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
      });

      // Apply vertical scroll effects on mobile/tablet
      mm.add("(max-width: 1024px)", () => {
        const chapters = gsap.utils.toArray<HTMLElement>('.story-chapter');
        
        chapters.forEach((chapter, i) => {
          const num = chapter.children[0];
          const textBlock = chapter.querySelector('.story-grid > div:first-child');
          const visualBlock = chapter.querySelector('.story-grid > div:last-child');

          // Parallax and fade for the background number
          if (num) {
            gsap.fromTo(num, 
              { y: 80, opacity: 0 },
              { 
                y: 0, opacity: 1,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 85%",
                  end: "top 40%",
                  scrub: 1
                }
              }
            );
          }

          // Staggered reveal for text content
          if (textBlock && textBlock.children) {
            gsap.fromTo(textBlock.children, 
              { y: 30, opacity: 0 },
              { 
                y: 0, opacity: 1,
                stagger: 0.15,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 75%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }

          // Scale up & 3D rotation for the graphics
          if (visualBlock) {
            gsap.fromTo(visualBlock,
              { scale: 0.85, opacity: 0, rotationY: 15 },
              {
                scale: 1, opacity: 1, rotationY: 0,
                duration: 1.2,
                ease: "back.out(1.2)",
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 70%",
                  toggleActions: "play none none reverse"
                }
              }
            );
          }
        });
      });
    }, componentRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={componentRef} id="story" style={{ background: 'var(--c-bg)', position: 'relative', borderBottom: '1px solid var(--c-border)' }}>
      <div className="story-container">
        <div ref={trackRef} className="story-track">
          
          {/* CHAPTER 1 */}
          <div className="story-chapter">
            <div style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(120px, 16vw, 240px)', fontWeight: 800, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '1.4px rgba(224,165,38,0.2)', position: 'absolute', top: '14vh', left: '8vw', pointerEvents: 'none' }}>01</div>
            <div className="story-grid">
              <div>
                <span className="mono" style={{ color: 'var(--c-gold)', display: 'block', marginBottom: '20px' }}>How land gets measured</span>
                <h3 style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(40px, 5.2vw, 76px)', fontWeight: 700, color: 'var(--c-paper)', marginBottom: '22px', lineHeight: 0.96 }}>You send us a location.</h3>
                <p style={{ fontSize: '17px', color: 'var(--c-t2)', maxWidth: '38ch', lineHeight: 1.7 }}>Send one message on WhatsApp. Tell us where your site is and what you need. No forms. No office visit.</p>
                <div className="mono" style={{ color: 'var(--c-t3)', marginTop: '26px' }}>STEP 01 · ENQUIRY RECEIVED</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ width: 'min(320px, 90%)', background: '#0b141a', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--c-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  {/* WhatsApp Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#202c33', padding: '12px 16px' }}>
                    <div style={{ width: '36px', height: '36px', background: 'var(--c-gold)', borderRadius: '50%', color: '#0b141a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--f-disp)', fontWeight: 800, fontSize: '15px' }}>GV</div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#e9edef' }}>GV Modern Surveyors</div>
                      <div style={{ fontSize: '12px', color: '#8696a0' }}>online</div>
                    </div>
                  </div>
                  {/* WhatsApp Body */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 12px', background: '#0b141a', backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '16px 16px', minHeight: '240px' }}>
                    
                    {/* Outgoing Message */}
                    <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#e9edef', padding: '6px 8px 8px 10px', borderRadius: '8px 0px 8px 8px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.4, position: 'relative' }}>
                      Need a boundary survey for a plot in Porur. Possible this week?
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', float: 'right', margin: '6px 0 -4px 8px' }}>9:14 AM</span>
                    </div>
                    
                    {/* Incoming Message */}
                    <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '6px 8px 8px 10px', borderRadius: '0px 8px 8px 8px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.4, position: 'relative' }}>
                      Yes sir. Can send a team tomorrow morning. Share the location pin?
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', float: 'right', margin: '6px 0 -4px 8px' }}>9:15 AM</span>
                    </div>
                    
                    {/* Outgoing Message */}
                    <div style={{ alignSelf: 'flex-end', background: '#005c4b', color: '#e9edef', padding: '6px 8px 8px 10px', borderRadius: '8px 8px 8px 8px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.4, position: 'relative' }}>
                      📍 Sharing now
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', float: 'right', margin: '6px 0 -4px 8px' }}>9:15 AM</span>
                    </div>
                    
                    {/* Incoming Message */}
                    <div style={{ alignSelf: 'flex-start', background: '#202c33', color: '#e9edef', padding: '6px 8px 8px 10px', borderRadius: '8px 8px 8px 8px', maxWidth: '85%', fontSize: '14px', lineHeight: 1.4, position: 'relative' }}>
                      Got it. Team confirmed for 8 AM tomorrow.
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', float: 'right', margin: '6px 0 -4px 8px' }}>9:16 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHAPTER 2 */}
          <div className="story-chapter">
            <div style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(120px, 16vw, 240px)', fontWeight: 800, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '1.4px rgba(224,165,38,0.2)', position: 'absolute', top: '14vh', left: '8vw', pointerEvents: 'none' }}>02</div>
            <div className="story-grid">
              <div>
                <span className="mono" style={{ color: 'var(--c-gold)', display: 'block', marginBottom: '20px' }}>How land gets measured</span>
                <h3 style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(40px, 5.2vw, 76px)', fontWeight: 700, color: 'var(--c-paper)', marginBottom: '22px', lineHeight: 0.96 }}>We arrive the next morning.</h3>
                <p style={{ fontSize: '17px', color: 'var(--c-t2)', maxWidth: '38ch', lineHeight: 1.7 }}>A field team reaches your site at first light. Total station, DGPS when the job needs it, and a thousand surveys of experience behind every reading.</p>
                <div className="mono" style={{ color: 'var(--c-t3)', marginTop: '26px' }}>STEP 02 · 13.0023° N · 80.0945° E · ON SITE</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <svg viewBox="0 0 400 360" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
                    <line x1="20" y1="300" x2="380" y2="300" stroke="rgba(224,165,38,0.4)" strokeWidth="1" />
                    <g stroke="#E0A526" strokeWidth="2.5" fill="none">
                      <line x1="200" y1="160" x2="170" y2="300"/>
                      <line x1="200" y1="160" x2="230" y2="300"/>
                      <line x1="200" y1="160" x2="205" y2="300"/>
                    </g>
                    <g>
                      <rect x="184" y="130" width="32" height="34" rx="0" fill="#E0A526"/>
                      <rect x="178" y="142" width="44" height="10" rx="0" fill="#8B94A3"/>
                      <circle cx="172" cy="147" r="5" fill="var(--c-bg)" stroke="#E0A526" strokeWidth="1.5"/>
                    </g>
                    <line x1="172" y1="147" x2="90" y2="240" stroke="rgba(224,165,38,0.8)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="172" y1="147" x2="330" y2="220" stroke="rgba(224,165,38,0.8)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <circle cx="90" cy="240" r="4" fill="none" stroke="#E0A526" strokeWidth="1.5" />
                    <circle cx="330" cy="220" r="4" fill="none" stroke="#E0A526" strokeWidth="1.5" />
                    <text x="78" y="262" fontFamily="var(--f-mono)" fontSize="9" fill="var(--c-t2)">PT.01</text>
                    <text x="320" y="242" fontFamily="var(--f-mono)" fontSize="9" fill="var(--c-t2)">PT.02</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* CHAPTER 3 */}
          <div className="story-chapter">
            <div style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(120px, 16vw, 240px)', fontWeight: 800, lineHeight: 0.8, color: 'transparent', WebkitTextStroke: '1.4px rgba(224,165,38,0.2)', position: 'absolute', top: '14vh', left: '8vw', pointerEvents: 'none' }}>03</div>
            <div className="story-grid">
              <div>
                <span className="mono" style={{ color: 'var(--c-gold)', display: 'block', marginBottom: '20px' }}>How land gets measured</span>
                <h3 style={{ fontFamily: 'var(--f-disp)', fontSize: 'clamp(40px, 5.2vw, 76px)', fontWeight: 700, color: 'var(--c-paper)', marginBottom: '22px', lineHeight: 0.96 }}>You get a signed report.</h3>
                <p style={{ fontSize: '17px', color: 'var(--c-t2)', maxWidth: '38ch', lineHeight: 1.7 }}>You get drawings, boundary marks, and a signed report. Valid for registration, bank and approval. Sent on WhatsApp, hard copy if you need one.</p>
                <div className="mono" style={{ color: 'var(--c-t3)', marginTop: '26px' }}>STEP 03 · REPORT ISSUED · SIGNED</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div className="brutal-panel" style={{ width: '100%', maxWidth: '420px', aspectRatio: '1/1.1', background: 'var(--c-bg-alt)', position: 'relative', padding: '24px' }}>
                  <svg viewBox="0 0 300 300" aria-hidden="true" style={{ width: '100%', height: '100%' }}>
                    <rect x="10" y="10" width="280" height="280" fill="none" stroke="var(--c-border)" strokeWidth="1"/>
                    <path d="M60 70 L210 55 L235 180 L90 230 Z" fill="rgba(224,165,38,0.04)" stroke="#E0A526" strokeWidth="1.6" />
                    <line x1="60" y1="70" x2="210" y2="55" stroke="rgba(224,165,38,0.4)" strokeWidth="0.6" strokeDasharray="3 3"/>
                    <circle cx="60" cy="70" r="3" fill="#E0A526"/>
                    <circle cx="210" cy="55" r="3" fill="#E0A526"/>
                    <circle cx="235" cy="180" r="3" fill="#E0A526"/>
                    <circle cx="90" cy="230" r="3" fill="#E0A526"/>
                    <text x="120" y="50" fontFamily="var(--f-mono)" fontSize="9" fill="var(--c-gold)">48.2m</text>
                    <text x="240" y="120" fontFamily="var(--f-mono)" fontSize="9" fill="var(--c-gold)">39.6m</text>
                    <text x="140" y="250" fontFamily="var(--f-mono)" fontSize="9" fill="var(--c-gold)">52.1m</text>
                    <g transform="translate(255,255)">
                      <line x1="0" y1="12" x2="0" y2="-12" stroke="var(--c-gold)" strokeWidth="1"/>
                      <polygon points="0,-12 -3,-5 3,-5" fill="var(--c-gold)"/>
                      <text x="3" y="-6" fontFamily="var(--f-mono)" fontSize="8" fill="var(--c-gold)">N</text>
                    </g>
                  </svg>
                  <div style={{ position: 'absolute', right: '18px', bottom: '18px', width: '74px', height: '74px', border: '1.5px solid var(--c-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: '7.5px', letterSpacing: '0.1em', color: 'var(--c-gold)', lineHeight: 1.5, transform: 'rotate(-12deg)' }}>
                    GV MODERN<br/>SURVEYORS<br/>· SIGNED ·
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
