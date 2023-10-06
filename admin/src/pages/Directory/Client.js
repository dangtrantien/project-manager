import Header from '../../component/Layout/Main/Header';
import ClientList from '../../component/Directory/Client/ClientList';

// ==================================================

const ClientPage = () => {
  return (
    <>
      <Header title='Nhóm khách hàng' linkTo='/new-client' />

      <ClientList />
    </>
  );
};

export default ClientPage;
