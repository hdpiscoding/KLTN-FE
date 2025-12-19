/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Create cluster renderer with theme color
 */
export const createClusterRenderer = (themeColor: string = '#1e40af') => {
    return {
        render: ({count, position}: any) => {
            // Use default cluster style but with custom color
            const svg = `
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 240 240"
                width="60"
                height="60"
            >
                <defs>
                    <filter id="cluster-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
                        <feOffset dx="0" dy="4" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.35" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <circle
                    cx="120"
                    cy="120"
                    r="96"
                    fill="${themeColor}"
                    opacity="0.15"
                />

                <circle
                    cx="120"
                    cy="120"
                    r="72"
                    fill="${themeColor}"
                    stroke="#ffffff"
                    stroke-width="6"
                    filter="url(#cluster-shadow)"
                />

                <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    fill="#ffffff"
                    font-size="55"
                    font-family="Roboto, Arial, sans-serif"
                    font-weight="600"
                >
                    ${count}
                </text>
            </svg>
            `;


            const parser = new DOMParser();
            const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
            svgEl.setAttribute('transform', 'translate(0 25)');

            // Handle position - it can be LatLng with lat()/lng() methods or LatLngLiteral
            const pos = typeof position.lat === 'function'
                ? {lat: position.lat(), lng: position.lng()}
                : position;

            return new google.maps.marker.AdvancedMarkerElement({
                position: pos,
                content: svgEl,
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
        },
    };
};

