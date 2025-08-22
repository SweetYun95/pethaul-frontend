import '../css/admin/AdminFilters.css'

/**
 * Reusable Admin Filter Form
 * - statusOptions: [{value,label}]
 * - tagOptions: [{value,label}] | null
 * - values: { q, status, tag }
 * - onChange: { setQ, setStatus, setTag }
 * - onSearch: (e) => void
 * - rightSlot: ReactNode (e.g., "새 콘텐츠 등록" 버튼)
 */
export default function AdminFilterForm({
  title,
  statusOptions = [],
  tagOptions = null,
  values: { q = '', status = 'all', tag = '' } = {},
  onChange: { setQ, setStatus, setTag } = {},
  onSearch,
  onReset,
  rightSlot,
}) {
  return (
    <div className="admin-filter-wrap">
      <div className="admin-filter-header">
        {title && <h2>{title}</h2>}
        {rightSlot}
      </div>

      <form className="admin-filter-form" onSubmit={onSearch}>
        {/* status */}
        {statusOptions?.length > 0 && (
          <label className="admin-filter-field">
            <span className="admin-filter-label">상태</span>
            <select
              value={status}
              onChange={(e) => setStatus?.(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        )}

        {/* tag (옵션) */}
        {Array.isArray(tagOptions) && (
          <label className="admin-filter-field">
            <span className="admin-filter-label">태그</span>
            <select
              value={tag}
              onChange={(e) => setTag?.(e.target.value)}
            >
              {tagOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        )}

        {/* q */}
        <label className="admin-filter-field admin-filter-grow">
          <span className="admin-filter-label">검색</span>
          <input
            placeholder="검색어"
            value={q}
            onChange={(e) => setQ?.(e.target.value)}
          />
        </label>

        <div className="admin-filter-actions">
          <button className="btn-secondary" type="submit">검색</button>
          {onReset && (
            <button className="btn-ghost" type="button" onClick={onReset}>초기화</button>
          )}
        </div>
      </form>
    </div>
  )
}
