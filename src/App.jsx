import React, { useEffect, useMemo, useState } from 'react';
import { CONFIG, MENU, T } from './config.js';
import { useReveal, useCountUp } from './hooks.js';
import BgScene from './BgScene.jsx';

const STORE_KEY = 'narmatha-lang';
const PHONE_TEL = 'tel:+919500608963';
const PHONE = '95006 08963';

const fmt = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));

function readLang() {
  try {
    const v = localStorage.getItem(STORE_KEY);
    return v === 'ta' || v === 'en' ? v : CONFIG.DEFAULT_LANG;
  } catch (e) { return CONFIG.DEFAULT_LANG; }
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ '--d': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

const PhoneIcon = ({ size }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24">
    <path fill="currentColor" d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1z" />
  </svg>
);

const ICONS = {
  coin: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15.5V19h-2v-1.5c-1.4-.2-2.5-1-2.8-2.4l1.9-.5c.2.8.8 1.2 1.9 1.2 1 0 1.6-.4 1.6-1 0-.7-.5-1-1.9-1.4C9.8 12.9 8.5 12.3 8.5 10.7c0-1.2.9-2.1 2.5-2.4V7h2v1.3c1.2.2 2.1.9 2.4 2l-1.8.6c-.2-.6-.7-.9-1.6-.9s-1.4.4-1.4.9c0 .6.5.8 1.8 1.2 1.7.5 3 1 3 2.7 0 1.3-1 2.2-2.6 2.5z',
  leaf: 'M20 4C9 4 4 9 4 15c0 1.6.5 3 1.3 4C6.5 14 10 11 15 9c-4 3-6.500 6.500-7.300 11 .9.6 2 1 3.300 1 6 0 9.700-6 8.700-17z',
  shield: 'M12 2 4 5v6c0 5 3.400 9.500 8 11 4.600-1.500 8-6 8-11V5l-8-3zm-1.200 14L7 12.200l1.400-1.400 2.400 2.400 4.800-4.800L17 9.800 10.800 16z',
  truck: 'M3 6h11v9H3V6zm11 3h4l3 3v3h-2a2.500 2.500 0 0 1-5 0h-4a2.500 2.500 0 0 1-5 0H3v-1h11V9zM7.500 15.500a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
  pin: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.500A2.500 2.500 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5z',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.200 13.200-5.200-3.100V6h1.500v5.200l4.500 2.700-.8 1.300z',
};
const Icon = ({ name, size = 24 }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24"><path fill="currentColor" d={ICONS[name]} /></svg>
);

function Header({ t, lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-in">
        <a className="brand" href="#top" aria-label="Radhapuram Veetu Sapadu Kadai">
          <img src="images/logo.png" alt="" width="52" height="52" />
          <span className="brand-text">
            <span className="brand-main">{t('brand.main')}</span>
            <span className="brand-sub">{t('brand.sub')}</span>
          </span>
        </a>
        <nav className="site-nav" aria-label="Sections">
          <ul>
            {[['menu', 'nav.menu'], ['delivery', 'nav.delivery'], ['order', 'nav.order'], ['feedback', 'nav.feedback'], ['contact', 'nav.contact']].map(([id, k]) => (
              <li key={id}><a href={`#${id}`}>{t(k)}</a></li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <div className="lang" role="group" aria-label="Language / மொழி">
            {['ta', 'en'].map((l) => (
              <button key={l} type="button" className="lang-btn" lang={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l === 'ta' ? 'தமிழ்' : 'EN'}
              </button>
            ))}
          </div>
          <a className="btn btn-call" href={PHONE_TEL} aria-label={`Call ${PHONE}`}>
            <PhoneIcon size={20} />
            <span className="call-label">{t('call.short')}</span>
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero({ t, lang }) {
  const words = t('hero.title').split(' ');
  return (
    <section className="hero" id="top">
      <img className="hero-bg" src="images/hero-meal.jpg" alt="" aria-hidden="true" fetchpriority="high" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <img className="hero-logo anim-rise" style={{ '--d': '0ms' }} src="images/logo.png" width="132" height="132" alt={t('brand.full')} />
          <h1 key={lang} aria-label={t('hero.title')}>
            {words.map((w, i) => (
              <span key={i} className="word" aria-hidden="true" style={{ '--d': `${120 + i * 110}ms` }}>{w}</span>
            ))}
          </h1>
          <p className="hero-sub anim-rise" style={{ '--d': `${200 + words.length * 110}ms` }}>{t('hero.sub')}</p>
          <div className="hero-actions anim-rise" style={{ '--d': `${300 + words.length * 110}ms` }}>
            <a className="btn btn-big pulse" href={PHONE_TEL}>
              <PhoneIcon size={26} />
              <span className="btn-big-text">
                <span className="btn-big-label">{t('hero.cta')}</span>
                <span className="btn-big-num">{PHONE}</span>
              </span>
            </a>
            <a className="btn btn-ghost" href="#menu">{t('hero.menu')}</a>
          </div>
        </div>
        <div className="hero-art anim-rise" style={{ '--d': '400ms' }}>
          <figure className="hero-photo">
            <img src="images/veg-meal.jpg" width="560" height="420" alt={t('hero.alt')} />
          </figure>
          <div className="float-card float-a"><span className="fc-ico"><Icon name="coin" size={22} /></span><span><b>₹{MENU.veg.price}</b><small>{t('menu.meal')}</small></span></div>
          <div className="float-card float-b"><span className="fc-ico"><Icon name="truck" size={22} /></span><span><b>{CONFIG.FREE_KM} {t('calc.unit')}</b><small>{t('calc.free')}</small></span></div>
        </div>
      </div>
    </section>
  );
}

function Trust({ t }) {
  const icons = ['coin', 'leaf', 'shield'];
  return (
    <section className="trust" aria-label="Why us">
      <ul className="wrap trust-grid">
        {[1, 2, 3].map((n) => (
          <Reveal as="li" key={n} className="trust-item" delay={(n - 1) * 120}>
            <span className="trust-ico"><Icon name={icons[n - 1]} size={26} /></span>
            <span>{t(`trust.${n}`)}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

const MENU_IMG = { veg: 'images/veg-meal.jpg', nonveg: 'images/chicken.jpg' };

function MenuCol({ kind, t, lang }) {
  const secondary = lang === 'ta' ? 'en' : 'ta';
  return (
    <Reveal className={`menu-col menu-${kind}`}>
      <div className="menu-photo">
        <img src={MENU_IMG[kind]} alt="" loading="lazy" width="560" height="320" />
        <span className="menu-price-badge">₹{MENU[kind].price}<small>{t('menu.meal')}</small></span>
      </div>
      <div className="menu-body">
        <h3 className="menu-head">
          <span className={`mark mark-${kind}`} aria-hidden="true" />
          <span className="menu-title">{t(`menu.${kind}`)}</span>
        </h3>
        <ul className="menu-list">
          {MENU[kind].items.map((item, i) => (
            <li key={item.en} style={{ '--i': i }}>
              <span className="item-main" lang={lang}>{item[lang]}</span>
              <span className="item-alt" lang={secondary}>{item[secondary]}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function MenuSection({ t, lang }) {
  return (
    <section className="section" id="menu" aria-labelledby="menu-h">
      <div className="wrap">
        <Reveal as="h2" id="menu-h" className="section-title">{t('menu.title')}</Reveal>
        <div className="menu-grid">
          <MenuCol kind="veg" t={t} lang={lang} />
          <MenuCol kind="nonveg" t={t} lang={lang} />
        </div>
        <p className="note">{t('menu.note')}</p>
      </div>
    </section>
  );
}

function Gallery({ t }) {
  const shots = [
    ['images/fish-fry.jpg', 'gallery.1', 'g-a'],
    ['images/curry.jpg', 'gallery.2', 'g-b'],
    ['images/hero-meal.jpg', 'gallery.3', 'g-c'],
    ['images/chicken.jpg', 'gallery.4', 'g-d'],
  ];
  return (
    <section className="section section-dark" aria-labelledby="gal-h">
      <div className="wrap">
        <Reveal as="h2" id="gal-h" className="section-title">{t('gallery.title')}</Reveal>
        <Reveal as="p" className="lead">{t('gallery.sub')}</Reveal>
        <div className="gallery">
          {shots.map(([src, k, cls], i) => (
            <Reveal as="figure" key={k} className={`shot ${cls}`} delay={i * 100}>
              <img src={src} alt={t(k)} loading="lazy" />
              <figcaption>{t(k)}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Ring({ km, t }) {
  const R = 138;
  const scale = R / CONFIG.MAX_KM;
  const r = Math.min(Math.max(km, 0), CONFIG.MAX_KM + 0.6) * scale;
  const guides = [];
  for (let k = CONFIG.FREE_KM + 2; k < CONFIG.MAX_KM; k += 2) guides.push(k);
  return (
    <svg className="ring" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
      <circle cx="150" cy="150" r={R} fill="#fff" stroke="#C85A32" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" className="ring-outer" />
      {guides.map((k) => <circle key={k} cx="150" cy="150" r={k * scale} fill="none" stroke="#EADFCB" strokeWidth="1" />)}
      <circle cx="150" cy="150" r={CONFIG.FREE_KM * scale} fill="#C85A32" fillOpacity="0.16" stroke="#C85A32" strokeWidth="3" className="ring-free" />
      <g transform="translate(150 150) rotate(-38)">
        <line x1="0" y1="0" x2="1" y2="0" stroke="#4A2E1B" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="ring-link" style={{ transform: `scaleX(${r})` }} />
        <circle cx="0" cy="0" r="9" fill="#4A2E1B" stroke="#fff" strokeWidth="3" className="ring-dot" style={{ transform: `translateX(${r}px)` }} />
      </g>
      <circle cx="150" cy="150" r="7" fill="#C85A32" />
      <circle cx="150" cy="150" r="3" fill="#fff" />
      <text x="150" y="172" textAnchor="middle" className="ring-label-sm">{t('ring.kitchen')}</text>
      <text x="150" y="188" textAnchor="middle" className="ring-label">{t('ring.free')}</text>
      <text x="150" y={150 - R - 6} textAnchor="middle" className="ring-label-sm">{CONFIG.MAX_KM} km</text>
    </svg>
  );
}

function Calculator({ t }) {
  const [text, setText] = useState('3');
  const km = parseFloat(text);
  const valid = text !== '' && isFinite(km);
  const dist = valid ? Math.max(0, km) : 0;

  let state = 'idle';
  let amount = 0;
  let extra = 0;
  if (valid) {
    if (dist > CONFIG.MAX_KM) state = 'far';
    else if (dist <= CONFIG.FREE_KM) state = 'free';
    else {
      state = 'charge';
      const e = Math.round((dist - CONFIG.FREE_KM) * 100) / 100;
      extra = CONFIG.ROUND_UP_EXTRA_KM ? Math.ceil(e) : e;
      amount = Math.round(extra * CONFIG.RATE_PER_KM);
    }
  }
  const shownAmount = useCountUp(amount);

  const main = {
    idle: t('calc.empty'),
    free: t('calc.free'),
    far: t('calc.far'),
    charge: t('calc.charge', { amount: shownAmount }),
  }[state];
  const sub = {
    idle: t('calc.empty.d'),
    free: t('calc.free.d'),
    far: t('calc.far.d'),
    charge: t('calc.charge.d', { extra: String(Math.round(extra * 100) / 100) }),
  }[state];

  return (
    <section className="section section-tint" id="delivery" aria-labelledby="delivery-h">
      <div className="wrap">
        <Reveal as="h2" id="delivery-h" className="section-title">{t('calc.title')}</Reveal>
        <Reveal as="p" className="lead">{t('calc.intro')}</Reveal>
        <div className="calc">
          <Reveal className="calc-controls">
            <label className="calc-label" htmlFor="km-num">{t('calc.label')}</label>
            <div className="km-row">
              <input className="km-num" id="km-num" type="number" inputMode="decimal" min="0" max="99" step="0.5" value={text} onChange={(e) => setText(e.target.value)} />
              <span className="km-unit">{t('calc.unit')}</span>
            </div>
            <input className="km-range" type="range" min="0" max={CONFIG.MAX_KM} step="0.5" value={Math.min(dist, CONFIG.MAX_KM)} aria-label={t('calc.range')} onChange={(e) => setText(e.target.value)} />
            <div className="range-scale" aria-hidden="true">
              <span>0</span>
              <span id="scale-free" style={{ left: `${(CONFIG.FREE_KM / CONFIG.MAX_KM) * 100}%` }}>{CONFIG.FREE_KM}</span>
              <span id="scale-max">{CONFIG.MAX_KM}</span>
            </div>
            <div className="result" role="status" aria-live="polite" data-state={state}>
              <p className="result-main" key={state}>{main}</p>
              <p className="result-sub">{sub}</p>
            </div>
          </Reveal>
          <Reveal className="calc-ring" delay={150}>
            <Ring km={dist} t={t} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Steps({ t }) {
  return (
    <section className="section" id="order" aria-labelledby="order-h">
      <div className="wrap">
        <Reveal as="h2" id="order-h" className="section-title">{t('how.title')}</Reveal>
        <ol className="steps">
          {[1, 2, 3].map((n) => (
            <Reveal as="li" key={n} className="step" delay={(n - 1) * 150}>
              <span className="step-no" aria-hidden="true">{n}</span>
              <h3>{t(`how.${n}.t`)}</h3>
              <p>{t(`how.${n}.d`)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Feedback({ t }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [msg, setMsg] = useState('');
  const text = [t('fb.text'), `${t('fb.stars')}: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} (${rating}/5)`, name.trim() && `${t('fb.from')}: ${name.trim()}`, msg.trim()].filter(Boolean).join('\n');
  const href = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  return (
    <section className="section section-dark" id="feedback" aria-labelledby="fb-h">
      <div className="wrap fb-grid">
        <Reveal>
          <h2 id="fb-h" className="section-title">{t('fb.title')}</h2>
          <p className="lead">{t('fb.sub')}</p>
        </Reveal>
        <Reveal className="fb-card" delay={120}>
          <form onSubmit={(e) => { e.preventDefault(); window.open(href, '_blank', 'noopener'); }}>
            <label className="fb-label" htmlFor="fb-name">{t('fb.name')}</label>
            <input id="fb-name" className="fb-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            <span className="fb-label" id="fb-rate">{t('fb.rating')}</span>
            <div className="stars" role="radiogroup" aria-labelledby="fb-rate">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={t('fb.star', { n })} className={`star ${n <= rating ? 'on' : ''}`} onClick={() => setRating(n)}>★</button>
              ))}
            </div>
            <label className="fb-label" htmlFor="fb-msg">{t('fb.msg')}</label>
            <textarea id="fb-msg" className="fb-input" rows="4" placeholder={t('fb.ph')} value={msg} onChange={(e) => setMsg(e.target.value)} />
            <button type="submit" className="btn btn-wa">{t('fb.send')}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function CtaBand({ t }) {
  return (
    <section className="cta-band" aria-label={t('cta.title')}>
      <img src="images/curry.jpg" alt="" loading="lazy" aria-hidden="true" />
      <div className="cta-shade" aria-hidden="true" />
      <Reveal className="wrap cta-in">
        <h2>{t('cta.title')}</h2>
        <a className="btn btn-big" href={PHONE_TEL}>
          <PhoneIcon size={26} />
          <span className="btn-big-text">
            <span className="btn-big-label">{t('call.now')}</span>
            <span className="btn-big-num">{PHONE}</span>
          </span>
        </a>
      </Reveal>
    </section>
  );
}

function Contact({ t }) {
  const pay = t('contact.pay.v');
  const wa = CONFIG.WHATSAPP_NUMBER
    ? `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(t('wa.text'))}`
    : null;
  const rows = [
    ['contact.address', 'contact.address.v', 'pin'],
    ['contact.timings', 'contact.timings.v', 'clock'],
    ['contact.closed', 'contact.closed.v', 'clock'],
    ...(pay ? [['contact.pay', 'contact.pay.v', 'coin']] : []),
  ];
  return (
    <section className="section section-tint contact" id="contact" aria-labelledby="contact-h">
      <div className="wrap contact-grid">
        <Reveal>
          <h2 id="contact-h" className="section-title">{t('contact.title')}</h2>
          <a className="phone-big" href={PHONE_TEL}>{PHONE}</a>
          <div className="contact-actions">
            <a className="btn btn-solid" href={PHONE_TEL}>{t('call.now')}</a>
            <a className="btn btn-outline" href={CONFIG.MAPS_URL} target="_blank" rel="noopener">{t('contact.directions')}</a>
            {wa && <a className="btn btn-outline" href={wa} target="_blank" rel="noopener">{t('contact.whatsapp')}</a>}
          </div>
        </Reveal>
        <Reveal as="dl" className="info" delay={150}>
          {rows.map(([k, v, ic]) => (
            <div key={k}>
              <span className="info-ico"><Icon name={ic} size={22} /></span>
              <span><dt>{t(k)}</dt><dd>{t(v)}</dd></span>
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal className="wrap map-wrap" delay={100}>
        <iframe className="map" title={t('contact.map')} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${CONFIG.MAP_LAT},${CONFIG.MAP_LNG}&z=16&output=embed`} />
      </Reveal>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer className="site-footer">
      <Reveal className="wrap">
        <img className="foot-logo" src="images/logo.png" alt="" width="112" height="112" />
        <p className="foot-line">{t('footer.line1')}</p>
        <p className="foot-tag">{t('footer.line2')}</p>
        <p className="foot-small">© {t('brand.full')} · {t('footer.credits')}</p>
      </Reveal>
    </footer>
  );
}

export default function App() {
  const [lang, setLangState] = useState(readLang);
  const t = useMemo(() => {
    const vars = { free: CONFIG.FREE_KM, rate: CONFIG.RATE_PER_KM, max: CONFIG.MAX_KM };
    return (key, extra) => {
      const s = T[lang][key];
      return s === undefined ? key : fmt(s, { ...vars, ...extra });
    };
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* storage blocked */ }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', t('meta.desc'));
  }, [lang, t]);

  return (
    <>
      <BgScene />
      <a className="skip" href="#main">{t('skip')}</a>
      <Header t={t} lang={lang} setLang={setLang} />
      <main id="main">
        <Hero t={t} lang={lang} />
        <Trust t={t} />
        <MenuSection t={t} lang={lang} />
        <Gallery t={t} />
        <Calculator t={t} />
        <Steps t={t} />
        <Feedback t={t} />
        <CtaBand t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
