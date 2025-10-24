import JobOfferForm from '../JobOfferForm';

export default function JobOfferFormExample() {
  return (
    <JobOfferForm
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
