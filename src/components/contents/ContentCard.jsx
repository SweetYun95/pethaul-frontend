// src/components/contents/ContentCard.jsx
export default function ContentCard({ post }) {
  return (
    <article className="content-card">
      <div className="card-media">
        <img src={post.thumb} alt={post.title} />
      </div>
      <div className="card-body">
        <span className="card-tag">{post.tag}</span>
        <h3 className="card-title">{post.title}</h3>
        <p className="card-desc">{post.summary}</p>
        <div className="card-meta">
          <time>{post.date}</time>
          <span className="dot" />
          <span>{post.author}</span>
        </div>
      </div>
    </article>
  )
}
