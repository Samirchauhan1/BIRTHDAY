const { useState, useEffect, useRef, useCallback } = React;

function seededRand(seed) {
  const x = Math.sin(seed * 9973.7) * 43758.5453;
  return x - Math.floor(x);
}

function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      setPct(scrolled || 0);
    }
    document.addEventListener('scroll', onScroll);
    onScroll();
    return () => document.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="progress-rail">
      <div className="progress-fill" style={{ width: pct + '%' }} />
    </div>
  );
}

function RosePetals() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const petals = useRef(null);
  if (reduceMotion) return null;

  if (petals.current === null) {
    const colors = ['#E8A0AE', '#B33951', '#F2C6CE', '#8B2635'];
    const count = window.innerWidth < 600 ? 8 : 13;
    petals.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 11 + Math.random() * 11,
      left: Math.random() * 100,
      duration: 10 + Math.random() * 8,
      delay: -(Math.random() * 13),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  return (
    <div className="petals">
      {petals.current.map(p => (
        <div key={p.id} className="petal" style={{ left: p.left + 'vw', animationDuration: p.duration + 's', animationDelay: p.delay + 's' }}>
          <svg width={p.size} height={p.size} viewBox="0 0 20 24">
            <path d="M10 0 C 17 6, 18 16, 10 24 C 2 16, 3 6, 10 0 Z" fill={p.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}

function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) { setInView(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.unobserve(el); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delayClass = delay === 1 ? 'reveal-delay-1' : delay === 2 ? 'reveal-delay-2' : '';
  return (
    <Tag ref={ref} className={`reveal ${delayClass} ${inView ? 'in-view' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

// Cut-paper "ransom note" collage heading — each letter its own scrap
const SCRAP_FONTS = ["'Special Elite', monospace", "'Fraunces', serif", "'Caveat', cursive", "'Abril Fatface', serif", "'Karla', sans-serif"];
const SCRAP_INK_COLORS = ['#2B2018', '#8B2635', '#5B4A3A', '#B33951'];
const SCRAP_CHIP_COLORS = ['#FBF6E9', '#F2E7C9', '#F2C6CE', '#FFFFFF'];
const SCRAP_CLIPS = [
  'polygon(3% 10%, 22% 1%, 48% 7%, 74% 0%, 97% 9%, 100% 42%, 95% 72%, 100% 97%, 66% 100%, 38% 93%, 8% 100%, 0% 63%)',
  'polygon(0% 4%, 30% 0%, 60% 6%, 100% 2%, 96% 40%, 100% 76%, 92% 100%, 60% 96%, 28% 100%, 4% 94%, 0% 60%)',
  'polygon(6% 0%, 40% 4%, 78% 0%, 100% 30%, 94% 64%, 100% 100%, 62% 96%, 30% 100%, 0% 90%, 4% 50%)',
];

function ScrapHeading({ text, as = 'h2', align = 'center', size = '2rem', seedOffset = 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduceMotion) { setInView(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.unobserve(el); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const words = text.split(' ');
  let globalIndex = 0;

  return (
    <Tag ref={ref} style={{ fontSize: size }}>
      <span className={`scrap-heading ${align === 'left' ? 'left-align' : ''}`}>
        {words.map((word, wi) => {
          const letters = word.split('').map((ch) => {
            const i = globalIndex++;
            const s = i + seedOffset;
            const rot = (seededRand(s * 3 + 1) - 0.5) * 18;
            const useChip = seededRand(s * 7 + 2) > 0.38;
            const font = SCRAP_FONTS[Math.floor(seededRand(s * 11 + 3) * SCRAP_FONTS.length)];
            const inkColor = SCRAP_INK_COLORS[Math.floor(seededRand(s * 13 + 4) * SCRAP_INK_COLORS.length)];
            const chipColor = SCRAP_CHIP_COLORS[Math.floor(seededRand(s * 17 + 5) * SCRAP_CHIP_COLORS.length)];
            const clip = SCRAP_CLIPS[Math.floor(seededRand(s * 19 + 6) * SCRAP_CLIPS.length)];
            const scale = 0.92 + seededRand(s * 23 + 7) * 0.24;
            const delay = i * 45;
            return (
              <span
                key={i}
                className={`scrap-letter ${inView ? 'in-view' : ''}`}
                style={{ '--rot': rot + 'deg', transitionDelay: inView ? delay + 'ms' : '0ms' }}
              >
                {useChip ? (
                  <span className="chip" style={{ background: chipColor, clipPath: clip, fontFamily: font, color: inkColor, transform: `scale(${scale})` }}>
                    {ch}
                  </span>
                ) : (
                  <span style={{ fontFamily: font, color: inkColor, transform: `scale(${scale})`, display: 'inline-block' }}>
                    {ch}
                  </span>
                )}
              </span>
            );
          });
          return (
            <React.Fragment key={wi}>
              <span className="scrap-word">{letters}</span>
              {wi < words.length - 1 && <span className="scrap-space" />}
            </React.Fragment>
          );
        })}
      </span>
    </Tag>
  );
}

function RoseBloom({ cx, cy, scale = 1, hue = 'deep' }) {
  const palette = {
    deep: { outer: '#B33951', inner: '#8B2635', center: '#6B1C28' },
    blush: { outer: '#E8A0AE', inner: '#C94F63', center: '#8B2635' },
    bright: { outer: '#C94F63', inner: '#8B2635', center: '#5A1620' },
  }[hue];

  const outerAngles = [0, 60, 120, 180, 240, 300];
  const innerAngles = [30, 102, 174, 246, 318];
  const petal = (len, width) =>
    `M0,0 C ${width},${-len * 0.35} ${width * 0.8},${-len * 0.8} 0,${-len} C ${-width * 0.8},${-len * 0.8} ${-width},${-len * 0.35} 0,0 Z`;

  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      {outerAngles.map((a, i) => (
        <g key={'o' + i} transform={`rotate(${a})`}>
          <path d={petal(30, 15)} fill={palette.outer} opacity="0.96" />
        </g>
      ))}
      {innerAngles.map((a, i) => (
        <g key={'i' + i} transform={`rotate(${a})`}>
          <path d={petal(19, 10)} fill={palette.inner} opacity="0.98" />
        </g>
      ))}
      <path d="M0,2 C 6,-3 5,-10 0,-13 C -5,-10 -6,-3 0,2 Z" fill={palette.center} />
      <path d="M0,-2 C 3,-5 2,-8 0,-9 C -2,-8 -3,-5 0,-2 Z" fill={palette.center} opacity="0.85" />
    </g>
  );
}

function Bouquet({ className = 'rose-illus' }) {
  return (
    <svg className={className} viewBox="0 0 220 230" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="stem-group">
        {/* stems converging to the wrap */}
        <path d="M110 205 C 104 165, 96 140, 78 110" stroke="#5C6B3F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M110 205 C 110 160, 110 130, 110 92" stroke="#5C6B3F" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M110 205 C 116 165, 126 140, 146 112" stroke="#5C6B3F" strokeWidth="2.6" strokeLinecap="round" fill="none" />

        {/* leaves */}
        <path d="M92 168 Q 74 162 66 146 Q 86 148 96 164 Z" fill="#5C6B3F" />
        <path d="M126 172 Q 146 166 154 150 Q 134 152 124 168 Z" fill="#5C6B3F" />
        <path d="M104 190 Q 88 190 78 178 Q 96 176 106 186 Z" fill="#6E7F4C" />

        {/* wrap (kraft paper cone) */}
        <path d="M78 198 L142 198 L124 224 L96 224 Z" fill="#C9AD82" stroke="#B4956A" strokeWidth="1" />
        <path d="M78 198 L142 198 L136 208 L84 208 Z" fill="#E3D5B0" opacity="0.8" />
        {/* twine tie */}
        <path d="M82 206 C 100 200, 120 200, 138 206" stroke="#8B6B3F" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="110" cy="204" r="3" fill="#8B6B3F" />

        {/* three roses */}
        <RoseBloom cx="78" cy="108" scale="0.72" hue="blush" />
        <RoseBloom cx="146" cy="110" scale="0.68" hue="bright" />
        <RoseBloom cx="110" cy="82" scale="0.92" hue="deep" />
      </g>
    </svg>
  );
}

function TwineSpine() {
  return (
    <div className="spine" aria-hidden="true">
      <svg width="34" height="100%" viewBox="0 0 34 1600" preserveAspectRatio="none" style={{ height: '100%' }}>
        <line x1="17" y1="0" x2="17" y2="1600" stroke="#00000000" />
        {[120, 420, 720, 1020, 1320].map((y, i) => (
          <g key={i}>
            <circle cx="17" cy={y} r="6" fill="#2B2018" opacity="0.55" />
            <path
              d={`M17 ${y} C ${i % 2 === 0 ? -6 : 40} ${y + 40}, ${i % 2 === 0 ? -6 : 40} ${y + 80}, 17 ${y + 120}`}
              stroke="#A98A62"
              strokeWidth="2.5"
              fill="none"
              opacity="0.75"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

function TornDivider() {
  return (
    <div className="torn-divider" aria-hidden="true">
      <svg viewBox="0 0 400 16" preserveAspectRatio="none">
        <path
          d="M0,8 L12,3 L24,11 L36,2 L48,10 L60,4 L72,13 L84,1 L96,9 L108,5 L120,12 L132,3 L144,10 L156,6 L168,13 L180,2 L192,9 L204,4 L216,11 L228,3 L240,10 L252,6 L264,13 L276,2 L288,9 L300,4 L312,11 L324,3 L336,10 L348,6 L360,13 L372,2 L384,9 L400,6"
          fill="none"
          stroke="#2B2018"
          strokeOpacity="0.18"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

function ConfettiBurst({ onDone }) {
  const pieces = useRef(
    Array.from({ length: 42 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: 2.4 + Math.random() * 1.6,
      delay: Math.random() * 0.4,
      color: ['#B33951', '#E8A0AE', '#C9AD82', '#5C6B3F'][i % 4],
      size: 6 + Math.random() * 6,
      rotate: Math.random() * 360,
    }))
  ).current;

  useEffect(() => {
    const t = setTimeout(onDone, 4200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'fixed', top: -20, zIndex: 60, pointerEvents: 'none',
            left: p.left + 'vw', width: p.size, height: p.size * 0.4, background: p.color,
            animation: `confettiFall ${p.duration}s linear ${p.delay}s forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
      <style>{`@keyframes confettiFall { to { transform: translateY(105vh) rotate(540deg); opacity: 0.2; } }`}</style>
    </>
  );
}

function WishCandle() {
  const [litOut, setLitOut] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const blowOut = useCallback(() => {
    if (litOut) return;
    setLitOut(true);
    setShowConfetti(true);
  }, [litOut]);

  return (
    <div className="cake-wrap">
      <svg width="70" height="90" viewBox="0 0 70 90">
        <rect x="30" y="30" width="10" height="24" fill="#C9AD82" rx="2" />
        <path className={`flame ${litOut ? 'out' : ''}`} d="M35 6 C 40 14, 41 20, 35 30 C 29 20, 30 14, 35 6 Z" fill="#B33951" />
        <ellipse cx="35" cy="66" rx="34" ry="14" fill="#F2E7C9" stroke="#2B2018" strokeOpacity="0.15" />
        <rect x="1" y="54" width="68" height="20" rx="4" fill="#E8A0AE" />
      </svg>
      <button onClick={blowOut} disabled={litOut}>
        {litOut ? 'wish made ♡' : 'click the candle & make a wish'}
      </button>
      <p className={`wish-text ${litOut ? 'shown' : ''}`}>
        Whatever you wished for — I hope it finds its way to you this year.
      </p>
      {showConfetti && <ConfettiBurst onDone={() => setShowConfetti(false)} />}
    </div>
  );
}

function App() {
  return (
    <>
      <ProgressBar />
      <RosePetals />
      <TwineSpine />

      <section className="hero">
        <div className="wrap">
          <Bouquet />
          <ScrapHeading text="Happy Birthday, Amisha." as="h1" size="clamp(2.1rem, 5.6vw, 3.4rem)" />
          <p className="subhead">a small journal page, made just for you</p>
          <p className="scroll-hint">scroll down ↓</p>
        </div>
      </section>

      <section className="memory">
        <div className="wrap">
          <Reveal><TornDivider /></Reveal>
          <div className="page-card">
            <ScrapHeading text="things I've always known" align="left" size="clamp(1.5rem, 4vw, 2rem)" seedOffset={40} />
            <Reveal delay={2} as="p">
              You've always been kind — the kind of kind that doesn't ask for anything back.
              And your eyes... I've never quite found the right way to describe them.
              It's a hundred smaller things I've noticed over the years and never really said out loud.
            </Reveal>
            <Reveal delay={2}><WishCandle /></Reveal>
          </div>
        </div>
      </section>

      <section className="media-video">
        <div className="wrap">
          <Reveal as="p" className="media-intro">something I made for you</Reveal>
          <Reveal delay={1} className="taped-frame">
            <div className="washi left" />
            <div className="washi right" />
            <video controls playsInline poster="">
              <source src="video.mp4" type="video/mp4" />
              Your browser doesn't support embedded video.
            </video>
          </Reveal>
        </div>
      </section>

      <section className="media-audio">
        <div className="wrap">
          <Reveal as="p" className="media-intro">and something I couldn't quite say without my voice giving it away</Reveal>
          <Reveal delay={1} className="taped-frame audio-frame tilt-r">
            <div className="washi left" />
            <div className="washi right" />
            <div className="audio-label">press play, Amisha</div>
            <audio controls>
              <source src="voicenote.mp3" type="audio/mpeg" />
              Your browser doesn't support embedded audio.
            </audio>
          </Reveal>
        </div>
      </section>

      <section className="closing">
        <div className="wrap">
          <Reveal><TornDivider /></Reveal>
          <div className="page-card tilt-r">
            <ScrapHeading text="one last thing" align="left" size="clamp(1.4rem, 3.6vw, 1.8rem)" seedOffset={90} />
            <Reveal delay={1} as="p">
              I hope this year brings you the kind of happiness that stays — good people, good memories, new adventures, and plenty of reasons to smile.
            </Reveal>
            <Reveal delay={1} as="p">
              You're someone I genuinely admire, and I'm really glad I got to know you. I just wanted to make your birthday a little more memorable.
            </Reveal>
            <Reveal delay={2} as="p">
              Enjoy your day. Do the things you love. And most importantly, don't forget how wonderful you are.
            </Reveal>
            <Reveal delay={2} as="p" className="signoff">— Samir</Reveal>
            <Reveal delay={2}><Bouquet className="rose-illus closing-rose" /></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
