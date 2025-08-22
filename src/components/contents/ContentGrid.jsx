// src/components/contents/ContentGrid.jsx
import ContentCard from './ContentCard'

export default function ContentGrid({ posts = [] }) {
  if (!posts.length) return null
  return (
    <section className="content-grid">
      {posts.map((p) => (
        <ContentCard key={p.id} post={p} />
      ))}
    </section>
  )
}
