import '../css/contents/ContentCard.css'

export default function ContentCard({ post, onClick }) {
  return (
    <article className="content-card" onClick={() => onClick?.(post)}>
      <div className="card-media">
        <img src={post.thumbUrl || post.thumb} alt={post.title} />
      </div>
      <div className="card-body">
        {post.tag && <span className="card-tag">{post.tag}</span>}
        <h3 className="card-title">{post.title}</h3>
        {post.summary && <p className="card-desc">{post.summary}</p>}
        <div className="card-meta">
          <time>{post.publishedAt?.slice(0, 10) || post.date}</time>
          <span className="dot" />
          <span>{post.author}</span>
        </div>
      </div>
    </article>
  )
}
