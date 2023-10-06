import style from './Profile.module.css';

// ==================================================

const Profile = ({ data }) => {
  return (
    <div className={style.container}>
      <div className={style['control-container']}>
        <p className={style.label}>Căn cước công dân :</p>

        <span className={style.content}>{data.idCard}</span>
      </div>

      <div className={style['control-container']}>
        <p className={style.label}>Giới tính :</p>

        <span className={style.content}>
          {data.gender === 'male' ? 'Nam' : 'Nữ'}
        </span>
      </div>

      <div className={style['control-container']}>
        <p className={style.label}>Ngày sinh :</p>

        <span className={style.content}>{data.dob}</span>
      </div>

      <div className={style['control-container']}>
        <p className={style.label}>Điện thoại :</p>

        <span className={style.content}>{data.phone}</span>
      </div>

      <div className={style['control-container']}>
        <p className={style.label}>Chứng chỉ :</p>

        <ul className={style['certificate-container']}>
          {data.certificate?.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      <div className={style['control-container']}>
        <p className={style.label}>Tech stack :</p>

        <ul className={style['tech-stack-container']}>
          {data.techStacks?.map((ts) => (
            <li key={ts._id} className={style['item-container']}>
              <div className={style['item-heading']}>
                <h3>{ts.techStack?.name}</h3>
              </div>

              <div className={style['item-content']}>
                <div className={style['item-control-container']}>
                  <p className={style.label}>Thời gian làm với tech stack :</p>

                  <span className={style.content}>
                    {ts.techStackExperience}
                  </span>
                </div>

                <div className={style['item-control-container']}>
                  <p className={style.label}>Framework sử dụng :</p>

                  <span className={style.content}>{ts.framework}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
