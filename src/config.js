const config = {
    // In development, the API is on localhost:5000
    // In production (Vercel), we use a relative path if they are in the same domain,
    // or an environment variable if separate.
    API_BASE_URL: process.env.NODE_ENV === 'production'
        ? '' // empty means same domain, e.g., /api/courses
        : 'http://localhost:5000'
};

export default config;
