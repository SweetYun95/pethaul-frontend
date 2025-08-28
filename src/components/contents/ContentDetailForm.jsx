import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateContentThunk,
  deleteContentThunk,
  uploadContentImageThunk,
  selectContentUploading,
} from '../../features/contentSlice'
import '../css/contents/ContentDetailForm.css'

/**
 * props
 * - value: 콘텐츠 객체(필수) {id,...}
 * - editable: boolean (편집 토글 버튼 노출)
 * - onClose, onSaved, onDeleted: 콜백
 */
export default function ContentDetailForm({ value, editable = true, onClose, onSaved, onDeleted }) {
  const dispatch = useDispatch()
  const globalUploading = useSelector(selectContentUploading)

  const defaults = useMemo(() => ({
    title: '',
    summary: '',
    body: '',
    tag: 'GUIDE',
    author: '',
    coverUrl: '',
    thumbUrl: '',
    isFeatured: false,
    status: 'published',
    publishedAt: '',
  }), [])

  const [form, setForm] = useState({ ...defaults, ...(value || {}) })
  const [editing, setEditing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState({ cover: false, thumb: false })

  useEffect(() => {
    setForm({ ...defaults, ...(value || {}) })
  }, [value, defaults])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleUpload = (e, field) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading((u) => ({ ...u, [field]: true }))
    dispatch(uploadContentImageThunk(file))
      .unwrap()
      .then(({ url }) => {
        const key = field === 'cover' ? 'coverUrl' : 'thumbUrl'
        setForm((f) => ({ ...f, [key]: url }))
      })
      .catch(() => alert('이미지 업로드 실패'))
      .finally(() => setUploading((u) => ({ ...u, [field]: false })))
  }

  const onSave = () => {
    if (!value?.id) return
    setBusy(true)
    const payload = {
      title: form.title?.trim(),
      summary: form.summary?.trim(),
      body: form.body,
      tag: form.tag || null,
      author: form.author || null,
      coverUrl: form.coverUrl,
      thumbUrl: form.thumbUrl,
      isFeatured: !!form.isFeatured,
      status: form.status,
      publishedAt: form.publishedAt || undefined,
    }
    dispatch(updateContentThunk({ id: value.id, payload }))
      .unwrap()
      .then((saved) => { onSaved?.(saved); setEditing(false) })
      .catch(() => alert('수정에 실패했습니다.'))
      .finally(() => setBusy(false))
  }

  const onDelete = () => {
    if (!value?.id) return
    const ok = window.confirm('정말로 삭제하시겠습니까?')
    if (!ok) return
    setBusy(true)
    dispatch(deleteContentThunk(value.id))
      .unwrap()
      .then(() => onDeleted?.(value.id))
      .catch(() => alert('삭제에 실패했습니다.'))
      .finally(() => setBusy(false))
  }

  return (
    <div className="detail-form">
      <div className="detail-head">
        <h1>콘텐츠 상세</h1>
        <div className="head-actions">
          {editable && (
            <button className="btn-secondary" onClick={() => setEditing((v) => !v)} disabled={busy}>
              {editing ? '편집 취소' : '편집'}
            </button>
          )}
          {onClose && <button className="btn-secondary" onClick={onClose} disabled={busy}>닫기</button>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-row">
          <label htmlFor="title">제목</label>
          <input id="title" name="title" value={form.title} onChange={onChange} disabled={!editing} />
        </div>
        <div className="form-row">
          <label htmlFor="tag">태그</label>
          <select id="tag" name="tag" value={form.tag} onChange={onChange} disabled={!editing}>
            <option value="GUIDE">GUIDE</option>
            <option value="TREND">TREND</option>
            <option value="STORY">STORY</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="author">작성자</label>
          <input id="author" name="author" value={form.author || ''} onChange={onChange} disabled={!editing} />
        </div>
        <div className="form-row">
          <label htmlFor="status">상태</label>
          <select id="status" name="status" value={form.status} onChange={onChange} disabled={!editing}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="summary">요약</label>
        <textarea id="summary" name="summary" rows={3} value={form.summary} onChange={onChange} disabled={!editing} />
      </div>

      <div className="form-row">
        <label htmlFor="body">본문</label>
        <textarea id="body" name="body" rows={8} value={form.body || ''} onChange={onChange} disabled={!editing} />
      </div>

      <div className="grid-2">
        <div className="form-row">
          <label>대표 이미지 (cover)</label>
          <div className="upload-row">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'cover')} disabled={!editing} />
            {(uploading.cover || globalUploading) && <span className="uploading">업로드 중…</span>}
          </div>
          {form.coverUrl && <img className="preview" src={form.coverUrl} alt="cover" />}
        </div>
        <div className="form-row">
          <label>썸네일 (thumb)</label>
          <div className="upload-row">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'thumb')} disabled={!editing} />
            {(uploading.thumb || globalUploading) && <span className="uploading">업로드 중…</span>}
          </div>
          {form.thumbUrl && <img className="preview" src={form.thumbUrl} alt="thumb" />}
        </div>
      </div>

      <div className="grid-3">
        <div className="form-row checkbox-row">
          <label htmlFor="isFeatured">상단 배너로 고정</label>
          <input id="isFeatured" name="isFeatured" type="checkbox" checked={!!form.isFeatured} onChange={onChange} disabled={!editing} />
        </div>
        <div className="form-row">
          <label htmlFor="publishedAt">발행일</label>
          <input id="publishedAt" name="publishedAt" type="datetime-local" value={form.publishedAt || ''} onChange={onChange} disabled={!editing} />
        </div>
      </div>

      <div className="detail-actions">
        {editable && editing && (
          <button className="btn-primary" onClick={onSave} disabled={busy}>
            {busy ? '저장 중…' : '저장'}
          </button>
        )}
        {editable && (
          <button className="btn-danger" onClick={onDelete} disabled={busy}>
            삭제
          </button>
        )}
      </div>
    </div>
  )
}
