export function killSmile() {
  return `<svg width="80" height="80" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="yellow" stroke="black" stroke-width="3"/>
                            <line x1="25" y1="30" x2="35" y2="40" stroke="black" stroke-width="3"/>
                            <line x1="35" y1="30" x2="25" y2="40" stroke="black" stroke-width="3"/>
                            <line x1="65" y1="30" x2="75" y2="40" stroke="black" stroke-width="3"/>
                            <line x1="75" y1="30" x2="65" y2="40" stroke="black" stroke-width="3"/>
                            <path d="M30 75 Q50 55, 70 75" stroke="black" stroke-width="3" fill="none"/>
                        </svg>`;
}

export function smileIsAlive() {
  return `<svg width="80" height="80" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="yellow" stroke="black" stroke-width="3"/>
                            <rect x="20" y="30" width="20" height="10" fill="black"/>
                            <rect x="60" y="30" width="20" height="10" fill="black"/>
                            <line x1="40" y1="35" x2="60" y2="35" stroke="black" stroke-width="3"/>
                            <path d="M30 65 Q50 85, 70 65" stroke="black" stroke-width="3" fill="none"/>
                        </svg>`;
}

export function drawMine() {
  return `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <!-- Shorter Spikes -->
          <line x1="50" y1="10" x2="50" y2="30" stroke="black" stroke-width="4"/>
          <line x1="50" y1="90" x2="50" y2="70" stroke="black" stroke-width="4"/>
          <line x1="10" y1="50" x2="30" y2="50" stroke="black" stroke-width="4"/>
          <line x1="90" y1="50" x2="70" y2="50" stroke="black" stroke-width="4"/>
          <line x1="25" y1="25" x2="35" y2="35" stroke="black" stroke-width="4"/>
          <line x1="75" y1="75" x2="65" y2="65" stroke="black" stroke-width="4"/>
          <line x1="75" y1="25" x2="65" y2="35" stroke="black" stroke-width="4"/>
          <line x1="25" y1="75" x2="35" y2="65" stroke="black" stroke-width="4"/>
          
          <!-- Mine body -->
          <circle cx="50" cy="50" r="20" fill="black" stroke="black" stroke-width="2"/>
          
          <!-- Highlight -->
          <circle cx="44" cy="44" r="5" fill="white"/>
      </svg>`;
}

export function drawFlag() {
  return `<svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="38" y="5" width="12" height="90" fill="black"/>
          <polygon points="50,10 90,30 50,50" fill="red"/>
          <rect x="20" y="90" width="60" height="15" fill="black"/>
      </svg>`;
}
