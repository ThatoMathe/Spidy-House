import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';

const TeamMembers = () => {
  const team = [
    { name: 'Thato Mathe', role: 'Team Lead (Testing & Documentation)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
    { name: 'Thabiso Rivaldo Makale', role: 'Software Developer (Frontend Developer)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
    { name: 'Thabo Ronaldo Makale', role: 'Software Developer (Backend Developer)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
    { name: 'Tapiwanashe Mtombeni', role: 'Database Analyst (Design & Integration)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
    { name: 'Bongane Matewela', role: 'IT Specialist (Tech Support & Deployment)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
    { name: 'Boitumelo Shalang ', role: 'Security Analyst (AI Integration & Logic)', image: 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png' },
  ];

  return (
    <section className="bg-light py-5">
      <div className="container text-center">
        <h2 className="mb-4">Meet the Team</h2>

        <Swiper
          spaceBetween={20}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 3500 }}
          modules={[Autoplay]}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
          }}
        >
          {team.map((member, i) => (
            <SwiperSlide key={i}>
              <div className="text-center">
                <img
                  src={member.image}
                  className="rounded-circle mb-2"
                  width="100"
                  alt={`Team Member ${i + 1}`}
                />
                <h6>{member.name}</h6>
                <p style={{fontSize:"0.8rem"}}>{member.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TeamMembers;