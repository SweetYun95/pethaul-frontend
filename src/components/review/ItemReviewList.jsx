import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'

import { useDispatch, useSelector } from 'react-redux'

function ItemReviewList({ item }) {
   console.log('🎁[ItemReviewList.jsx] 아이템 데이터 확인:', item)
   const Reviews = item.Reviews
   console.log('🎁[ItemReviewList.jsx] 리뷰 데이터 확인:', Reviews)
   console.log(Reviews.length)

   return (
      <>
         {item && (
            <Box>
               <Accordion>
                  <AccordionSummary>
                     <Typography>REVIEW</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     {Reviews.length > 0 ? (
                        Reviews?.map((review) => (
                           <Box
                              sx={{
                                 display: 'flex',
                                 justifyContent: 'space-around',
                              }}
                              key={review.id}
                           >
                              <Box>
                                 {review.ReviewImages.map((data, index) => (
                                    <img src={`${import.meta.env.VITE_APP_API_URL}${data.imgUrl}`} key={index} width="80px" />
                                 ))}
                              </Box>

                              <Typography
                                 sx={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '500px',
                                 }}
                              >
                                 {review?.reviewContent}
                              </Typography>
                              <Box maxWidth="120px">
                                 <Typography sx={{ fontWeight: 'bold' }}>{review.User.name}</Typography>
                                 <Typography>{review?.reviewDate.slice(0, 10)}</Typography>
                              </Box>
                           </Box>
                        ))
                     ) : (
                        <Typography>해당 상품에 등록된 리뷰가 없습니다.</Typography>
                     )}
                  </AccordionDetails>
               </Accordion>
            </Box>
         )}
      </>
   )
}

export default ItemReviewList
