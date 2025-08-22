// src/components/contents/ContentGrid.jsx
import ContentCard from './ContentCard'
import '../css/contents/ContentGrid.css'

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
