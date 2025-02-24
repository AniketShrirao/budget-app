import ComingSoon from '../components/ComingSoon';
import Loading from '../components/Loading';

const Income = () => {
  const loading = false; // Replace with actual loading logic

  if (loading) {
    return <Loading message="Loading income data..." />;
  }

  return (
    <div className="income-page">
      <ComingSoon />
    </div>
  );
};

export default Income;