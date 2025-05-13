import NavigationBar from './NavigationBar';

export default function Layout({ children }) {
  return (
    <>
      <NavigationBar />
      <div style={{ paddingTop: '72px' }}>
        {children}
      </div>
    </>
  );
} 