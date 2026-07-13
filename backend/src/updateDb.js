import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'config', 'mock-db', 'movies.json');
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

data.forEach(movie => {
  if (movie.id === "html5-foundation") {
    movie.episodes = [
      {
        id: "html-ep1",
        number: 1,
        title: "Introduction to HTML5 & Web Structure",
        duration: "45m",
        sources: [
          { label: "Stream 1 (CDN)", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" },
          { label: "Mirror 2", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
        ]
      },
      {
        id: "html-ep2",
        number: 2,
        title: "Semantic Tags and Accessibilities",
        duration: "55m",
        sources: [
          { label: "Stream 1 (CDN)", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
        ]
      }
    ];
  } else if (movie.id === "css3-styling") {
    movie.episodes = [
      {
        id: "css-ep1",
        number: 1,
        title: "Episode 1: Mastering Flexbox and Grids",
        duration: "50m",
        sources: [
          { label: "youtube", url: "https://www.youtube.com/watch?v=szmFD-LTWHM&t=77s" }
        ]
      },
      ...Array.from({ length: 4 }, (_, i) => ({
        id: `css-ep${i + 2}`,
        number: i + 2,
        title: `Episode ${i + 2}: Mastering Flexbox and Grids`,
        duration: "50m",
        sources: [
          { label: "CDN Server", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
        ]
      }))
    ];
  } else if (movie.id === "javascript-logic") {
    movie.episodes = Array.from({ length: 6 }, (_, i) => ({
      id: `js-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: JavaScript Engines and Variables Scope`,
      duration: "1h 05m",
      sources: [
        { label: "HighSpeed Stream", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
      ]
    }));
  } else if (movie.id === "reactjs-atomic") {
    movie.episodes = Array.from({ length: 8 }, (_, i) => ({
      id: `react-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: Components Rendering & Virtual DOM`,
      duration: "45m",
      sources: [
        { label: "Fast CDN", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    }));
  } else if (movie.id === "vuejs-composition") {
    movie.episodes = Array.from({ length: 4 }, (_, i) => ({
      id: `vue-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: Composition API and Reactivity Ref`,
      duration: "40m",
      sources: [
        { label: "VueCDN", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
      ]
    }));
  } else if (movie.id === "nodejs-backend") {
    movie.episodes = [
      {
        id: "node-ep1",
        number: 1,
        title: "Full Backend Service Course",
        duration: "3h 15m",
        sources: [
          { label: "Highspeed CDN", url: "https://www.w3schools.com/html/movie.mp4" }
        ]
      }
    ];
  }
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully reset all episodes except CSS3 Ep 1 in movies.json!');
