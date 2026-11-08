"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createEntryId } from "@/lib/entry-id";
import type { Site } from "@/types/site";

const ADDRESS_PATTERN = /^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;

const SITE_LINK_BRIDGE = `<script>
(function () {
  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || !event.data || event.data.type !== "small-web:restore-scroll") return;
    var x = Number(event.data.scrollX) || 0;
    var y = Number(event.data.scrollY) || 0;
    requestAnimationFrame(function () { window.scrollTo(x, y); });
  });

  window.addEventListener("scroll", function () {
    window.parent.postMessage({
      type: "small-web:save-scroll",
      scrollX: window.scrollX,
      scrollY: window.scrollY
    }, "*");
  }, { passive: true });

  document.addEventListener("click", function (event) {
    var target = event.target;
    var anchor = target instanceof Element ? target.closest("a[href]") : null;
    if (!anchor) return;

    var href = anchor.getAttribute("href");
    if (!href) return;
    href = href.trim();
    if (!href || href.charAt(0) === "#") return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !/^https?:/i.test(href)) return;

    var address = href;
    if (/^https?:/i.test(href) || /^\\/\\//.test(href)) {
      try {
        address = new URL(href, "https://smallweb.invalid").hostname;
      } catch (_) {
        return;
      }
    } else {
      address = href.replace(/^(?:\\.\\.\\/|\\.\\/)+/, "").split(/[/?#]/)[0];
    }

    window.parent.postMessage({ type: "small-web:navigate", address: address }, "*");
  }, true);
})();
</script>`;

function addSiteLinkBridge(html: string) {
  if (/<\/body\s*>/i.test(html)) {
    return html.replace(/<\/body\s*>/i, `${SITE_LINK_BRIDGE}</body>`);
  }
  return `${html}\n${SITE_LINK_BRIDGE}`;
}

export function SiteFrame({ site, entryId }: { site: Site; entryId: string }) {
  const router = useRouter();
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const storageKey = `small-web-page-state:${entryId}`;

    function handleFrameMessage(event: MessageEvent<unknown>) {
      if (event.source !== frameRef.current?.contentWindow) return;
      if (!event.data || typeof event.data !== "object") return;

      const message = event.data as { type?: unknown; address?: unknown; scrollX?: unknown; scrollY?: unknown };
      if (message.type === "small-web:save-scroll") {
        const scrollX = Number(message.scrollX);
        const scrollY = Number(message.scrollY);
        if (!Number.isFinite(scrollX) || !Number.isFinite(scrollY)) return;
        try {
          window.sessionStorage.setItem(storageKey, JSON.stringify({ scrollX, scrollY }));
        } catch {
          // Scrolling still works if browser storage is unavailable.
        }
        return;
      }

      if (message.type !== "small-web:navigate" || typeof message.address !== "string") return;

      const address = message.address.trim().toLowerCase();
      if (address.length > 253 || !ADDRESS_PATTERN.test(address)) return;

      router.push(`/visit?address=${encodeURIComponent(address)}&method=link&entry=${createEntryId()}`);
    }

    window.addEventListener("message", handleFrameMessage);
    return () => window.removeEventListener("message", handleFrameMessage);
  }, [entryId, router]);

  function restoreScrollPosition() {
    try {
      const saved = window.sessionStorage.getItem(`small-web-page-state:${entryId}`);
      if (!saved) return;
      const position = JSON.parse(saved) as { scrollX?: number; scrollY?: number };
      frameRef.current?.contentWindow?.postMessage({
        type: "small-web:restore-scroll",
        scrollX: position.scrollX ?? 0,
        scrollY: position.scrollY ?? 0,
      }, "*");
    } catch {
      // The page opens at the top if saved state cannot be read.
    }
  }

  return (
    <iframe
      ref={frameRef}
      onLoad={restoreScrollPosition}
      className="block min-h-[calc(100vh-6.25rem)] w-full flex-1 border-0 bg-white"
      title={`${site.title} — ${site.address}, written by ${site.author}`}
      sandbox="allow-scripts"
      srcDoc={addSiteLinkBridge(site.html)}
    />
  );
}
