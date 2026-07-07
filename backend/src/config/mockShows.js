export const MOCK_SHOWS = [
  {
    id: "html5-foundation",
    title: "HTML5: Structure and Semantics",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&auto=format&fit=crop&q=80",
    rating: 9.3,
    quality: "4K HD",
    year: 2026,
    status: "Completed",
    country: "USA",
    synopsis: "Learn the fundamentals of web page design. Understand semantic HTML5 tags, document structures, meta tags, search engine optimization best practices, forms validation, and accessibility standards.",
    genres: ["HTML5", "Frontend", "Structure", "Basics"],
    episodes: [
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
    ],
    comments: [
      { id: "c1", user: "WebLearner", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=learner", text: "This HTML tutorial laid a solid foundation for me. Highly recommended!", date: "2 days ago" }
    ]
  },
  {
    id: "css3-styling",
    title: "CSS3: Cinematic Layouts & Animations",
    type: "Drama",
    poster: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    rating: 9.5,
    quality: "Ultra HD",
    year: 2026,
    status: "Completed",
    country: "USA",
    synopsis: "Unlock the power of styling sheets. Master Flexbox alignment patterns, Grid layouts, keyframe animations, transition effects, CSS variables, and modern visual trends such as Glassmorphic components.",
    genres: ["CSS3", "Design", "Aesthetics", "Responsive"],
    episodes: Array.from({ length: 5 }, (_, i) => ({
      id: `css-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: Mastering Flexbox and Grids`,
      duration: "50m",
      sources: [
        { label: "CDN Server", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    })),
    comments: []
  },
  {
    id: "javascript-logic",
    title: "JavaScript: Modern Logic & ES6",
    type: "Drama",
    poster: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&auto=format&fit=crop&q=80",
    rating: 9.6,
    quality: "Ultra HD",
    year: 2026,
    status: "Completed",
    country: "USA",
    synopsis: "Dive deep into scripting logic. Master variables hoisting, scopes, event looping, promises, asynchronous await patterns, localStorage integrations, and modern ES6 functions.",
    genres: ["JavaScript", "Logic", "Asynchronous", "Core"],
    episodes: Array.from({ length: 6 }, (_, i) => ({
      id: `js-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: JavaScript Engines and Variables Scope`,
      duration: "1h 05m",
      sources: [
        { label: "HighSpeed Stream", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
      ]
    })),
    comments: []
  },
  {
    id: "reactjs-atomic",
    title: "React JS: Functional Components & Hooks",
    type: "Anime",
    poster: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    rating: 9.8,
    quality: "4K HD",
    year: 2026,
    status: "Ongoing",
    country: "USA",
    synopsis: "Build scalable web applications with React. Discover state management using useState, side-effects triggering with useEffect, context APIs, custom hook abstractions, and router controllers.",
    genres: ["React", "Frameworks", "Components", "Hooks"],
    episodes: Array.from({ length: 8 }, (_, i) => ({
      id: `react-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: Components Rendering & Virtual DOM`,
      duration: "45m",
      sources: [
        { label: "Fast CDN", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
      ]
    })),
    comments: []
  },
  {
    id: "vuejs-composition",
    title: "Vue JS: Composition API & Reactivity",
    type: "Anime",
    poster: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    rating: 9.4,
    quality: "HD",
    year: 2026,
    status: "Completed",
    country: "USA",
    synopsis: "Build lightweight applications with Vue. Explore the reactivity compiler, ref vs reactive models, computed watchers, slots routing, pinia store, and modular project scaffolds.",
    genres: ["Vue", "Frameworks", "Reactivity", "Modular"],
    episodes: Array.from({ length: 4 }, (_, i) => ({
      id: `vue-ep${i + 1}`,
      number: i + 1,
      title: `Episode ${i + 1}: Composition API and Reactivity Ref`,
      duration: "40m",
      sources: [
        { label: "VueCDN", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
      ]
    })),
    comments: []
  },
  {
    id: "nodejs-backend",
    title: "Node.js: Backend API Architectures",
    type: "Movie",
    poster: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=60",
    banner: "https://images.unsplash.com/photo-1627856014757-195f1624b4f0?w=1200&auto=format&fit=crop&q=80",
    rating: 9.7,
    quality: "4K HD",
    year: 2026,
    status: "Completed",
    country: "USA",
    synopsis: "Construct powerful APIs. Learn Node.js file system APIs, Express routing triggers, MongoDB schemas, JWT authentication tokens implementation, and cross-origin security rules.",
    genres: ["NodeJS", "Backend", "API", "Database"],
    episodes: [
      {
        id: "node-ep1",
        number: 1,
        title: "Full Backend Service Course",
        duration: "3h 15m",
        sources: [
          { label: "Highspeed CDN", url: "https://www.w3schools.com/html/movie.mp4" }
        ]
      }
    ],
    comments: []
  }
];
