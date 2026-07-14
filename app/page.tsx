"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  edition: string;
  price: number;
  color: string;
  image: string;
  badge?: string;
  category: string;
};

type CartLine = Product & { quantity: number };

const products: Product[] = [
  { id: 1, name: "RIFT", edition: "Street Core · 18 cm", price: 42, color: "Cobalt", image: "/products/rift.png", badge: "NEW DROP", category: "Street Core" },
  { id: 2, name: "BUBBLES", edition: "Sidewalk Pop · 16 cm", price: 38, color: "Teal", image: "/products/bubbles.png", badge: "BESTSELLER", category: "New Drops" },
  { id: 3, name: "K.O. KID", edition: "After Dark · 20 cm", price: 49, color: "Volt", image: "/products/rift.png", badge: "12 LEFT", category: "New Drops" },
  { id: 4, name: "BYTE BUNNY", edition: "Block Party · 15 cm", price: 36, color: "Bubblegum", image: "/products/bubbles.png", category: "Minis" },
  { id: 5, name: "NOISE", edition: "Concrete Wave · 19 cm", price: 46, color: "Orange", image: "/products/rift.png", category: "Street Core" },
  { id: 6, name: "MISO", edition: "Mini Mischief · 13 cm", price: 31, color: "Mint", image: "/products/bubbles.png", category: "Minis" },
];

const money = (value: number) => `$${value.toFixed(2)}`;

export default function Home() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Figures");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("3dhive-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("3dhive-cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = useMemo(() => cart.reduce((sum, line) => sum + line.price * line.quantity, 0), [cart]);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount >= 75 ? 0 : 6.95;
  const total = subtotal - discount + shipping;
  const visibleProducts = activeFilter === "All Figures" ? products : products.filter((product) => product.category === activeFilter);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const exists = current.find((line) => line.id === product.id);
      return exists
        ? current.map((line) => line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { ...product, quantity: 1 }];
    });
    setNotice(`${product.name} joined your crew.`);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const changeQty = (id: number, delta: number) => {
    setCart((current) => current
      .map((line) => line.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter((line) => line.quantity > 0));
  };

  return (
    <main>
      <div className="ticker" aria-label="Store announcements">
        <div>FREE SHIPPING OVER $75 <span>✦</span> ORIGINAL CHARACTERS ONLY <span>✦</span> PRINTED IN SMALL BATCHES <span>✦</span> FREE SHIPPING OVER $75</div>
      </div>

      <header className="site-header">
        <a className="logo" href="#top" aria-label="3Dhive home"><span>3D</span>hive</a>
        <nav aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#drop">New drops</a>
          <a href="#custom">Build your own</a>
          <a href="#story">About</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`}>
          <span className="bag-icon" aria-hidden="true">▱</span> Cart <b>{cartCount}</b>
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="sticker">FRESH FROM THE PRINTER</div>
          <p className="eyebrow">ORIGINAL 3D-PRINTED FIGURINES</p>
          <h1>PRINTED<br/>TO BE<br/><em>LEGENDARY.</em></h1>
          <p className="hero-lede">Small-batch characters with loud personalities. Designed, printed, and finished for collectors who refuse boring shelves.</p>
          <div className="hero-actions">
            <a className="button primary" href="#shop">SHOP THE DROP <span>→</span></a>
            <a className="button secondary" href="#custom">BUILD YOUR OWN <span>↗</span></a>
          </div>
          <div className="micro-proof">
            <span><b>4.9/5</b> collector rating</span>
            <span><b>30-day</b> happy shelf promise</span>
          </div>
        </div>
        <div className="hero-stage" id="drop">
          <div className="burst">NEW<br/>DROP!</div>
          <img src="/products/hero-crew.png" alt="A crew of colorful original 3Dhive street figurines" />
          <div className="price-tag"><small>DROP 07</small><strong>FROM $31</strong><span>LIMITED RUN</span></div>
          <div className="scribble">YOUR SHELF<br/>NEEDS THIS! ↗</div>
        </div>
      </section>

      <section className="benefit-rail" aria-label="Product benefits">
        <div><b>★</b><span><strong>ORIGINAL CHARACTERS</strong>Made from zero, not copied.</span></div>
        <div><b>⬡</b><span><strong>PRINTED ON DEMAND</strong>Less waste. More personality.</span></div>
        <div><b>↺</b><span><strong>COLLECTOR CARE</strong>30-day easy returns.</span></div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div><p className="eyebrow">MEET THE CREW</p><h2>CHOOSE YOUR<br/><span>MAIN CHARACTER.</span></h2></div>
          <p>Every drop is printed in a limited run. Once a colorway clocks out, it may not come back.</p>
        </div>
        <div className="filter-row" aria-label="Product categories">
          {["All Figures", "New Drops", "Minis", "Street Core"].map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter.toUpperCase()}</button>)}
        </div>
        <div className="product-grid">
          {visibleProducts.map((product, index) => (
            <article className={`product-card card-${index % 3}`} key={product.id}>
              <div className="product-image">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button className="heart" aria-label={`Save ${product.name}`}>♡</button>
                <img src={product.image} alt={`${product.name} original 3D-printed figurine`} />
                <span className="quick-note">{product.color}</span>
              </div>
              <div className="product-info">
                <div><h3>{product.name}</h3><p>{product.edition}</p></div>
                <strong>{money(product.price)}</strong>
              </div>
              <button className="add-button" onClick={() => addToCart(product)}>ADD TO CART <span>＋</span></button>
            </article>
          ))}
        </div>
      </section>

      <section className="custom-section" id="custom">
        <div className="custom-art" aria-hidden="true"><div className="speech">YOU DREAM IT.<br/><b>WE PRINT IT!</b></div><img src="/products/bubbles.png" alt="" /><span className="comic-spark">ZAP!</span></div>
        <div className="custom-copy"><p className="eyebrow">YOUR IDEA, OFF THE SCREEN</p><h2>BUILD A FIGURE<br/><span>THAT IS 100% YOU.</span></h2><p>Send us a sketch, a character sheet, or just the idea in your head. Our artists turn it into a shelf-ready original—then we print, hand-finish, and ship it.</p><ol><li><b>01</b> Share your idea</li><li><b>02</b> Approve the 3D preview</li><li><b>03</b> Unbox your one-of-one</li></ol><a className="button primary" href="mailto:hello@3dhive.shop?subject=Custom figurine idea">START A CUSTOM FIGURE <span>→</span></a></div>
      </section>

      <section className="social-proof" id="story">
        <div className="proof-top"><p className="eyebrow">THE HIVE HAS SPOKEN</p><h2>LOUD SHELVES.<br/><span>HAPPY COLLECTORS.</span></h2><div className="rating-block"><strong>4.9</strong><span>★★★★★<small>FROM 280+ COLLECTORS</small></span></div></div>
        <div className="review-grid">
          <blockquote><div>★★★★★</div><p>“The print lines are part of the look and the colors hit even harder in person. RIFT owns my desk now.”</p><footer>— MARC, VERIFIED BUYER</footer></blockquote>
          <blockquote><div>★★★★★</div><p>“Packaging felt collector-grade and Bubbles arrived perfect. I ordered another one the same night.”</p><footer>— LINA, VERIFIED BUYER</footer></blockquote>
          <blockquote><div>★★★★★</div><p>“They turned my sketch into a real figure without losing its weird little personality. Unreal work.”</p><footer>— SAM, CUSTOM ORDER</footer></blockquote>
        </div>
      </section>

      <section className="faq-section">
        <div><p className="eyebrow">NO MYSTERY BOXES HERE</p><h2>QUESTIONS?<br/><span>WE GOT YOU.</span></h2></div>
        <div className="faq-list">
          <details open><summary>How long does printing take?<b>＋</b></summary><p>Ready-to-order figures usually leave our studio in 3–5 business days. Custom work takes 2–4 weeks after you approve the digital sculpt.</p></details>
          <details><summary>Are the characters original?<b>＋</b></summary><p>Yes. Every 3Dhive character is designed from scratch and belongs to our original universe.</p></details>
          <details><summary>What if my figure arrives damaged?<b>＋</b></summary><p>Send us a photo within 7 days and we will replace it. Every order also has a 30-day return window.</p></details>
          <details><summary>Do you ship internationally?<b>＋</b></summary><p>Yes. Available shipping options and estimated delivery times appear during checkout.</p></details>
        </div>
      </section>

      <section className="newsletter"><span>JOIN THE HIVE</span><div><h2>GET FIRST DIBS ON THE NEXT DROP.</h2><p>No spam. Just new characters, studio chaos, and collector-only codes.</p></div><form onSubmit={(event)=>{event.preventDefault();setNotice("You’re on the drop list!")}}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="YOUR EMAIL ADDRESS" required/><button>COUNT ME IN →</button></form></section>

      <footer className="footer"><a className="logo" href="#top"><span>3D</span>hive</a><p>Original characters. Small-batch attitude.<br/>Printed with care for loud shelves everywhere.</p><div><a href="#shop">Shop</a><a href="#custom">Custom figures</a><a href="#story">Our story</a><a href="mailto:hello@3dhive.shop">Contact</a></div><small>© 2026 3Dhive. All characters are original. · Privacy · Terms</small></footer>

      {cartOpen && <div className="scrim" onClick={() => setCartOpen(false)} />}
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen} aria-label="Shopping cart">
        <div className="cart-head"><div><p>YOUR CREW</p><h2>CART ({cartCount})</h2></div><button onClick={() => setCartOpen(false)} aria-label="Close cart">×</button></div>
        {cart.length === 0 ? (
          <div className="empty-cart"><div>?</div><h3>YOUR SHELF LOOKS LONELY.</h3><p>Add a character and start your crew.</p><button onClick={() => setCartOpen(false)}>MEET THE CREW</button></div>
        ) : (
          <>
            <div className="cart-lines">
              {cart.map((line) => <div className="cart-line" key={line.id}>
                <img src={line.image} alt="" />
                <div><h3>{line.name}</h3><p>{line.edition}</p><div className="quantity"><button onClick={() => changeQty(line.id, -1)}>−</button><span>{line.quantity}</span><button onClick={() => changeQty(line.id, 1)}>＋</button></div></div>
                <strong>{money(line.price * line.quantity)}</strong>
              </div>)}
            </div>
            <div className="cart-summary">
              <form className="promo-form" onSubmit={(event)=>{event.preventDefault();const entered=String(new FormData(event.currentTarget).get("promo")||"");setPromo(entered);setPromoApplied(entered.trim().toUpperCase()==="HIVE10")}}><input name="promo" value={promo} onChange={(event)=>setPromo(event.target.value)} placeholder="PROMO CODE" aria-label="Promo code"/><button type="submit">APPLY</button></form>
              {promo && !promoApplied && <p className="promo-hint">Try HIVE10 for 10% off.</p>}
              <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
              {promoApplied && <div className="discount-line"><span>HIVE10</span><strong>−{money(discount)}</strong></div>}
              <p>{subtotal >= 75 ? "You unlocked free shipping." : `${money(Math.max(0,75-subtotal))} away from free shipping.`}</p>
              <button type="button" onClick={() => setCheckoutOpen(true)}>CHECKOUT SECURELY →</button><small>Secure checkout · Easy returns · Collector-safe packaging</small>
            </div>
          </>
        )}
      </aside>

      {checkoutOpen && <div className="checkout-shell" role="dialog" aria-modal="true" aria-label="Checkout">
        <div className="checkout-panel">
          <button className="checkout-close" onClick={()=>{setCheckoutOpen(false);setOrderComplete(false)}} aria-label="Close checkout">×</button>
          {orderComplete ? <div className="order-done"><div>✓</div><p>ORDER #3D-{String(Date.now()).slice(-5)}</p><h2>YOUR CREW IS<br/>ON THE WAY!</h2><span>A confirmation has been prepared for your inbox.</span><button onClick={()=>{setCart([]);setCheckoutOpen(false);setCartOpen(false);setOrderComplete(false)}}>BACK TO THE HIVE</button></div> : <>
            <div className="checkout-title"><p>ONE LAST STEP</p><h2>SECURE CHECKOUT</h2></div>
            <form className="checkout-form" onSubmit={(event)=>{event.preventDefault();setOrderComplete(true)}}>
              <fieldset><legend>01 · CONTACT</legend><label>Email<input type="email" required placeholder="you@example.com"/></label></fieldset>
              <fieldset><legend>02 · SHIPPING</legend><div className="field-grid"><label>First name<input required/></label><label>Last name<input required/></label></div><label>Address<input required/></label><div className="field-grid"><label>City<input required/></label><label>Postal code<input required/></label></div><label>Country<select defaultValue=""><option value="" disabled>Select country</option><option>Lebanon</option><option>United States</option><option>United Kingdom</option><option>France</option><option>Germany</option><option>Other</option></select></label></fieldset>
              <fieldset><legend>03 · PAYMENT</legend><div className="demo-payment">DEMO CHECKOUT · CONNECT YOUR PAYMENT PROVIDER TO ACCEPT LIVE ORDERS</div><label>Card number<input inputMode="numeric" required placeholder="4242 4242 4242 4242" maxLength={19}/></label><div className="field-grid"><label>Expiry<input required placeholder="MM / YY"/></label><label>CVC<input required placeholder="123"/></label></div></fieldset>
              <div className="checkout-total"><div><span>Items</span><b>{money(subtotal)}</b></div>{promoApplied&&<div><span>Discount</span><b>−{money(discount)}</b></div>}<div><span>Shipping</span><b>{shipping===0?"FREE":money(shipping)}</b></div><div className="grand-total"><span>Total</span><b>{money(total)}</b></div></div>
              <button className="pay-button" type="submit">PLACE DEMO ORDER · {money(total)} →</button>
            </form>
          </>}
        </div>
      </div>}

      {notice && <div className="toast" role="status">✓ {notice}</div>}
    </main>
  );
}
