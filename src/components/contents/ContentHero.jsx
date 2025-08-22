// src/components/contents/ContentHero.jsx
export default function ContentHero({ post }) {
  if (!post) return null
  return (
    <section className="content-hero">
      <div className="hero-media">
        <img src={post.cover} alt={post.title} />
        <div className="hero-overlay">
          <span className="hero-tag">{post.tag}</span>
          <h2 className="hero-title">{post.title}</h2>
          <p className="hero-desc">{post.summary}</p>
        </div>
      </div>
    </section>
  )
}
