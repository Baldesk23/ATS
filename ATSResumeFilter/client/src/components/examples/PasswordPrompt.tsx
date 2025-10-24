import PasswordPrompt from '../PasswordPrompt';

export default function PasswordPromptExample() {
  return (
    <PasswordPrompt
      onSuccess={() => console.log('Password correct!')}
    />
  );
}
