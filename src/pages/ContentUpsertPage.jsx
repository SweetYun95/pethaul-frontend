// src/pages/contents/ContentUpsertPage.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchContentByIdThunk } from '../features/contentSlice'
import AdminContentForm from '../components/contents/AdminContentForm'
import './css/ContentUpsertPage.css'

export default function ContentUpsertPage() {
  const { id } = useParams()
  const mode = id ? 'edit' : 'create'
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { current, loading, error } = useSelector((s) => s.content)

  useEffect(() => {
    if (id) {
      dispatch(fetchContentByIdThunk(id))
        .unwrap()
        .catch(() => {/* 에러는 slice.error로 노출됨 */})
    }
  }, [dispatch, id])

  return (
    <section className="blue-background">
      <div id='content-upsert'>
      <h1 className="section-title">
        {mode === 'create' ? '새 콘텐츠 등록' : '콘텐츠 수정'}
      </h1>
      <div className="contents-card">
        <div className="card-header">
          <div className="window-btn">
            <span className="red"></span>
            <span className="green"></span>
            <span className="blue"></span>
          </div>
          <span className="card-title">컨텐츠를 입력해주세요.</span>
        </div>
      <div className='admin-form-wrap'>
      {mode === 'create' && (
        <AdminContentForm
          mode="create"
          onCancel={() => navigate(-1)}
          onSuccess={() => navigate('/admin/contents')}
        />
      )}

      {mode === 'edit' && (
        <>
          {loading && !current && <div className="admin-form">불러오는 중…</div>}
          {error && !current && <div className="admin-form">오류: {String(error)}</div>}
          {current && (
            <AdminContentForm
              mode="edit"
              initialValues={current}
              onCancel={() => navigate(-1)}
              onSuccess={() => navigate('/admin/contents')}
            />
          )}
        </>
      )}
        </div>
        </div>
      </div>
    </section>
  )
}
