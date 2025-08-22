import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createContentThunk,
  updateContentThunk,
  uploadContentImageThunk,
  selectContentUploading,
} from '../../features/contentSlice'
import '../css/contents/AdminContentForm.css'

/**
 * props
 * - mode: 'create' | 'edit'
 * - initialValues: 수정 시 초기값
 * - onCancel: () => void
 * - onSuccess: (saved) => void
 */
export default function AdminContentForm({ mode = 'create', initialValues, onCancel, onSuccess }) {
  const dispatch = useDispatch()
  const submitting = useSelector((s) => s.content?.loading) ?? false
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

  const [form, setForm] = useState(defaults)
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState({ cover: false, thumb: false })

  useEffect(() => {
    setForm(initialValues ? { ...defaults, ...initialValues } : defaults)
  }, [initialValues, defaults])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const validate = () => {
    const e = {}
    if (!form.title?.trim()) e.title = '제목을 입력하세요.'
    if (!form.summary?.trim()) e.summary = '요약을 입력하세요.'
    if (!form.coverUrl?.trim()) e.coverUrl = '대표 이미지를 등록하세요.'
    if (!form.thumbUrl?.trim()) e.thumbUrl = '썸네일 이미지를 등록하세요.'
    return e
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body,
      tag: form.tag || null,
      author: form.author || null,
      coverUrl: form.coverUrl,
      thumbUrl: form.thumbUrl,
      isFeatured: !!form.isFeatured,
      status: form.status,
      publishedAt: form.publishedAt || undefined,
    }

    const action = mode === 'create'
      ? createContentThunk(payload)
      : updateContentThunk({ id: initialValues?.id, payload })

    dispatch(action)
      .unwrap()
      .then((saved) => onSuccess ? onSuccess(saved) : null)
      .catch(() => alert('저장에 실패했습니다.'))
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

  return (
    <form className="admin-form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="title">제목</label>
        <input id="title" name="title" value={form.title} onChange={onChange} />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="summary">요약</label>
        <textarea id="summary" name="summary" rows={3} value={form.summary} onChange={onChange} />
        {errors.summary && <p className="form-error">{errors.summary}</p>}
      </div>

      <div className="form-row">
        <label htmlFor="body">본문 (선택)</label>
        <textarea id="body" name="body" rows={8} value={form.body} onChange={onChange} />
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label htmlFor="tag">태그</label>
          <select id="tag" name="tag" value={form.tag} onChange={onChange}>
            <option value="GUIDE">GUIDE</option>
            <option value="TREND">TREND</option>
            <option value="STORY">STORY</option>
          </select>
        </div>
        <div className="form-row">
          <label htmlFor="author">작성자</label>
          <input id="author" name="author" value={form.author} onChange={onChange} />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-row">
          <label>대표 이미지 (cover)</label>
          <div className="upload-row">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'cover')} />
            {(uploading.cover || globalUploading) && <span className="uploading">업로드 중…</span>}
          </div>
          {form.coverUrl && <img className="preview" src={form.coverUrl} alt="cover preview" />}
          {errors.coverUrl && <p className="form-error">{errors.coverUrl}</p>}
        </div>

        <div className="form-row">
          <label>썸네일 (thumb)</label>
          <div className="upload-row">
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'thumb')} />
            {(uploading.thumb || globalUploading) && <span className="uploading">업로드 중…</span>}
          </div>
          {form.thumbUrl && <img className="preview" src={form.thumbUrl} alt="thumb preview" />}
          {errors.thumbUrl && <p className="form-error">{errors.thumbUrl}</p>}
        </div>
      </div>

      <div className="form-grid-3">
        <div className="form-row">
          <label htmlFor="status">상태</label>
          <select id="status" name="status" value={form.status} onChange={onChange}>
            <option value="published">published</option>
            <option value="draft">draft</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="publishedAt">발행일 (선택)</label>
          <input id="publishedAt" name="publishedAt" type="datetime-local" value={form.publishedAt} onChange={onChange} />
        </div>

        <div className="form-row checkbox-row">
          <label htmlFor="isFeatured">상단 배너로 고정</label>
          <input id="isFeatured" name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={onChange} />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>취소</button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? '저장 중…' : (mode === 'create' ? '등록' : '수정 저장')}
        </button>
      </div>
    </form>
  )
}
