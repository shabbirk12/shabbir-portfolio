// Curated Unsplash photos (free Unsplash License), one per theme.
// Helper appends consistent sizing/quality params.
function u(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`;
}

export const images = {
  codeDev: u("photo-1774901128302-e2bbd154da44"), // dark code editor screen
  restaurantInterior: u("photo-1745368036244-eda2fcbb9d45"), // modern minimal restaurant/lounge
  financeChart: u("photo-1611974789855-9c2a0a7236a3"), // trading/finance chart on screen
  concertCrowd: u("photo-1760966362386-e1012dbc3657"), // concert crowd, stage lights
  phoneChat: u("photo-1682941664177-7920d0e59418"), // phone with messaging app open
  hotelLobby: u("photo-1758193783649-13371d7fb8dd"), // modern luxury hotel lobby
};
