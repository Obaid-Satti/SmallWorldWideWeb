export default function Home() {
  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="/">small web<span>.</span></a>
        <span className="identity">Browsing as <strong>Alex</strong></span>
      </header>
      <section className="welcome">
        <p className="eyebrow">A web made of small places</p>
        <h1>Where would you like to go?</h1>
        <p className="intro">Type an address to visit a site, or search for something to read.</p>
        <form className="address" action="/visit">
          <label className="sr-only" htmlFor="address">Address</label>
          <span aria-hidden="true">↗</span>
          <input id="address" name="address" placeholder="Try tidepool.zz" />
          <button type="submit">Go</button>
        </form>
        <form className="search" action="/search">
          <label className="sr-only" htmlFor="query">Search the web</label>
          <input id="query" name="q" placeholder="Search pages by their words…" />
          <button type="submit">Search</button>
        </form>
        <p className="setup-note">Your little corner of the web is getting ready.</p>
      </section>
      <footer>Small pages, connected by curiosity.</footer>
    </main>
  );
}
