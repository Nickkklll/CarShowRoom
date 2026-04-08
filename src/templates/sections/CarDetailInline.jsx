import { useEffect, useRef, useState } from 'react'
import { flyBack } from '@/scripts/flip-to-detail'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard } from 'swiper/modules'
import 'swiper/css'

export default function CarDetailInline({ car, onBack }) {
  const infoRef    = useRef(null)
  const reviewsRef = useRef(null)
  const backBtnRef = useRef(null)
  const formRef    = useRef(null)
  const swiperRef  = useRef(null)
  const sliderRef = useRef(null)

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [spaceBetween, setSpaceBetween] = useState(window.innerWidth)
  const [showForm, setShowForm]         = useState(false)
  const [comment, setComment]           = useState('')
  const [rating, setRating]             = useState(0)
  const [hovered, setHovered]           = useState(0)
  const [localReviews, setLocalReviews] = useState([])
  const [openMenuId, setOpenMenuId]     = useState(null)
  const [shakeStars, setShakeStars]     = useState(false)
  const [emptyField, setEmptyField]     = useState(false)
  const [activeIndex, setActiveIndex]   = useState(4)

  const totalSlides = car.images?.length ?? 0

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`reviews_${car.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        const migrated = parsed.map((r, i) => ({
          ...r,
          id: r.id ?? Date.now() + i,
          isOwn: r.isOwn ?? true,
        }))
        setLocalReviews(migrated)
        localStorage.setItem(`reviews_${car.id}`, JSON.stringify(migrated))
      }
    } catch {}
  }, [car.id])

  const allReviews = [...(car.reviews || []), ...localReviews]

 const handleSubmit = () => {
  const noRating  = rating === 0
  const noComment = !comment.trim()
  if (noRating) {
    setShakeStars(true)
    setTimeout(() => setShakeStars(false), 1000)
  }
  if (noComment) setEmptyField(true)
  if (noRating || noComment) return

  const newReview = {
    id: Date.now(),
    reviewerName: 'Ви',
    comment: comment.trim(),
    rating,
    date: new Date().toISOString(),
    isOwn: true,
  }
  const updated = [...localReviews, newReview]
  setLocalReviews(updated)
  try { localStorage.setItem(`reviews_${car.id}`, JSON.stringify(updated)) } catch {}
  setComment('')
  setRating(0)

 
  formRef.current?.classList.remove('review-form--open')
  setTimeout(() => setShowForm(false), 400)
  
  setIsPopupOpen(false)
}

  const handleDelete = (id) => {
    const updated = localReviews.filter(r => r.id !== id)
    setLocalReviews(updated)
    localStorage.setItem(`reviews_${car.id}`, JSON.stringify(updated))
    setOpenMenuId(null)
  }

  const openForm = () => {
  if (window.innerWidth < 1040) {
    setIsPopupOpen(true);
  } else {
    setShowForm(true);
    setTimeout(() => formRef.current?.classList.add('review-form--open'), 10);
  }
}


const closeForm = () => {
 
  formRef.current?.classList.remove('review-form--open');
  setTimeout(() => setShowForm(false), 400);
  

  setIsPopupOpen(false);
}

  useEffect(() => {
    const info    = infoRef.current
    const reviews = reviewsRef.current
    const backBtn = backBtnRef.current
    if (!info || !reviews || !backBtn) return

    const reset = (el, x) => {
      el.style.transition = 'none'
      el.style.opacity    = '0'
      el.style.transform  = `translateX(${x})`
    }
    const vw = window.innerWidth
    reset(info,    `-${vw}px`)
    reset(backBtn, `-${vw}px`)
    reset(reviews, `${vw}px`)

    const timer = setTimeout(() => {
      const t = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      info.style.transition    = t; info.style.opacity    = '1'; info.style.transform    = 'translateX(0)'
      backBtn.style.transition = t; backBtn.style.opacity = '1'; backBtn.style.transform = 'translateX(0)'
      reviews.style.transition = 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s'
      reviews.style.opacity    = '1'; reviews.style.transform = 'translateX(0)'

     const slider = sliderRef.current
if (slider) {
  slider.style.transition = 'none'
  slider.style.opacity = '0'

  
}

    }, 90)

    return () => clearTimeout(timer)
  }, [car])

  const handleBack = () => {
    const info    = infoRef.current
    const reviews = reviewsRef.current
    const backBtn = backBtnRef.current
    const vw      = window.innerWidth
    const t       = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.55, 0, 1, 0.45)'

    if (info)    { info.style.transition    = t; info.style.opacity    = '0'; info.style.transform    = `translateX(-${vw}px)` }
    if (backBtn) { backBtn.style.transition = t; backBtn.style.opacity = '0'; backBtn.style.transform = `translateX(-${vw}px)` }
    if (reviews) { reviews.style.transition = t; reviews.style.opacity = '0'; reviews.style.transform = `translateX(${vw}px)` }

    if (swiperRef.current && activeIndex !== 4) {
      swiperRef.current.slideTo(4, 300)
      setTimeout(() => flyBack(car, onBack), 350)
    } else {
      flyBack(car, onBack)
    }
  }

  return (
    <div className="car-detail">
      <button onClick={handleBack} className="back-btn" ref={backBtnRef}>
        <span>←</span> Back
      </button>
      <div className="car-detail__layout">
        <div className="car-detail__info glass-plate" ref={infoRef}>
          <h2>{car.title}</h2>
          <span className="car-detail__price">{car.price} $</span>
          <p className="detail__description">{car.description}</p>
        </div>

        <div
          className="car-detail__slider"
          ref={sliderRef}
          style={{ width: `${window.innerWidth * 0.55}px` }}
        >
          <Swiper
            modules={[Keyboard]}
            keyboard={{ enabled: true }}
            onSwiper={swiper => (swiperRef.current = swiper)}
            initialSlide={4}
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            speed={800}
            slidesPerView={1}
            loop={false}
            spaceBetween={spaceBetween}
            className="car-detail__swiper"
          >
            {car.images.map((src, i) => (
              <SwiperSlide key={i}>
                <img
                  src={src}
                  alt={`${car.title} ${i + 1}`}
                  className="car-detail__slide-img"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {activeIndex > 0 && (
            <button
              className="car-detail__arrow car-detail__arrow--prev glass-plate"
              onClick={() => swiperRef.current?.slidePrev()}
            >←</button>
          )}
          {activeIndex < totalSlides - 1 && (
            <button
              className="car-detail__arrow car-detail__arrow--next glass-plate"
              onClick={() => swiperRef.current?.slideNext()}
            >→</button>
          )}
        </div>
        <div className="reviews__block" ref={reviewsRef}>
          <div className="card-detail__reviews glass-plate">
            {allReviews.length > 0 && (
              <div className="car-reviews">
                <h2>Reviews</h2>
                <div className="car-reviews__list">
                  {allReviews.map((review, i) => {
                    const id = review.id ?? i
                    return (
                      <div className="car-review" key={id}>
                        <div className="car-review__header">
                          <span className="car-review__name">{review.reviewerName}</span>
                          <div className="car-review__header-right">
                            <span className="car-review__rating">
                              {'★'.repeat(Math.round(review.rating))}
                              {'☆'.repeat(5 - Math.round(review.rating))}
                            </span>
                            {review.isOwn && (
                              <div className="car-review__menu">
                                <button
                                  className="car-review__dots"
                                  onClick={() => setOpenMenuId(openMenuId === id ? null : id)}
                                >⋮</button>
                                {openMenuId === id && (
                                  <button
                                    className="car-review__delete"
                                    onClick={() => handleDelete(id)}
                                  >Delete</button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="car-review__comment">{review.comment}</p>
                        <span className="car-review__date">
                          {new Date(review.date).toLocaleDateString('uk-UA')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="review-form-wrapper">
            <button
              className={`car-detail__review-button glass-plate review-form-wrapper__trigger ${showForm ? 'hidden' : ''}`}
              onClick={openForm}
            >Leave a review</button>

            {showForm && (
              <div className="review-form glass-plate" ref={formRef}>
                <h3>Leave a review</h3>
                <div className={`review-form__stars ${shakeStars ? 'shake' : ''}`}>
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      className={`review-form__star ${star <= (hovered || rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                    >★</span>
                  ))}
                </div>
                <textarea
                  className={`review-form__textarea glass-plate ${emptyField ? 'error' : ''}`}
                  placeholder="Your comment..."
                  value={comment}
                  onChange={e => { setComment(e.target.value); if (e.target.value) setEmptyField(false) }}
                  rows={4}
                />
                <div className="review-form__actions">
                  <button className="car-detail__review-button form-btn glass-plate" onClick={closeForm}>Cancel</button>
                  <button className="car-detail__review-button form-btn glass-plate" onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
      <div className={`popup ${isPopupOpen ? 'isOpen-form' : ''}`}>
             <div className="review-form-bottom glass-plate" ref={formRef}>
                <h3>Leave a review</h3>
                <div className={`review-form__stars ${shakeStars ? 'shake' : ''}`}>
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      className={`review-form__star ${star <= (hovered || rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHovered(star)}
                      onMouseLeave={() => setHovered(0)}
                      onClick={() => setRating(star)}
                    >★</span>
                  ))}
                </div>
                <textarea
                  className={`review-form__textarea glass-plate ${emptyField ? 'error' : ''}`}
                  placeholder="Your comment..."
                  value={comment}
                  onChange={e => { setComment(e.target.value); if (e.target.value) setEmptyField(false) }}
                  rows={4}
                />
                <div className="review-form__actions">
                  <button className="car-detail__review-button form-btn glass-plate" onClick={closeForm} >Cancel</button>
                  <button className="car-detail__review-button form-btn glass-plate" onClick={handleSubmit}>Submit</button>
                </div>
              </div>

      </div>
     
    </div>
    
  )
}