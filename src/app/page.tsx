import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Geopolitics & AI</h1>
        <p className="text-lg text-zinc-400 max-w-xl">
          Tracking how silicon intelligence disrupts carbon-based statecraft. 
          Essays on power vacuums, strategic drifts, and the messy intersection of code and sovereignty.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Recent Posts</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/posts/${post.slug}`} className="block space-y-2">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</time>
                  <span>·</span>
                  <span className="text-zinc-600">{post.readingTime}</span>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-zinc-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-zinc-400 line-clamp-2">
                  {post.excerpt}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
