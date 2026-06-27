import { type RouteConfig, index, route } from "@react-router/dev/routes";
 
export default [
    index("routes/home.tsx"),
    route('visualizer/:id', './routes/visualizer.$id.tsx'),
    route('product', './routes/product.tsx'),
    route('pricing', './routes/pricing.tsx'),
    route('community', './routes/community.tsx'),
    route('enterprise', './routes/enterprise.tsx'),
    route('about', './routes/about.tsx'),
    route('privacy', './routes/privacy.tsx'),
    route('terms', './routes/terms.tsx'),
    route('security', './routes/security.tsx'),
    route('cookies', './routes/cookies.tsx'),
    route('blog', './routes/blog.tsx'),
    route('careers', './routes/careers.tsx'),
    route('contact', './routes/contact.tsx')
] satisfies RouteConfig;
