export const ActionWrapper: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => {
  return (
    <div className="flex flex-col cursor-pointer" onClick={onClick}>
      {children}
    </div>
  );
};
