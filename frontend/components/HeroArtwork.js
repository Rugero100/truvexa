export default function HeroArtwork() {
  return <div className="hero-art" role="img" aria-label="Abstract architectural illustration in bronze and charcoal">
    <svg viewBox="0 0 620 650" className="hero-illustration" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f1d2a5"/><stop offset=".55" stopColor="#b97940"/><stop offset="1" stopColor="#56372a"/></linearGradient><linearGradient id="night" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#3f4c4a"/><stop offset="1" stopColor="#131c1d"/></linearGradient></defs>
      <rect width="620" height="650" fill="#202727"/>
      <circle cx="345" cy="265" r="232" fill="none" stroke="#7a7771" strokeWidth="1" opacity=".45"/>
      <circle cx="345" cy="265" r="164" fill="none" stroke="#b7ac98" strokeWidth="1" opacity=".3"/>
      <path d="M100 650V208L340 78V650Z" fill="url(#bronze)"/><path d="M340 78L515 172V650H340Z" fill="url(#night)"/>
      <path d="M130 650V228L317 125V650Z" fill="#d8ad79" opacity=".32"/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${157 + i * 24} ${214 - i * 12}V650`} stroke="#ffdeb0" opacity=".55" strokeWidth="2"/>)}
      {Array.from({length: 6}, (_, i) => <path key={i} d={`M350 ${170 + i * 75}H505`} stroke="#bdad90" opacity=".32" strokeWidth="2"/>)}
      <path d="M87 650H537M60 592H561" stroke="#e0b581" strokeWidth="1" opacity=".45"/>
      <circle cx="450" cy="122" r="50" fill="#d9b985" opacity=".82"/><circle cx="450" cy="122" r="62" fill="none" stroke="#e6c58e" opacity=".45"/>
    </svg>
    <span className="art-vertical">THE ART OF POSSIBILITY — EST. FOR WHAT'S NEXT</span>
    <div className="art-caption"><span>01 / 04</span><span>Explore the extraordinary</span></div>
  </div>;
}
