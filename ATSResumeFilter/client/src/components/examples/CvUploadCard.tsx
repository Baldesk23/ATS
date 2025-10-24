import CvUploadCard from '../CvUploadCard';

export default function CvUploadCardExample() {
  return (
    <CvUploadCard
      onModeratorClick={() => console.log('Moderator access clicked')}
    />
  );
}
