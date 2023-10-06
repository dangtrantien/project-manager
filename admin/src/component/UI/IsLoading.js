import style from './IsLoading.module.css';

// ==================================================

const IsLoading = () => {
  return (
    // Tạo trạng thái loading trước khi fetch data
    <section className={style['loading-container']}>
      <div className={style.loading}>
        <div className={style.color} />
      </div>

      <p>Loading...</p>
    </section>
  );
};

export default IsLoading;
