import Header from '../../component/Layout/Main/Header';
import ClientList from '../../component/Directory/Client/ClientList';

// ==================================================

const ClientPage = () => {
  return (
    <>
      <Header title='Client' linkTo='/new-client' />

      <ClientList />
    </>
  );
};

export default ClientPage;
