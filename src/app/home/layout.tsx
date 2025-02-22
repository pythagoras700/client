export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
        {children}
    </div>
  );
}
