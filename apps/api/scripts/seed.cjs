const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/small_web";
const sitesOnly = process.argv.includes("--sites-only");

const sampleSites = [
  {
    address: "tidepool.zz",
    title: "Notes from the tide pool",
    author: "Mara Finch",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Notes from the tide pool</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #f8fafc; }
    h1 { color: #0f172a; font-size: 2rem; margin-bottom: 0.5rem; }
    .tag { font-family: monospace; font-size: 0.75rem; letter-spacing: 0.1em; color: #2563eb; text-transform: uppercase; }
    a { color: #2563eb; text-decoration: underline; text-underline-offset: 3px; }
    a:hover { color: #1d4ed8; }
    .links-box { margin-top: 2rem; padding: 1rem; border-left: 3px solid #3b82f6; background: #eff6ff; }
  </style>
</head>
<body>
  <p class="tag">Field Notes · Coastal Journal</p>
  <h1>Notes from the tide pool</h1>
  <p>At low tide, the rock pools hold a small, quiet sky. Anemones fold themselves into the stone, and tiny shrimp flicker between ribbons of green seaweed.</p>
  <p>I come back when the water is going out, with a notebook and no particular plan. Each pool keeps a different weather. Along the lower shelf, you can spot miniature forests of kelp thriving in miniature basins.</p>
  <div class="links-box">
    <strong>Wander onwards:</strong>
    <ul>
      <li>Examine the crustose patterns on stone: <a href="lichen.zz">lichen.zz</a></li>
      <li>Carvings from the tide line: <a href="driftwood.zz">driftwood.zz</a></li>
      <li>Listen for the beacon at night: <a href="lighthouse.zz">lighthouse.zz</a></li>
      <li>Search for the mythical reef: <a href="lost-reef.zz">lost-reef.zz</a> (uncharted)</li>
    </ul>
  </div>
</body>
</html>`,
  },
  {
    address: "lichen.zz",
    title: "The Architecture of Stone and Lichen",
    author: "Julian Reid",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>The Architecture of Stone and Lichen</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.7; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #27272a; background: #fafaf9; }
    h1 { font-family: Georgia, serif; color: #18181b; font-size: 2.2rem; }
    .subtitle { color: #71717a; font-size: 0.9rem; margin-top: -0.5rem; }
    blockquote { border-left: 3px solid #78716c; margin: 1.5rem 0; padding-left: 1rem; font-style: italic; color: #57534e; }
    a { color: #0284c7; text-decoration: none; font-weight: 500; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>The Architecture of Stone and Lichen</h1>
  <p class="subtitle">By Julian Reid · Revised October</p>
  <p>Lichen is not a plant, nor is it an animal or a single fungus. It is a slow, patient agreement between fungi and algae that measures centuries in millimetres.</p>
  <blockquote>"Nothing on this granite is in a hurry. The yellow map-lichen on the northern face was already ancient when the jetty was built."</blockquote>
  <p>If you crouch close to the rock, the surface resembles an aerial map of archipelagos. Each circular colony expands outwards while its centre weathers into dust.</p>
  <p>Related notes:</p>
  <ul>
    <li>Back to the water: <a href="tidepool.zz">tidepool.zz</a></li>
    <li>Meditations in stillness: <a href="solitude.zz">solitude.zz</a></li>
    <li>Fossilized resins of antiquity: <a href="amber.zz">amber.zz</a></li>
    <li>Visit the ancient cairn: <a href="cairn-nowhere.zz">cairn-nowhere.zz</a> (abandoned)</li>
  </ul>
</body>
</html>`,
  },
  {
    address: "driftwood.zz",
    title: "Carvings from the Tide Line",
    author: "Julian Reid",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Carvings from the Tide Line</title>
  <style>
    body { font-family: ui-monospace, Menlo, monospace; line-height: 1.6; max-width: 640px; margin: 40px auto; padding: 0 20px; color: #334155; background: #f8fafc; }
    h1 { font-size: 1.5rem; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; }
    hr { border: 0; border-top: 1px dashed #cbd5e1; margin: 2rem 0; }
    a { color: #0d9488; }
  </style>
</head>
<body>
  <h1>Carvings from the Tide Line</h1>
  <p>Wood tossed in saltwater loses its grain's softness. Only the stubborn core remains, smoothed by quartz sands until it feels like tumbled bone.</p>
  <p>Item No. 42: Cedar branch, found three paces past the high water mark. Notched with two clean cuts from an old pocketknife.</p>
  <hr>
  <p>Next destinations:</p>
  <ul>
    <li>The high beacon: <a href="lighthouse.zz">lighthouse.zz</a></li>
    <li>Night sky mapping: <a href="stargaze.zz">stargaze.zz</a></li>
    <li>Back to the tide pools: <a href="tidepool.zz">tidepool.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "lighthouse.zz",
    title: "The Four-Second Sweep",
    author: "Mara Finch",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>The Four-Second Sweep</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #e2e8f0; background: #0f172a; }
    h1 { color: #f8fafc; font-size: 2.2rem; }
    .beam { color: #facc15; font-family: monospace; font-size: 0.8rem; letter-spacing: 0.15em; }
    a { color: #38bdf8; }
    a:hover { color: #7dd3fc; }
  </style>
</head>
<body>
  <p class="beam">FL (1) W 4s · 32m · 18M</p>
  <h1>The Four-Second Sweep</h1>
  <p>Every four seconds, a fan of white light slices across the bay. For three-quarters of a second, the wet stones on the beach turn silver. Then the dark rolls back in like deep water.</p>
  <p>When sea fog settles over the channel, the beam doesn't reach the horizon. It turns into a milky cone that illuminates swirling droplets suspended in cold air.</p>
  <p>Channels and signals:</p>
  <ul>
    <li>Acoustic warnings through mist: <a href="foghorn.zz">foghorn.zz</a></li>
    <li>Notes from the daytime shores: <a href="tidepool.zz">tidepool.zz</a></li>
    <li>The phantom vessel: <a href="ghost-ship.zz">ghost-ship.zz</a> (spectral)</li>
  </ul>
</body>
</html>`,
  },
  {
    address: "foghorn.zz",
    title: "Low Frequencies and Navigational Mist",
    author: "Elena Vance",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Low Frequencies and Navigational Mist</title>
  <style>
    body { font-family: -apple-system, sans-serif; line-height: 1.6; max-width: 660px; margin: 40px auto; padding: 0 20px; color: #374151; background: #f3f4f6; }
    h1 { font-size: 2rem; color: #111827; }
    .hz { font-size: 3rem; font-weight: 800; color: #9ca3af; line-height: 1; }
    a { color: #4f46e5; font-weight: 500; }
  </style>
</head>
<body>
  <div class="hz">110 Hz</div>
  <h1>Low Frequencies and Navigational Mist</h1>
  <p>Fog devours high frequencies. Bird calls and wave splashes vanish after thirty yards. Only the lowest pressure waves survive the heavy air, vibrating through hull timbers and human ribs.</p>
  <p>The diapower horn on Point Reyes vibrates at two precise tones: an initial blast followed by a lower undertone. It carries twelve nautical miles into the Pacific.</p>
  <p>Connections:</p>
  <ul>
    <li>The visual counterpart: <a href="lighthouse.zz">lighthouse.zz</a></li>
    <li>Cross-channel transit: <a href="ferryman.zz">ferryman.zz</a></li>
    <li>Tea while listening to rain: <a href="teahouse.zz">teahouse.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "ferryman.zz",
    title: "Timetables for the Strait",
    author: "Elena Vance",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Timetables for the Strait</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #1e293b; background: #ffffff; }
    h1 { font-family: Georgia, serif; font-size: 2rem; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; }
    a { color: #0284c7; }
  </style>
</head>
<body>
  <h1>Timetables for the Strait</h1>
  <p>Departures depend on tidal height and barometric pressure. The wooden ferry takes forty minutes to cross between the north slipway and the old cannery.</p>
  <table>
    <thead><tr><th>Departure</th><th>Vessel</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td>06:30</td><td>M/V Kittiwake</td><td>On Time</td></tr>
      <tr><td>11:15</td><td>M/V Cormorant</td><td>Subject to swell</td></tr>
      <tr><td>17:45</td><td>M/V Kittiwake</td><td>Evening run</td></tr>
    </tbody>
  </table>
  <p>Where to go while waiting:</p>
  <ul>
    <li>Shelter from the gale: <a href="teahouse.zz">teahouse.zz</a></li>
    <li>Check fog visibility: <a href="foghorn.zz">foghorn.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "teahouse.zz",
    title: "Steeping Leaves Under Corrugated Tin",
    author: "Samir K.",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Steeping Leaves Under Corrugated Tin</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.8; max-width: 640px; margin: 40px auto; padding: 0 20px; color: #44403c; background: #fefcf8; }
    h1 { color: #292524; font-size: 2rem; font-style: italic; }
    .recipe { background: #f7f3eb; padding: 1.25rem; border-radius: 6px; margin: 1.5rem 0; font-size: 0.95rem; }
    a { color: #854d0e; text-decoration: underline; }
  </style>
</head>
<body>
  <h1>Steeping Leaves Under Corrugated Tin</h1>
  <p>The best companion for sea rain is roasted barley and dry bancha. When heavy drops drum against the tin awning, the steam carries the scent of roasted grain into the corners of the room.</p>
  <div class="recipe">
    <strong>Afternoon Steep:</strong>
    <p>Five grams roasted kukicha, 90°C spring water, three minutes under a ceramic lid. Drink while the second downpour passes over the bay.</p>
  </div>
  <p>Continue your stroll:</p>
  <ul>
    <li>Twelve rules for quiet evenings: <a href="solitude.zz">solitude.zz</a></li>
    <li>Stargazing when clouds break: <a href="stargaze.zz">stargaze.zz</a></li>
    <li>The ferry departure bell: <a href="ferryman.zz">ferryman.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "solitude.zz",
    title: "Twelve Rules for Quiet Evenings",
    author: "Samir K.",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Twelve Rules for Quiet Evenings</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; max-width: 650px; margin: 40px auto; padding: 0 20px; color: #334155; background: #ffffff; }
    h1 { font-size: 2.1rem; color: #1e293b; }
    ol { padding-left: 1.25rem; }
    li { margin-bottom: 0.75rem; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Twelve Rules for Quiet Evenings</h1>
  <p>The small web is an antidote to the endless feed. Here are four principles practiced in this room:</p>
  <ol>
    <li>Do not refresh what is not moving.</li>
    <li>Read pages written by individuals with known names.</li>
    <li>Let an idea sit overnight before answering it.</li>
    <li>Extinguish bright lamps in favor of a single candle or warm incandescent wick.</li>
  </ol>
  <p>Quiet corners to visit next:</p>
  <ul>
    <li>The evening cup: <a href="teahouse.zz">teahouse.zz</a></li>
    <li>Fossil resin and deep time: <a href="amber.zz">amber.zz</a></li>
    <li>Slow lichen growth: <a href="lichen.zz">lichen.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "amber.zz",
    title: "Resin That Outlived Dynasties",
    author: "Kiran Patel",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Resin That Outlived Dynasties</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 660px; margin: 40px auto; padding: 0 20px; color: #3f3f46; background: #fffbeb; }
    h1 { font-family: Georgia, serif; font-size: 2.2rem; color: #78350f; }
    .amber-box { border: 2px solid #fde68a; background: #fef3c7; padding: 1.2rem; border-radius: 8px; margin: 1.5rem 0; }
    a { color: #b45309; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Resin That Outlived Dynasties</h1>
  <p>Forty million years ago, pine forests along the Baltic wept golden gum. Today, after winter storms roll the kelp beds onto the gravel, you can pick up drops of sunlight that predate human speech.</p>
  <div class="amber-box">
    <strong>Inclusion 19:</strong> Inside this honey-colored teardrop rests a tiny midge fly with wings spread in perpetual take-off.
  </div>
  <p>Related paths:</p>
  <ul>
    <li>The slow growth of lichen: <a href="lichen.zz">lichen.zz</a></li>
    <li>Looking up at constellations: <a href="stargaze.zz">stargaze.zz</a></li>
    <li>Stillness of the evening: <a href="solitude.zz">solitude.zz</a></li>
  </ul>
</body>
</html>`,
  },
  {
    address: "stargaze.zz",
    title: "Orion Rising Over the Winter Dunes",
    author: "Kiran Patel",
    html: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Orion Rising Over the Winter Dunes</title>
  <style>
    body { font-family: Georgia, serif; line-height: 1.7; max-width: 680px; margin: 40px auto; padding: 0 20px; color: #cbd5e1; background: #030712; }
    h1 { color: #f8fafc; font-size: 2.2rem; }
    .star { color: #38bdf8; font-family: monospace; }
    a { color: #67e8f9; }
  </style>
</head>
<body>
  <p class="star">RA 05h 55m · Dec +07° 24′</p>
  <h1>Orion Rising Over the Winter Dunes</h1>
  <p>When the coastal wind dies at midnight, Betelgeuse glows orange above the horizon like an ember blown from a beach campfire. The sand radiates away the last warmth of the afternoon.</p>
  <p>Out here, far from streetlights, the Milky Way arches from the sea cliff back across the coastal range.</p>
  <p>Retrace your steps:</p>
  <ul>
    <li>The four-second light beam: <a href="lighthouse.zz">lighthouse.zz</a></li>
    <li>Warm tea after midnight: <a href="teahouse.zz">teahouse.zz</a></li>
    <li>Back to the tide pools: <a href="tidepool.zz">tidepool.zz</a></li>
    <li>The abandoned telescope: <a href="lost-observatory.zz">lost-observatory.zz</a> (nowhere)</li>
  </ul>
</body>
</html>`,
  },
];

// Longer editorial sections make every seeded page feel like a small, distinct website.
const editorialSections = {
  "tidepool.zz": `<section class="story-section"><p class="eyebrow">A closer look · Pool 04</p><h2>A small world between the tides</h2><p>The pool beside the dark seam in the granite is the first to fill and the last to empty. Its rim is marked with tiny white shells, and a fringe of bladderwrack makes a roof that moves whenever the wind changes.</p><p>Look slowly and the water becomes a neighborhood. Periwinkles graze the sunlit edge, a beadlet anemone closes when a shadow passes, and a shore crab keeps to the narrow crack beneath the ledge.</p><aside class="note-card"><strong>Field note</strong><span>Best light: the hour after the tide turns. Bring a pencil; salt air is hard on ink.</span></aside></section>`,
  "lichen.zz": `<section class="story-section"><p class="eyebrow">A patient map · Granite coast</p><h2>Reading the colors on stone</h2><p>Grey-green patches prefer the damp side of the headland, while the orange crusts gather warmth on its southern face. Their borders are not sharp lines so much as negotiations with rain, salt, and the slow grinding of sand.</p><p>After a storm, the colors deepen. A hand lens reveals a miniature landscape of ridges and cups, each one holding a little water for the next dry afternoon.</p><aside class="note-card"><strong>Try this</strong><span>Return to the same rock next season. Mark its outline in a notebook instead of touching the colony.</span></aside></section>`,
  "driftwood.zz": `<section class="story-section"><p class="eyebrow">Object study · Collection 42</p><h2>What the sea leaves behind</h2><p>The branch has a pale stripe where it rested against a rock and a darkened end where it spent a winter rolling in the surf. Its old grain is still visible, but every sharp edge has been softened by water and sand.</p><p>On the beach, driftwood makes a temporary archive. A knot may hold a trace of the forest it came from; a clean break tells the story of the last storm more clearly than any label.</p><aside class="note-card"><strong>Collected details</strong><span>Cedar · hand length: 31 cm · found above the spring tide line · left where it was found</span></aside></section>`,
  "lighthouse.zz": `<section class="story-section"><p class="eyebrow">Night log · North head</p><h2>Keeping time in the dark</h2><p>From the path below, the lantern room appears and disappears behind the headland. The keeper marks each change in visibility, even when the sea seems empty and the beam has no vessel to find.</p><p>Tonight the cloud ceiling is low. Light travels only a short distance before it meets fog, yet that small bright circle is enough to show the harbor mouth and the line of the outer rocks.</p><aside class="note-card"><strong>Keeper’s log · 21:40</strong><span>Wind west by northwest. Visibility fair. One bell heard from the channel.</span></aside></section>`,
  "foghorn.zz": `<section class="story-section"><p class="eyebrow">Soundings · Channel station</p><h2>How a low note finds its way</h2><p>A horn is useful because fog changes what a sailor can see, not where the shoreline is. The signal gives the darkness a shape: one long note from the headland, followed by a pause long enough to count.</p><p>Inside the station, a brass dial records each sounding. The walls vibrate gently, and cups on the shelf answer with a faint, ordinary rattle.</p><aside class="note-card"><strong>Signal pattern</strong><span>One long blast · 30 seconds of quiet · repeat while visibility is poor.</span></aside></section>`,
  "ferryman.zz": `<section class="story-section"><p class="eyebrow">Crossing notes · North slipway</p><h2>A forty-minute passage</h2><p>The crossing is short on a map and longer when the tide runs against the boat. Passengers usually gather on the sheltered side, where the crew can call names without raising their voices above the engine.</p><p>On clear mornings, the old cannery appears first as a red roof. On misty afternoons, the ferry follows the bell from the opposite shore and arrives with its railings beaded in salt water.</p><aside class="note-card"><strong>Before you board</strong><span>Arrive a few minutes early. The final evening crossing waits for no one once the harbor light comes on.</span></aside></section>`,
  "teahouse.zz": `<section class="story-section"><p class="eyebrow">Kitchen notebook · Rainy afternoons</p><h2>A slower cup of tea</h2><p>Warm the pot first, then let the leaves rest for a breath before adding water. The first pour is light and grassy; a second steep brings out the toasted sweetness that suits a wet walk home.</p><p>There is a bench beside the window for anyone waiting out the weather. From there you can watch the ferry turn at the channel marker and the rain travel across the bay in soft grey bands.</p><aside class="note-card"><strong>On the counter today</strong><span>Roasted barley tea, a bowl of mandarins, and a jar of ginger biscuits for the walk.</span></aside></section>`,
  "solitude.zz": `<section class="story-section"><p class="eyebrow">A practice, not a rulebook</p><h2>Make room for an unhurried hour</h2><p>Quiet is not the absence of sound. It is the moment when the kettle, the rain, and the house settle into the same rhythm. Put the phone in another room and give one page your full attention.</p><p>If a thought keeps returning, write it down without trying to solve it. A short walk after supper often gives the mind enough space to finish the sentence on its own.</p><aside class="note-card"><strong>Tonight’s small plan</strong><span>Make tea · open the window a little · read until the lighthouse makes its next sweep.</span></aside></section>`,
  "amber.zz": `<section class="story-section"><p class="eyebrow">Natural history · Cabinet 3</p><h2>A forest held in a drop</h2><p>Resin begins as a tree’s response to a wound. Before it hardens, it can catch pollen, a wing, or a grain of dust; over deep time, those small accidents become a record of a vanished forest.</p><p>The inclusions are not perfectly preserved worlds. Their edges are clouded, and the resin itself carries tiny fractures from pressure and age. That is part of what makes each specimen feel particular.</p><aside class="note-card"><strong>Looking closely</strong><span>Turn the specimen toward indirect light. A dark backing often makes fine details easier to see.</span></aside></section>`,
  "stargaze.zz": `<section class="story-section"><p class="eyebrow">Winter sky · Dune overlook</p><h2>Find the belt, then take your time</h2><p>Orion rises slowly above the waterline. Three bright stars make an easy starting point; from there, look for the reddish glow of Betelgeuse and the colder blue-white light of Rigel.</p><p>Give your eyes several minutes to adjust. The fainter stars appear one by one, and the dark between the constellations begins to look less empty.</p><aside class="note-card"><strong>Tonight’s small kit</strong><span>A warm layer, a dim red light, and a notebook for the patterns you want to remember.</span></aside></section>`,
};

const sharedPageStyles = `<style>
  * { box-sizing: border-box; }
  body { max-width: none !important; min-height: 100vh; margin: 0 !important; padding: 22px !important; }
  .site-masthead { display: flex; justify-content: space-between; gap: 12px; max-width: 820px; margin: 0 auto 14px; padding: 0 4px; color: inherit; opacity: .72; font: 10px/1.4 ui-monospace, monospace; letter-spacing: .12em; text-transform: uppercase; }
  .site-content { max-width: 820px; margin: 0 auto; padding: clamp(26px, 6vw, 68px); border: 1px solid color-mix(in srgb, currentColor 13%, transparent); border-radius: 24px; background: color-mix(in srgb, currentColor 3%, transparent); box-shadow: 0 18px 50px color-mix(in srgb, currentColor 8%, transparent); }
  h1 { max-width: 16ch; margin-top: 12px; font-size: clamp(2.1rem, 6vw, 4rem) !important; line-height: 1.04; letter-spacing: -.045em; }
  h2 { margin: 0 0 14px; font-size: clamp(1.35rem, 3vw, 1.8rem); line-height: 1.2; letter-spacing: -.025em; }
  p { max-width: 66ch; }
  .eyebrow { margin: 0 0 12px; font: 10px/1.4 ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; opacity: .68; }
  .story-section { margin: 38px 0; padding-top: 28px; border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent); }
  .story-section p:not(.eyebrow) { font-size: 1.02rem; }
  .note-card { display: grid; gap: 6px; margin: 22px 0; padding: 16px 18px; border: 1px solid color-mix(in srgb, currentColor 15%, transparent); border-radius: 14px; background: color-mix(in srgb, currentColor 5%, transparent); font-size: .92rem; }
  ul { padding-left: 1.2rem; }
  li { margin: .55rem 0; }
  a { text-underline-offset: 3px; }
  img, table { max-width: 100%; }
  @media (max-width: 540px) { body { padding: 12px !important; } .site-masthead { font-size: 8px; } .site-content { padding: 26px 20px; border-radius: 18px; } }
</style>`;

for (const site of sampleSites) {
  const section = editorialSections[site.address];
  const insertionPoints = {
    "tidepool.zz": '<div class="links-box">',
    "lichen.zz": "<blockquote>",
    "driftwood.zz": "<hr>",
    "lighthouse.zz": "<p>Channels and signals:</p>",
    "foghorn.zz": "<p>Connections:</p>",
    "ferryman.zz": "<table>",
    "teahouse.zz": "  <p>Continue your stroll:</p>",
    "solitude.zz": "  <ol>",
    "amber.zz": "  <div class=\"amber-box\">",
    "stargaze.zz": "  <p>Retrace your steps:</p>",
  };
  site.html = site.html
    .replace("</head>", `${sharedPageStyles}</head>`)
    .replace("<body>", `<body><div class="site-masthead"><span>The Small Web · Field Journal</span><span>${site.address} · ${site.author}</span></div><main class="site-content">`)
    .replace(insertionPoints[site.address], `${section}\n  ${insertionPoints[site.address]}`)
    .replace("</body>", `<footer class="eyebrow">An independent page in the small web · ${site.address}</footer></main></body>`);
}

const people = [
  "Obaid Satti",
  "Ayesha Khan",
  "Hamza Ali",
  "Fatima Noor",
  "Zain Ahmed",
];

// 1 hour of browsing history: spread across the last 60 minutes
function generateVisits() {
  const baseTime = Date.now();
  const visits = [];

  // Obaid Satti: has been nearly everywhere! An extensive trail through the web
  const alexTrail = [
    { address: "tidepool.zz", title: "Notes from the tide pool", method: "typed", offsetMins: 58 },
    { address: "lichen.zz", title: "The Architecture of Stone and Lichen", method: "link", offsetMins: 54 },
    { address: "amber.zz", title: "Resin That Outlived Dynasties", method: "link", offsetMins: 49 },
    { address: "stargaze.zz", title: "Orion Rising Over the Winter Dunes", method: "link", offsetMins: 45 },
    { address: "lost-observatory.zz", title: "Nowhere", method: "link", offsetMins: 42 }, // broken link!
    { address: "stargaze.zz", title: "Orion Rising Over the Winter Dunes", method: "history", offsetMins: 40 },
    { address: "lighthouse.zz", title: "The Four-Second Sweep", method: "link", offsetMins: 35 },
    { address: "foghorn.zz", title: "Low Frequencies and Navigational Mist", method: "link", offsetMins: 30 },
    { address: "ferryman.zz", title: "Timetables for the Strait", method: "link", offsetMins: 25 },
    { address: "teahouse.zz", title: "Steeping Leaves Under Corrugated Tin", method: "link", offsetMins: 20 },
    { address: "solitude.zz", title: "Twelve Rules for Quiet Evenings", method: "link", offsetMins: 15 },
    { address: "tidepool.zz", title: "Notes from the tide pool", method: "typed", offsetMins: 8 },
    { address: "driftwood.zz", title: "Carvings from the Tide Line", method: "link", offsetMins: 4 },
  ];

  for (const v of alexTrail) {
    visits.push({
      person: "Obaid Satti",
      address: v.address,
      title: v.title,
      method: v.method,
      visitedAt: new Date(baseTime - v.offsetMins * 60 * 1000),
    });
  }

  // Ayesha Khan: visited a few pages and checked the foghorn
  const maraTrail = [
    { address: "tidepool.zz", title: "Notes from the tide pool", method: "typed", offsetMins: 55 },
    { address: "lighthouse.zz", title: "The Four-Second Sweep", method: "typed", offsetMins: 43 },
    { address: "ghost-ship.zz", title: "Nowhere", method: "link", offsetMins: 41 },
    { address: "lighthouse.zz", title: "The Four-Second Sweep", method: "history", offsetMins: 39 },
    { address: "foghorn.zz", title: "Low Frequencies and Navigational Mist", method: "link", offsetMins: 22 },
    { address: "teahouse.zz", title: "Steeping Leaves Under Corrugated Tin", method: "link", offsetMins: 10 },
  ];

  for (const v of maraTrail) {
    visits.push({
      person: "Ayesha Khan",
      address: v.address,
      title: v.title,
      method: v.method,
      visitedAt: new Date(baseTime - v.offsetMins * 60 * 1000),
    });
  }

  // Hamza Ali: navigational journey
  const elenaTrail = [
    { address: "foghorn.zz", title: "Low Frequencies and Navigational Mist", method: "typed", offsetMins: 50 },
    { address: "ferryman.zz", title: "Timetables for the Strait", method: "link", offsetMins: 38 },
    { address: "teahouse.zz", title: "Steeping Leaves Under Corrugated Tin", method: "link", offsetMins: 28 },
    { address: "solitude.zz", title: "Twelve Rules for Quiet Evenings", method: "link", offsetMins: 12 },
  ];

  for (const v of elenaTrail) {
    visits.push({
      person: "Hamza Ali",
      address: v.address,
      title: v.title,
      method: v.method,
      visitedAt: new Date(baseTime - v.offsetMins * 60 * 1000),
    });
  }

  // Fatima Noor: stone and wood exploration
  const julianTrail = [
    { address: "lichen.zz", title: "The Architecture of Stone and Lichen", method: "typed", offsetMins: 48 },
    { address: "driftwood.zz", title: "Carvings from the Tide Line", method: "typed", offsetMins: 32 },
    { address: "tidepool.zz", title: "Notes from the tide pool", method: "link", offsetMins: 18 },
  ];

  for (const v of julianTrail) {
    visits.push({
      person: "Fatima Noor",
      address: v.address,
      title: v.title,
      method: v.method,
      visitedAt: new Date(baseTime - v.offsetMins * 60 * 1000),
    });
  }

  // Zain Ahmed: peaceful evening browsing
  const samirTrail = [
    { address: "teahouse.zz", title: "Steeping Leaves Under Corrugated Tin", method: "typed", offsetMins: 52 },
    { address: "solitude.zz", title: "Twelve Rules for Quiet Evenings", method: "link", offsetMins: 36 },
    { address: "amber.zz", title: "Resin That Outlived Dynasties", method: "link", offsetMins: 21 },
    { address: "stargaze.zz", title: "Orion Rising Over the Winter Dunes", method: "link", offsetMins: 6 },
  ];

  for (const v of samirTrail) {
    visits.push({
      person: "Zain Ahmed",
      address: v.address,
      title: v.title,
      method: v.method,
      visitedAt: new Date(baseTime - v.offsetMins * 60 * 1000),
    });
  }

  return visits;
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  const sitesColl = mongoose.connection.collection("sites");
  const visitsColl = mongoose.connection.collection("visits");
  const peopleColl = mongoose.connection.collection("people");

  if (!sitesOnly) {
    await peopleColl.deleteMany({ name: { $nin: people } });
    for (const name of people) {
      await peopleColl.updateOne(
        { name },
        { $setOnInsert: { name, createdAt: new Date("2026-01-01T09:00:00.000Z") } },
        { upsert: true },
      );
    }
    console.log(`Seeded ${people.length} browsing names.`);
  }

  // Upsert sites idempotently
  let insertedSites = 0;
  let updatedSites = 0;

  for (const site of sampleSites) {
    const res = await sitesColl.updateOne(
      { address: site.address },
      {
        $set: {
          title: site.title,
          author: site.author,
          html: site.html,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          address: site.address,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
    if (res.upsertedCount > 0) insertedSites++;
    else updatedSites++;
  }

  console.log(`Seeded ${sampleSites.length} sites (${insertedSites} inserted, ${updatedSites} updated).`);

  // Ensure text index on sites collection
  try {
    await sitesColl.createIndex({ title: "text", html: "text", author: "text" });
  } catch (e) {
    // Index may already exist
  }

  if (!sitesOnly) {
    // Reset and seed 1 hour of browsing history across personas
    await visitsColl.deleteMany({});
    const visits = generateVisits();
    await visitsColl.insertMany(visits);
    console.log(`Seeded ${visits.length} visits across ${people.length} people over the past hour.`);
  }

  console.log("Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("Could not seed MongoDB:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
