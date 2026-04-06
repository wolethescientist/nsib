export async function GET() {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100vh; overflow: hidden; background: #040d1a; }
    /* VesselFinder writes an <iframe> directly into the body — target it broadly */
    body > iframe,
    body > div > iframe,
    #aismap,
    #aismap iframe {
      width: 100% !important;
      height: 100vh !important;
      border: none !important;
      display: block !important;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    var width     = "100%";
    var height    = "100vh";
    var latitude  = "5.5";
    var longitude = "4.5";
    var zoom      = "6";
    var names     = false;
  </script>
  <script type="text/javascript" src="https://www.vesselfinder.com/aismap.js"></script>

  <script type="text/javascript">
    /* MutationObserver catches the iframe VesselFinder injects after its script runs */
    var observer = new MutationObserver(function () {
      document.querySelectorAll("iframe").forEach(function (f) {
        f.style.cssText = "width:100%!important;height:100vh!important;border:none!important;display:block!important;";
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
