import { useState, useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = 'home' | 'about' | 'services' | 'detail' | 'cart' | 'faq' | 'contact'

interface Service {
  id: string
  name: string
  tagline: string
  price: number
  priceLabel: string
  category: string
  description: string
  features: string[]
  deliverables: string[]
  duration: string
  image: string
  popular?: boolean
}

interface CartItem {
  service: Service
  qty: number
  note: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const WA_NUMBER = '6289517433444'

const services: Service[] = [
  {
    id: 'logo-design',
    name: 'Logo Design',
    tagline: 'Identitas visual yang tak terlupakan',
    price: 299000,
    priceLabel: 'Rp 299.000',
    category: 'Branding',
    description: 'Kami merancang logo yang mencerminkan esensi brand kamu — unik, timeless, dan berkarakter kuat. Setiap konsep lahir dari riset mendalam tentang industri, kompetitor, dan target audiensmu.',
    features: ['3 konsep desain awal', 'Revisi hingga 5 kali', 'Format PNG, JPG, SVG, PDF', 'Full ownership & hak cipta', 'Panduan penggunaan warna & font'],
    deliverables: ['File master AI/EPS', 'PNG transparan (berbagai ukuran)', 'Versi horizontal & vertikal', 'Versi gelap & terang', 'Brand guideline 1 halaman'],
    duration: '3–5 hari kerja',
    image: 'photo-1626785774573-4b799315345d',
    popular: true,
  },
  {
    id: 'social-media-kit',
    name: 'Social Media Kit',
    tagline: 'Feed yang konsisten, engagement yang naik',
    price: 499000,
    priceLabel: 'Rp 499.000',
    category: 'Digital',
    description: 'Paket template sosial media lengkap yang dirancang khusus untuk brand kamu. Tampil profesional dan konsisten di setiap postingan tanpa perlu desainer setiap hari.',
    features: ['12 template feed Instagram', '6 template story', '3 template highlight cover', 'Template caption editable', 'File Canva / Figma editable'],
    deliverables: ['File Canva editable', 'Export PNG siap posting', 'Panduan tone of voice visual', 'Moodboard brand color'],
    duration: '5–7 hari kerja',
    image: 'photo-1611162617213-7d7a39e9b1d7',
  },
  {
    id: 'brand-identity',
    name: 'Brand Identity',
    tagline: 'Sistem visual lengkap untuk brand yang serius',
    price: 1499000,
    priceLabel: 'Rp 1.499.000',
    category: 'Branding',
    description: 'Paket identitas brand komprehensif — dari logo hingga sistem visual yang kohesif. Cocok untuk startup yang ingin tampil profesional sejak hari pertama.',
    features: ['Logo + variasi lengkap', 'Palet warna & tipografi', 'Brand guideline 20+ halaman', 'Social media starter kit', 'Template stationery digital'],
    deliverables: ['Brand guideline PDF', 'Semua aset logo', 'Color palette & usage guide', 'Typography system', 'Social media starter pack'],
    duration: '10–14 hari kerja',
    image: 'photo-1558655146-9f40138edfeb',
    popular: true,
  },
  {
    id: 'poster-flyer',
    name: 'Poster & Flyer',
    tagline: 'Promosi yang eye-catching dan on-brand',
    price: 199000,
    priceLabel: 'Rp 199.000',
    category: 'Print & Digital',
    description: 'Desain poster dan flyer yang menarik perhatian sekaligus menyampaikan pesan dengan jelas. Optimal untuk promosi event, produk, maupun layanan.',
    features: ['1 desain utama', '2 variasi warna/layout', 'Format digital & print-ready', 'Revisi hingga 3 kali', 'Ukuran sesuai kebutuhan'],
    deliverables: ['File PNG/JPG high-res', 'File PDF print-ready (300dpi)', 'Versi landscape & portrait'],
    duration: '2–3 hari kerja',
    image: 'photo-1561070791-2526d30994b5',
  },
  {
    id: 'presentation-design',
    name: 'Presentation Design',
    tagline: 'Pitchdeck yang bikin investor terkesan',
    price: 349000,
    priceLabel: 'Rp 349.000',
    category: 'Digital',
    description: 'Ubah pitchdeck atau presentasi biasa menjadi visual yang powerful dan meyakinkan. Struktur narasi yang kuat + desain yang bersih = hasil yang maksimal.',
    features: ['Hingga 15 slide', 'Template custom sesuai brand', 'Animasi transisi dasar', 'Revisi hingga 3 kali', 'Format PPT & PDF'],
    deliverables: ['File PowerPoint editable', 'PDF final', 'Google Slides version'],
    duration: '4–6 hari kerja',
    image: 'photo-1454165804606-c3d57bc86b40',
  },
  {
    id: 'motion-graphics',
    name: 'Motion Graphics',
    tagline: 'Konten video yang scroll-stopping',
    price: 799000,
    priceLabel: 'Rp 799.000',
    category: 'Motion',
    description: 'Animasi dan motion graphics yang membuat brand kamu bergerak dengan karakter. Dari logo animation hingga konten reels yang viral-worthy.',
    features: ['Durasi hingga 30 detik', '2 revisi', 'Full HD 1080p', 'Format MP4 & GIF', 'Musik bebas royalti (opsional)'],
    deliverables: ['File MP4 final', 'GIF version', 'Source file AE (opsional +Rp 200.000)'],
    duration: '7–10 hari kerja',
    image: 'photo-1535016120720-40c646be5580',
  },
]

const faqs = [
  {
    q: 'Bagaimana cara memesan jasa desain di FATZ DESIGN?',
    a: 'Kamu bisa langsung klik tombol "Beli via WhatsApp" di halaman jasa yang kamu minati, atau tambahkan ke keranjang dan checkout via WhatsApp. Tim kami akan merespons dalam 1×24 jam kerja.',
  },
  {
    q: 'Apakah ada konsultasi gratis sebelum memesan?',
    a: 'Tentu! Kamu bisa chat langsung ke WhatsApp kami untuk konsultasi singkat sebelum memutuskan. Kami senang membantu kamu memilih paket yang paling sesuai dengan kebutuhan dan budget.',
  },
  {
    q: 'Berapa kali revisi yang diberikan?',
    a: 'Setiap paket memiliki kuota revisi berbeda (tertera di detail jasa). Revisi tambahan di luar kuota dikenakan biaya Rp 75.000 per sesi revisi.',
  },
  {
    q: 'Metode pembayaran apa yang tersedia?',
    a: 'Kami menerima transfer bank (BCA, Mandiri, BRI, BNI), GoPay, OVO, DANA, dan QRIS. Pembayaran dilakukan 50% di depan sebelum pengerjaan dimulai.',
  },
  {
    q: 'Apakah saya mendapat hak cipta penuh atas desain?',
    a: 'Ya! Setelah pelunasan, seluruh hak cipta dan kepemilikan atas desain sepenuhnya menjadi milik kamu. Kami tidak akan menggunakan desain tersebut untuk klien lain.',
  },
  {
    q: 'Berapa lama proses pengerjaannya?',
    a: 'Durasi pengerjaan tertera di setiap paket dan berlaku sejak brief final disetujui. Kecepatan pengerjaan juga bergantung pada seberapa cepat kamu memberikan feedback/revisi.',
  },
  {
    q: 'Apakah bisa request desain di luar paket yang tersedia?',
    a: 'Bisa! Hubungi kami via WhatsApp untuk mendiskusikan kebutuhan custom kamu. Kami akan menyiapkan penawaran khusus (custom quote) berdasarkan scope pekerjaan.',
  },
  {
    q: 'Apakah file sumber/editable diberikan?',
    a: 'File editable (AI, PSD, Figma, dsb.) tersedia sebagai add-on berbayar kecuali dinyatakan sudah termasuk dalam paket. Detail tertera di bagian deliverables masing-masing paket.',
  },
]

// ─── Utilities ───────────────────────────────────────────────────────────────

function fmt(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function waLink(msg: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

function unsplash(id: string, w: number, h: number) {
  return `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format`
}

// ─── Components ──────────────────────────────────────────────────────────────

function Tag({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'accent' | 'primary' }) {
  const cls = {
    default: 'bg-[#1E1E1E] text-[#888880] border border-[#2A2A2A]',
    accent: 'bg-[#FF3D3D]/10 text-[#FF3D3D] border border-[#FF3D3D]/20',
    primary: 'bg-[#E8FF47]/10 text-[#E8FF47] border border-[#E8FF47]/20',
  }[variant]
  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-ui font-semibold tracking-widest uppercase rounded-sm ${cls}`}>
      {children}
    </span>
  )
}

function BtnPrimary({ children, onClick, href, className = '' }: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
}) {
  const cls = `inline-flex items-center gap-2 px-6 py-3.5 bg-[#E8FF47] text-[#0D0D0D] font-ui font-bold text-sm tracking-wide rounded-sm hover:bg-[#F5FF7A] active:scale-[0.98] transition-all duration-150 ${className}`
  if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
  return <button onClick={onClick} className={cls}>{children}</button>
}

function BtnOutline({ children, onClick, className = '' }: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-6 py-3.5 border border-[#2A2A2A] text-[#F0EFE8] font-ui font-semibold text-sm tracking-wide rounded-sm hover:border-[#E8FF47]/40 hover:text-[#E8FF47] active:scale-[0.98] transition-all duration-150 ${className}`}
    >
      {children}
    </button>
  )
}

function ServiceCard({ service, onView, onAdd }: {
  service: Service
  onView: (s: Service) => void
  onAdd: (s: Service) => void
}) {
  return (
    <div className="group relative bg-[#161616] border border-[#2A2A2A] rounded-sm overflow-hidden hover:border-[#E8FF47]/30 transition-colors duration-300 flex flex-col">
      {service.popular && (
        <div className="absolute top-3 right-3 z-10">
          <Tag variant="primary">Terlaris</Tag>
        </div>
      )}
      <div className="relative overflow-hidden h-48 bg-[#1A1A1A]">
        <img
          src={unsplash(service.image, 600, 400)}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
      </div>
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <Tag>{service.category}</Tag>
        </div>
        <div>
          <h3 className="font-ui font-bold text-lg text-[#F0EFE8] leading-tight">{service.name}</h3>
          <p className="text-sm text-[#888880] mt-1 leading-relaxed">{service.tagline}</p>
        </div>
        <div className="mt-auto pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
          <div>
            <p className="font-display text-xl text-[#E8FF47]">{service.priceLabel}</p>
            <p className="text-xs text-[#888880] font-ui mt-0.5">{service.duration}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAdd(service)}
              className="p-2.5 border border-[#2A2A2A] rounded-sm hover:border-[#E8FF47]/40 hover:text-[#E8FF47] transition-colors"
              title="Tambah ke keranjang"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            <BtnPrimary onClick={() => onView(service)} className="py-2.5 px-4 text-xs">
              Detail
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar({ page, setPage, cartCount }: { page: Page; setPage: (p: Page) => void; cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const links: { label: string; p: Page }[] = [
    { label: 'Beranda', p: 'home' },
    { label: 'Tentang', p: 'about' },
    { label: 'Jasa', p: 'services' },
    { label: 'FAQ', p: 'faq' },
    { label: 'Kontak', p: 'contact' },
  ]

  const nav = (p: Page) => { setPage(p); setMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1E1E1E] bg-[#0D0D0D]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => nav('home')} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E8FF47] flex items-center justify-center rounded-sm">
            <span className="font-display text-[#0D0D0D] text-sm leading-none">FD</span>
          </div>
          <span className="font-display text-[#F0EFE8] text-lg tracking-tight">FATZ DESIGN</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button
              key={l.p}
              onClick={() => nav(l.p)}
              className={`font-ui text-sm transition-colors ${page === l.p ? 'text-[#E8FF47]' : 'text-[#888880] hover:text-[#F0EFE8]'}`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav('cart')}
            className="relative p-2 text-[#888880] hover:text-[#F0EFE8] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E8FF47] text-[#0D0D0D] text-[10px] font-ui font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <BtnPrimary href={waLink('Halo FATZ DESIGN, saya ingin konsultasi desain')} className="hidden md:inline-flex py-2.5 px-4 text-xs">
            Konsultasi Gratis
          </BtnPrimary>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[#888880] hover:text-[#F0EFE8] transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1E1E1E] bg-[#0D0D0D] px-5 py-4 flex flex-col gap-4">
          {links.map(l => (
            <button key={l.p} onClick={() => nav(l.p)} className={`font-ui text-left text-sm ${page === l.p ? 'text-[#E8FF47]' : 'text-[#888880]'}`}>
              {l.label}
            </button>
          ))}
          <BtnPrimary href={waLink('Halo FATZ DESIGN, saya ingin konsultasi desain')} className="self-start py-2.5 px-4 text-xs">
            Konsultasi Gratis
          </BtnPrimary>
        </div>
      )}
    </header>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  const nav = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return (
    <footer className="border-t border-[#1E1E1E] mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-[#E8FF47] flex items-center justify-center rounded-sm">
              <span className="font-display text-[#0D0D0D] text-sm">FD</span>
            </div>
            <span className="font-display text-[#F0EFE8] text-lg tracking-tight">FATZ DESIGN</span>
          </div>
          <p className="text-[#888880] font-ui text-sm leading-relaxed max-w-xs">
            Studio desain grafis yang membantu brand kamu tumbuh lewat visual yang kuat, konsisten, dan berkarakter.
          </p>
          <div className="flex gap-3 mt-5">
            <a href={waLink('Halo FATZ DESIGN!')} target="_blank" rel="noreferrer"
              className="w-9 h-9 border border-[#2A2A2A] rounded-sm flex items-center justify-center text-[#888880] hover:text-[#E8FF47] hover:border-[#E8FF47]/30 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 border border-[#2A2A2A] rounded-sm flex items-center justify-center text-[#888880] hover:text-[#E8FF47] hover:border-[#E8FF47]/30 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
        </div>

        <div>
          <p className="font-ui font-semibold text-xs tracking-widest uppercase text-[#888880] mb-4">Navigasi</p>
          <ul className="space-y-3">
            {(['home', 'about', 'services', 'faq', 'contact'] as Page[]).map(p => {
              const labels: Record<string, string> = { home: 'Beranda', about: 'Tentang Kami', services: 'Jasa Kami', faq: 'FAQ', contact: 'Kontak' }
              return (
                <li key={p}>
                  <button onClick={() => nav(p)} className="font-ui text-sm text-[#888880] hover:text-[#F0EFE8] transition-colors">
                    {labels[p]}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="font-ui font-semibold text-xs tracking-widest uppercase text-[#888880] mb-4">Kontak</p>
          <ul className="space-y-3">
            <li className="font-ui text-sm text-[#888880]">fatzdesign@gmail.com</li>
            <li className="font-ui text-sm text-[#888880]">+62 895-1743-3444</li>
            <li className="font-ui text-sm text-[#888880]">Tangerang, Indonesia</li>
            <li className="font-ui text-sm text-[#888880]">Senin–Sabtu, 09.00–17.00</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-ui text-xs text-[#888880]">© 2024 FATZ DESIGN. All rights reserved.</p>
          <p className="font-ui text-xs text-[#888880]">Crafted with <span className="text-[#E8FF47]">♥</span> in Jakarta</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Pages ───────────────────────────────────────────────────────────────────

function HomePage({ setPage, onAdd }: { setPage: (p: Page) => void; onAdd: (s: Service) => void }) {
  const nav = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const marqueeItems = ['Logo Design', 'Brand Identity', 'Social Media Kit', 'Motion Graphics', 'Poster Design', 'Presentation', 'Logo Design', 'Brand Identity', 'Social Media Kit', 'Motion Graphics', 'Poster Design', 'Presentation']

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#E8FF4710_0%,_transparent_60%)]" />
        <div className="max-w-6xl mx-auto px-5 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Tag variant="primary">Studio Desain Jakarta</Tag>
              <h1 className="font-display text-5xl md:text-7xl text-[#F0EFE8] leading-[0.95] tracking-tight mt-6">
                Visual yang <span className="text-[#E8FF47]">berbicara</span> untuk brand-mu
              </h1>
              <p className="font-ui text-[#888880] text-base md:text-lg leading-relaxed mt-6 max-w-md">
                Kami merancang identitas visual yang kuat, konsisten, dan berkarakter — supaya brand kamu diingat, dipercaya, dan dipilih.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <BtnPrimary onClick={() => nav('services')}>
                  Lihat Semua Jasa
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </BtnPrimary>
                <BtnOutline onClick={() => nav('about')}>Tentang Kami</BtnOutline>
              </div>

              <div className="flex gap-8 mt-12 pt-8 border-t border-[#1E1E1E]">
                {[['150+', 'Proyek Selesai'], ['50+', 'Klien Puas'], ['3 Thn', 'Pengalaman']].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl text-[#E8FF47]">{n}</p>
                    <p className="font-ui text-xs text-[#888880] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 h-52 rounded-sm overflow-hidden bg-[#1A1A1A]">
                  <img src={unsplash('photo-1558655146-9f40138edfeb', 800, 400)} alt="Brand design work" className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="h-36 rounded-sm overflow-hidden bg-[#1A1A1A]">
                  <img src={unsplash('photo-1611162617213-7d7a39e9b1d7', 400, 300)} alt="Social media design" className="w-full h-full object-cover opacity-90" />
                </div>
                <div className="h-36 rounded-sm overflow-hidden bg-[#1A1A1A] flex items-center justify-center border border-[#2A2A2A]">
                  <div className="text-center p-4">
                    <p className="font-display text-3xl text-[#E8FF47]">Rp 199rb</p>
                    <p className="font-ui text-xs text-[#888880] mt-1">mulai dari</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 border-2 border-[#E8FF47]/20 rounded-sm" />
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#E8FF47]/5 rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-[#1E1E1E] py-4 overflow-hidden bg-[#161616]">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="font-display text-sm text-[#888880] uppercase tracking-widest shrink-0">
              {item} <span className="text-[#E8FF47] mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Services preview */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-end justify-between mb-12">
            <div>
              <Tag>Layanan Kami</Tag>
              <h2 className="font-display text-4xl md:text-5xl text-[#F0EFE8] leading-tight mt-4">
                Desain untuk<br />setiap kebutuhan
              </h2>
            </div>
            <BtnOutline onClick={() => nav('services')} className="hidden md:inline-flex">
              Semua Jasa →
            </BtnOutline>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.slice(0, 3).map(s => (
              <ServiceCard key={s.id} service={s}
                onView={() => { setPage('detail'); sessionStorage.setItem('detailId', s.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                onAdd={onAdd}
              />
            ))}
          </div>
          <div className="mt-6 md:hidden">
            <BtnOutline onClick={() => nav('services')} className="w-full justify-center">Lihat Semua Jasa →</BtnOutline>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 border-t border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square max-w-sm bg-[#161616] rounded-sm overflow-hidden border border-[#2A2A2A]">
                <img src={unsplash('photo-1561070791-2526d30994b5', 600, 600)} alt="Design process" className="w-full h-full object-cover opacity-80" />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#E8FF47] rounded-sm p-4 text-[#0D0D0D] max-w-[140px]">
                <p className="font-display text-2xl leading-none">4.9★</p>
                <p className="font-ui text-xs mt-1 font-semibold">Rating Rata-rata</p>
              </div>
            </div>
            <div>
              <Tag>Mengapa FATZ?</Tag>
              <h2 className="font-display text-4xl text-[#F0EFE8] leading-tight mt-4">
                Desain bukan sekadar tampilan — ini tentang hasil
              </h2>
              <p className="font-ui text-[#888880] text-sm leading-relaxed mt-4">
                Kami bukan hanya mendesain yang "bagus". Kami mendesain yang bekerja — yang meningkatkan kepercayaan, memperkuat brand, dan mendorong konversi.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  ['Proses terstruktur', 'Brief → konsep → revisi → deliver. Tidak ada yang terlewat.'],
                  ['Komunikasi responsif', 'Respons cepat via WhatsApp, update progres real-time.'],
                  ['Harga transparan', 'Tidak ada biaya tersembunyi. Apa yang tertera, itu yang dibayar.'],
                  ['Revisi termasuk', 'Setiap paket sudah include kuota revisi tanpa biaya tambahan.'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex gap-4">
                    <div className="w-5 h-5 mt-0.5 flex-shrink-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#E8FF47] rounded-full" />
                    </div>
                    <div>
                      <p className="font-ui font-semibold text-sm text-[#F0EFE8]">{title}</p>
                      <p className="font-ui text-xs text-[#888880] mt-0.5">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="bg-[#E8FF47] rounded-sm p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0D0D0D]/5 rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="relative">
              <p className="font-ui font-semibold text-xs tracking-widest uppercase text-[#0D0D0D]/60 mb-3">Mulai Sekarang</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#0D0D0D] leading-tight max-w-lg">
                Siap wujudkan visual brand impianmu?
              </h2>
              <p className="font-ui text-[#0D0D0D]/70 text-sm leading-relaxed mt-4 max-w-md">
                Konsultasi pertama gratis. Chat kami sekarang dan ceritakan kebutuhan designmu.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a
                  href={waLink('Halo FATZ DESIGN! Saya ingin konsultasi desain gratis')}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0D0D0D] text-[#F0EFE8] font-ui font-bold text-sm rounded-sm hover:bg-[#1A1A1A] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat WhatsApp
                </a>
                <button onClick={() => nav('services')} className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#0D0D0D]/20 text-[#0D0D0D] font-ui font-semibold text-sm rounded-sm hover:bg-[#0D0D0D]/5 transition-colors">
                  Lihat Paket Harga
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function AboutPage() {
  const team = [
    { name: 'Fauzan Atta', role: 'Founder & Creative Director', img: 'photo-1507003211169-0a1dd7228f2d' },
    { name: 'Tari Setiawan', role: 'Brand Designer', img: 'photo-1494790108377-be9c29b29330' },
    { name: 'Rizky Pratama', role: 'Motion Graphics Artist', img: 'photo-1500648767791-00dcc994a43e' },
  ]

  const values = [
    { icon: '◈', title: 'Kualitas Tanpa Kompromi', desc: 'Setiap piksel dikerjakan dengan penuh perhatian dan standar estetika yang tinggi.' },
    { icon: '◎', title: 'Komunikasi Terbuka', desc: 'Kami percaya kolaborasi yang baik dimulai dari transparansi dan komunikasi yang jujur.' },
    { icon: '◉', title: 'Deadline adalah Janji', desc: 'Kami menghormati waktu klien dan berkomitmen menyelesaikan pekerjaan tepat waktu.' },
    { icon: '◆', title: 'Desain Berbasis Tujuan', desc: 'Visual yang kami buat selalu dirancang untuk mencapai tujuan bisnis nyata klien.' },
  ]

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 border-b border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl">
            <Tag>Tentang Kami</Tag>
            <h1 className="font-display text-5xl md:text-6xl text-[#F0EFE8] leading-tight mt-6">
              Studio desain yang tumbuh bersama brand-mu
            </h1>
            <p className="font-ui text-[#888880] text-base leading-relaxed mt-6">
              FATZ DESIGN lahir pada 2021 dari satu keyakinan sederhana: setiap bisnis, sekecil apapun, berhak tampil dengan visual yang profesional dan berkarakter kuat. Kami ada untuk mewujudkan itu.
            </p>
          </div>
          <div className="mt-12 relative rounded-sm overflow-hidden h-72 bg-[#161616]">
            <img src={unsplash('photo-1497366216548-37526070297c', 1200, 500)} alt="FATZ DESIGN studio" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-3xl text-[#F0EFE8]">Berdiri sejak 2021</p>
              <p className="font-ui text-sm text-[#888880] mt-1">Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-display text-3xl text-[#F0EFE8]">Cerita kami</h2>
            <div className="space-y-4 mt-6 font-ui text-sm text-[#888880] leading-relaxed">
              <p>Berawal dari kamar kos berukuran 3×4 meter, Fauzan Atta mulai mengerjakan proyek desain freelance untuk UMKM lokal di sekitar Jakarta. Dengan modal laptop dan passion yang besar, ia membantu puluhan brand kecil tampil lebih profesional.</p>
              <p>Seiring bertambahnya klien dan kepercayaan, FATZ DESIGN berkembang menjadi studio desain kecil dengan tim yang berdedikasi. Kami bangga karena banyak klien awal kami yang kini sudah berkembang menjadi brand yang dikenal luas.</p>
              <p>Hari ini, FATZ DESIGN melayani berbagai jenis bisnis — dari startup teknologi, UMKM kuliner, hingga brand fashion lokal. Misi kami tetap sama: desain yang tidak hanya indah, tapi bekerja.</p>
            </div>
          </div>
          <div className="space-y-4">
            {values.map(v => (
              <div key={v.title} className="flex gap-4 p-4 bg-[#161616] border border-[#2A2A2A] rounded-sm">
                <div className="text-2xl text-[#E8FF47] leading-none mt-0.5">{v.icon}</div>
                <div>
                  <p className="font-ui font-semibold text-sm text-[#F0EFE8]">{v.title}</p>
                  <p className="font-ui text-xs text-[#888880] mt-1 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 border-t border-[#1E1E1E]">
        <div className="max-w-6xl mx-auto px-5">
          <Tag>Tim Kami</Tag>
          <h2 className="font-display text-4xl text-[#F0EFE8] mt-4 mb-10">Orang-orang di balik karya</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map(t => (
              <div key={t.name} className="bg-[#161616] border border-[#2A2A2A] rounded-sm overflow-hidden group">
                <div className="h-64 overflow-hidden bg-[#1A1A1A]">
                  <img src={unsplash(t.img, 400, 500)} alt={t.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                </div>
                <div className="p-5">
                  <p className="font-ui font-bold text-[#F0EFE8]">{t.name}</p>
                  <p className="font-ui text-xs text-[#E8FF47] mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ServicesPage({ setPage, onAdd }: { setPage: (p: Page) => void; onAdd: (s: Service) => void }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const categories = ['Semua', 'Branding', 'Digital', 'Print & Digital', 'Motion']
  const filtered = activeCategory === 'Semua' ? services : services.filter(s => s.category === activeCategory)

  return (
    <div className="pt-16">
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="mb-12">
            <Tag>Jasa Kami</Tag>
            <h1 className="font-display text-5xl md:text-6xl text-[#F0EFE8] leading-tight mt-6 max-w-lg">
              Pilih jasa yang tepat untuk brand-mu
            </h1>
            <p className="font-ui text-[#888880] text-sm leading-relaxed mt-4 max-w-md">
              Semua paket sudah include konsultasi awal, revisi, dan file final siap pakai.
            </p>
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 font-ui text-sm rounded-sm border transition-colors ${activeCategory === c ? 'bg-[#E8FF47] text-[#0D0D0D] border-[#E8FF47] font-semibold' : 'border-[#2A2A2A] text-[#888880] hover:border-[#E8FF47]/30 hover:text-[#F0EFE8]'}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <ServiceCard key={s.id} service={s}
                onView={() => { setPage('detail'); sessionStorage.setItem('detailId', s.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                onAdd={onAdd}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function DetailPage({ setPage, onAdd }: { setPage: (p: Page) => void; onAdd: (s: Service) => void }) {
  const [added, setAdded] = useState(false)
  const id = sessionStorage.getItem('detailId') || services[0].id
  const service = services.find(s => s.id === id) || services[0]

  const handleAdd = () => {
    onAdd(service)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waMsg = `Halo FATZ DESIGN! Saya ingin memesan:\n\n*${service.name}*\nHarga: ${service.priceLabel}\n\nMohon info selanjutnya 🙏`

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-5 py-24">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-ui text-sm text-[#888880] mb-8">
          <button onClick={() => { setPage('services'); window.scrollTo({ top: 0 }) }} className="hover:text-[#F0EFE8] transition-colors">Jasa</button>
          <span>/</span>
          <span className="text-[#F0EFE8]">{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-sm overflow-hidden h-72 bg-[#161616]">
              <img src={unsplash(service.image, 900, 500)} alt={service.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <Tag>{service.category}</Tag>
                {service.popular && <Tag variant="primary">Terlaris</Tag>}
              </div>
              <h1 className="font-display text-4xl text-[#F0EFE8] mt-4">{service.name}</h1>
              <p className="font-ui text-[#888880] text-sm leading-relaxed mt-4">{service.description}</p>
            </div>

            <div className="border border-[#2A2A2A] rounded-sm p-6">
              <h3 className="font-ui font-semibold text-sm text-[#F0EFE8] mb-4">Yang Termasuk dalam Paket</h3>
              <ul className="space-y-3">
                {service.features.map(f => (
                  <li key={f} className="flex items-start gap-3 font-ui text-sm text-[#888880]">
                    <svg className="w-4 h-4 mt-0.5 text-[#E8FF47] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-[#2A2A2A] rounded-sm p-6">
              <h3 className="font-ui font-semibold text-sm text-[#F0EFE8] mb-4">File yang Kamu Terima</h3>
              <ul className="space-y-2">
                {service.deliverables.map(d => (
                  <li key={d} className="flex items-center gap-3 font-ui text-sm text-[#888880]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#888880] flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#161616] border border-[#2A2A2A] rounded-sm p-6 sticky top-20">
              <p className="font-display text-3xl text-[#E8FF47]">{service.priceLabel}</p>
              <p className="font-ui text-xs text-[#888880] mt-1">Estimasi: {service.duration}</p>

              <div className="border-t border-[#2A2A2A] my-5" />

              <BtnPrimary href={waLink(waMsg)} className="w-full justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Beli via WhatsApp
              </BtnPrimary>

              <BtnOutline onClick={handleAdd} className="w-full justify-center">
                {added ? '✓ Ditambahkan!' : '+ Tambah ke Keranjang'}
              </BtnOutline>

              <div className="border-t border-[#2A2A2A] mt-5 pt-5 space-y-3">
                {[['Durasi', service.duration], ['Kategori', service.category], ['Revisi', service.features.find(f => f.includes('Revisi')) || 'Termasuk']].map(([k, v]) => (
                  <div key={k} className="flex justify-between font-ui text-xs">
                    <span className="text-[#888880]">{k}</span>
                    <span className="text-[#F0EFE8]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 bg-[#E8FF47]/5 border border-[#E8FF47]/20 rounded-sm">
                <p className="font-ui text-xs text-[#888880] leading-relaxed">
                  <span className="text-[#E8FF47] font-semibold">Konsultasi gratis</span> sebelum memesan. Chat kami dulu!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartPage({ cart, setCart, setPage }: {
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  setPage: (p: Page) => void
}) {
  const total = cart.reduce((sum, item) => sum + item.service.price * item.qty, 0)

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return setCart(cart.filter(i => i.service.id !== id))
    setCart(cart.map(i => i.service.id === id ? { ...i, qty } : i))
  }

  const updateNote = (id: string, note: string) => {
    setCart(cart.map(i => i.service.id === id ? { ...i, note } : i))
  }

  const checkoutMsg = cart.length === 0 ? '' : [
    'Halo FATZ DESIGN! Saya ingin memesan:',
    '',
    ...cart.map((item, i) => `${i + 1}. *${item.service.name}* (${item.qty}x) — ${fmt(item.service.price * item.qty)}${item.note ? `\n   Catatan: ${item.note}` : ''}`),
    '',
    `*Total: ${fmt(total)}*`,
    '',
    'Mohon info langkah selanjutnya 🙏',
  ].join('\n')

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-5 py-24">
        <Tag>Keranjang</Tag>
        <h1 className="font-display text-4xl text-[#F0EFE8] mt-4 mb-10">Keranjang Belanja</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#2A2A2A] rounded-sm">
            <div className="text-5xl mb-4">🛒</div>
            <p className="font-ui text-[#888880] text-sm mb-6">Keranjang kamu masih kosong</p>
            <BtnPrimary onClick={() => { setPage('services'); window.scrollTo({ top: 0 }) }}>Lihat Jasa Kami</BtnPrimary>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.service.id} className="bg-[#161616] border border-[#2A2A2A] rounded-sm p-5">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                      <img src={unsplash(item.service.image, 160, 160)} alt={item.service.name} className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Tag>{item.service.category}</Tag>
                          <p className="font-ui font-semibold text-[#F0EFE8] mt-1">{item.service.name}</p>
                          <p className="font-ui text-xs text-[#888880] mt-0.5">{item.service.duration}</p>
                        </div>
                        <button onClick={() => setCart(cart.filter(i => i.service.id !== item.service.id))} className="text-[#888880] hover:text-[#FF3D3D] transition-colors flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.service.id, item.qty - 1)} className="w-7 h-7 border border-[#2A2A2A] rounded-sm flex items-center justify-center text-[#888880] hover:border-[#E8FF47]/40 hover:text-[#E8FF47] transition-colors text-sm">−</button>
                          <span className="font-ui text-sm text-[#F0EFE8] w-5 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.service.id, item.qty + 1)} className="w-7 h-7 border border-[#2A2A2A] rounded-sm flex items-center justify-center text-[#888880] hover:border-[#E8FF47]/40 hover:text-[#E8FF47] transition-colors text-sm">+</button>
                        </div>
                        <p className="font-display text-lg text-[#E8FF47]">{fmt(item.service.price * item.qty)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
                    <textarea
                      value={item.note}
                      onChange={e => updateNote(item.service.id, e.target.value)}
                      placeholder="Catatan untuk desainer (opsional)..."
                      rows={2}
                      className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm px-3 py-2 font-ui text-xs text-[#888880] placeholder-[#444] focus:outline-none focus:border-[#E8FF47]/40 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-[#161616] border border-[#2A2A2A] rounded-sm p-6 sticky top-20">
                <h3 className="font-ui font-semibold text-sm text-[#F0EFE8] mb-4">Ringkasan Pesanan</h3>
                <div className="space-y-3 mb-5">
                  {cart.map(item => (
                    <div key={item.service.id} className="flex justify-between font-ui text-xs">
                      <span className="text-[#888880]">{item.service.name} ×{item.qty}</span>
                      <span className="text-[#F0EFE8]">{fmt(item.service.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#2A2A2A] pt-4 mb-5">
                  <div className="flex justify-between font-ui">
                    <span className="text-[#888880] text-sm">Total</span>
                    <span className="font-display text-xl text-[#E8FF47]">{fmt(total)}</span>
                  </div>
                </div>
                <a
                  href={waLink(checkoutMsg)}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#E8FF47] text-[#0D0D0D] font-ui font-bold text-sm rounded-sm hover:bg-[#F5FF7A] transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Checkout via WhatsApp
                </a>
                <p className="font-ui text-xs text-[#888880] text-center mt-3">
                  Tim kami akan merespons dalam 1×24 jam kerja
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="pt-16">
      <div className="max-w-3xl mx-auto px-5 py-24">
        <Tag>FAQ</Tag>
        <h1 className="font-display text-5xl text-[#F0EFE8] leading-tight mt-6 mb-4">
          Pertanyaan yang sering ditanyakan
        </h1>
        <p className="font-ui text-[#888880] text-sm leading-relaxed mb-12">
          Tidak menemukan jawaban yang kamu cari? Chat kami langsung via WhatsApp.
        </p>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-[#2A2A2A] rounded-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[#161616] transition-colors"
              >
                <span className="font-ui font-semibold text-sm text-[#F0EFE8] leading-snug">{faq.q}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`flex-shrink-0 text-[#888880] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && (
                <div className="px-5 pb-5 border-t border-[#2A2A2A]">
                  <p className="font-ui text-sm text-[#888880] leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#161616] border border-[#2A2A2A] rounded-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-ui font-semibold text-sm text-[#F0EFE8]">Masih ada pertanyaan?</p>
            <p className="font-ui text-xs text-[#888880] mt-1">Tim kami siap membantu kamu</p>
          </div>
          <BtnPrimary href={waLink('Halo FATZ DESIGN! Saya punya pertanyaan tentang jasa desain')}>
            Chat Sekarang
          </BtnPrimary>
        </div>
      </div>
    </div>
  )
}

function ContactPage() {
  const [form, setForm] = useState({ name: '', business: '', service: '', message: '' })

  const handleWa = () => {
    const msg = `Halo FATZ DESIGN!\n\n*Nama:* ${form.name}\n*Bisnis:* ${form.business}\n*Kebutuhan:* ${form.service}\n\n*Pesan:*\n${form.message}`
    window.open(waLink(msg), '_blank')
  }

  return (
    <div className="pt-16">
      <div className="max-w-6xl mx-auto px-5 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <Tag>Kontak</Tag>
            <h1 className="font-display text-5xl text-[#F0EFE8] leading-tight mt-6">
              Yuk, ngobrol tentang project-mu
            </h1>
            <p className="font-ui text-[#888880] text-sm leading-relaxed mt-4">
              Isi form ini dan kami akan menghubungi kamu via WhatsApp dalam 1×24 jam kerja. Atau langsung chat kami sekarang!
            </p>

            <div className="mt-10 space-y-5">
              {[
                { icon: '📍', label: 'Lokasi', val: 'Tangerang, Indonesia' },
                { icon: '📱', label: 'WhatsApp', val: '+62 895-1743-3444' },
                { icon: '📧', label: 'Email', val: 'fatzdesign@gmail.com' },
                { icon: '🕐', label: 'Jam Kerja', val: 'Senin–Sabtu, 09.00–17.00 WIB' },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="font-ui text-xs text-[#888880]">{item.label}</p>
                    <p className="font-ui text-sm text-[#F0EFE8] mt-0.5">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-[#161616] border border-[#2A2A2A] rounded-sm">
              <p className="font-ui text-xs text-[#888880] mb-3">Atau langsung chat kami:</p>
              <BtnPrimary href={waLink('Halo FATZ DESIGN! Saya ingin konsultasi desain')} className="w-full justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat WhatsApp Sekarang
              </BtnPrimary>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#2A2A2A] rounded-sm p-8">
            <h2 className="font-ui font-bold text-lg text-[#F0EFE8] mb-6">Kirim Pesan</h2>
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Nama Kamu *', placeholder: 'Ahmad Santoso' },
                { key: 'business', label: 'Nama Bisnis / Brand', placeholder: 'Warung Kopi Pak Budi' },
              ].map(field => (
                <div key={field.key}>
                  <label className="font-ui text-xs text-[#888880] block mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm px-4 py-2.5 font-ui text-sm text-[#F0EFE8] placeholder-[#444] focus:outline-none focus:border-[#E8FF47]/50 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="font-ui text-xs text-[#888880] block mb-1.5">Kebutuhan Desain</label>
                <select
                  value={form.service}
                  onChange={e => setForm({ ...form, service: e.target.value })}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm px-4 py-2.5 font-ui text-sm text-[#F0EFE8] focus:outline-none focus:border-[#E8FF47]/50 transition-colors appearance-none"
                >
                  <option value="">Pilih jenis jasa...</option>
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  <option value="Custom">Custom / Belum tahu</option>
                </select>
              </div>
              <div>
                <label className="font-ui text-xs text-[#888880] block mb-1.5">Ceritakan kebutuhanmu *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Ceritakan tentang bisnis kamu, apa yang ingin kamu desain, dan deadline jika ada..."
                  rows={4}
                  className="w-full bg-[#0D0D0D] border border-[#2A2A2A] rounded-sm px-4 py-2.5 font-ui text-sm text-[#F0EFE8] placeholder-[#444] focus:outline-none focus:border-[#E8FF47]/50 transition-colors resize-none"
                />
              </div>
              <button
                onClick={handleWa}
                disabled={!form.name || !form.message}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#E8FF47] text-[#0D0D0D] font-ui font-bold text-sm rounded-sm hover:bg-[#F5FF7A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Kirim via WhatsApp
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(i => i.service.id === service.id)
      if (existing) return prev.map(i => i.service.id === service.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { service, qty: 1, note: '' }]
    })
  }

  const navTo = (p: Page) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage setPage={navTo} onAdd={addToCart} />
      case 'about': return <AboutPage />
      case 'services': return <ServicesPage setPage={navTo} onAdd={addToCart} />
      case 'detail': return <DetailPage setPage={navTo} onAdd={addToCart} />
      case 'cart': return <CartPage cart={cart} setCart={setCart} setPage={navTo} />
      case 'faq': return <FaqPage />
      case 'contact': return <ContactPage />
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <div className="grain" aria-hidden="true" />
      <Navbar page={page} setPage={navTo} cartCount={cart.reduce((s, i) => s + i.qty, 0)} />
      <main>{renderPage()}</main>
      <Footer setPage={navTo} />
    </div>
  )
}
