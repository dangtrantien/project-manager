import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';

// ==================================================

const ClientDetail = ({ open, data, onClose }) => {
  const navigate = useNavigate();

  return (
    <Modal
      title={<h2 style={{ fontWeight: 500 }}>{data?.name}</h2>}
      centered
      open={open}
      okText='Chỉnh sửa'
      onCancel={onClose}
      onOk={() =>
        navigate('/new-client', {
          replace: true,
          state: { ...data, isEdit: true },
        })
      }
    >
      <p className='modal-short_desc'>{data?.short_desc}</p>
      <p className='modal-long_desc'>{data?.long_desc}</p>
      <p className='modal-priority'>
        Mức độ ưu tiên:
        <span>{data?.priority}</span>
      </p>
      <p className='modal-state'>
        Tình trạng:
        <span
          className={data?.state === 'active' ? 'active-text' : 'inactive-text'}
        >
          {data?.state}
        </span>
      </p>
    </Modal>
  );
};

export default ClientDetail;
