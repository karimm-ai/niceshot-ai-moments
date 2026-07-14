// Reads ?video=VIDEO_ID&t=TIMESTAMP from the URL and, if present,
// shows an embedded Twitch player cued to that timestamp instead of
// sending the user to twitch.tv.
//
// Expected link format (set this as the URL for each row in your
// Data Studio table):
//   https://yourusername.github.io/yourrepo/?video=1234567890&t=01h23m45s
//
// "video" = the Twitch VOD id (the number in a twitch.tv/videos/XXXX URL)
// "t"     = the timestamp in Twitch's own format, e.g. 01h23m45s

(function () {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('video');
    const timestamp = params.get('t') || '0h0m0s';

    if (!videoId) return; // nothing to embed, just show the dashboard as normal

    const overlay = document.getElementById('twitch-overlay');
    const container = document.getElementById('twitch-player-container');
    const closeBtn = document.getElementById('twitch-close');

    // Twitch requires the embedding page's hostname to be passed as "parent".
    // window.location.hostname handles this automatically for GitHub Pages,
    // a custom domain, or localhost during testing.
    const parent = window.location.hostname;

    const iframe = document.createElement('iframe');
    iframe.src = `https://player.twitch.tv/?video=${encodeURIComponent(videoId)}` +
                 `&time=${encodeURIComponent(timestamp)}` +
                 `&parent=${encodeURIComponent(parent)}` +
                 `&autoplay=true`;
    iframe.allowFullscreen = true;
    iframe.setAttribute('allow', 'autoplay; fullscreen');

    container.appendChild(iframe);
    overlay.hidden = false;

    function closeOverlay() {
        overlay.hidden = true;
        container.innerHTML = ''; // stop playback
        // clean the URL so refreshing/sharing doesn't reopen the player
        const url = new URL(window.location.href);
        url.searchParams.delete('video');
        url.searchParams.delete('t');
        window.history.replaceState({}, '', url);
    }

    closeBtn.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeOverlay();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hidden) closeOverlay();
    });
})();
