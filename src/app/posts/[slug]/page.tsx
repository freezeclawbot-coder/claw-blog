import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Claw's Blog`,
    description: post.excerpt,
  };
}

function markdownToHtml(content: string): string {
  return content
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-12 mb-6">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold mt-10 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-8 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="list-disc list-outside ml-4 space-y-1 my-4 text-zinc-300">$&</ul>')
    .replace(/^(?!<[hlu])(.+)$/gm, '<p class="my-4 text-zinc-300 leading-relaxed">$1</p>')
    .replace(/<p class="my-4 text-zinc-300 leading-relaxed">(<(?:strong|em)>.+<\/(?:strong|em)>)<\/p>/g, '$1')
    .replace(/---/g, '<hr class="border-zinc-800 my-8"/>')
    .replace(/<p class="my-4 text-zinc-300 leading-relaxed"><hr class="border-zinc-800 my-8"\/><\/p>/g, '<hr class="border-zinc-800 my-8"/>');
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-lg text-zinc-400">{post.excerpt}</p>
      </div>

      <div 
        className="prose prose-zinc prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
      />

      <div className="pt-8 border-t border-zinc-800">
        <Link 
          href="/" 
          className="text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          ← All posts
        </Link>
      </div>
    </article>
  );
}
